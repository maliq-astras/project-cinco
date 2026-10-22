import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';
import { unstable_cache } from 'next/cache';
import { Collection } from 'mongodb';
import { validateInput, VALIDATION_RULES } from '@/middleware/validation';
import { checkRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';
import { TIMEOUTS } from '@/constants/timeouts';
import { createValidationErrorResponse, createNotFoundResponse, createInternalErrorResponse } from '@/utils/errorUtils';
import { logger } from '@/utils/logger';
import { getEasternDateString } from '@/utils/easternTime';
import { selectChallengeForDate } from '@/utils/challengeSchedule';

// Database indexes are initialized elsewhere to avoid Next.js route validation issues

async function queryWithTimeout<T>(query: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      query,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Database query timed out')), TIMEOUTS.DB_QUERY);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function localizeFactContent(
  content: Challenge['facts'][number]['content'] | null | undefined,
  language: 'en' | 'es'
): string {
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object') {
    return content[language] || content.en || '';
  }
  return '';
}

// Cache the daily challenge fetch for 5 minutes
// Cache is automatically invalidated at Eastern midnight due to date-based cache key
const getDailyChallenge = unstable_cache(
  async (targetDate: string) => {
    const { db } = await connectToDatabase();
    const today = targetDate || getEasternDateString(); // Eastern Time date

    logger.info('Fetching daily challenge', {
      component: 'daily-challenge-api',
      operation: 'getDailyChallenge',
      date: today
    });

    const challengesCollection = db.collection('challenges') as Collection<Challenge>;

    const scheduled = await queryWithTimeout(
      challengesCollection.findOne(
        { date: today },
        { projection: { _id: 0 } }
      )
    ) as Challenge | null;

    if (scheduled) {
      logger.info('Found daily challenge', {
        component: 'daily-challenge-api',
        operation: 'getDailyChallenge',
        challengeId: scheduled.challengeId,
        category: scheduled.category
      });
      return scheduled;
    }

    // Seeded dates are a finite list. After the last one, walk that same
    // order again so a new challenge is served every day.
    logger.info('No challenge scheduled for today, recycling roster', {
      component: 'daily-challenge-api',
      operation: 'getDailyChallenge',
      date: today
    });

    const roster = await queryWithTimeout(
      challengesCollection
        .find({}, { projection: { _id: 0 } })
        .sort({ date: 1 })
        .toArray()
    ) as Challenge[];

    const selected = selectChallengeForDate(roster, today);
    if (!selected) return null;

    logger.info('Serving recycled challenge', {
      component: 'daily-challenge-api',
      operation: 'getDailyChallenge',
      challengeId: selected.challenge.challengeId,
      category: selected.challenge.category,
      servedDate: today,
      rosterSize: roster.length
    });

    return selected.challenge;
  },
  ['daily-challenge'], // Base cache key
  {
    revalidate: 300 // Cache for 5 minutes - automatically invalidated by date-based cache key
  }
);

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.DAILY_CHALLENGE);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'en') as 'en' | 'es';
    
    // Validate language parameter
    const languageError = validateInput(language, VALIDATION_RULES.language);
    if (languageError) {
      return createValidationErrorResponse([`language: ${languageError}`]);
    }
    
    const today = getEasternDateString();
    const challenge = await getDailyChallenge(today);
    
    if (!challenge) {
      return createNotFoundResponse('Challenge for today');
    }

    // Return the challenge with facts content in the requested language
    // Remove the answer from the response for security
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { answer, ...challengeWithoutAnswer } = challenge;

    const facts = Array.isArray(challenge.facts) ? challenge.facts : [];

    return NextResponse.json({
      ...challengeWithoutAnswer,
      facts: facts.map(fact => ({
        ...fact,
        content: localizeFactContent(fact?.content, language)
      })),
      // Include metadata and expanded content for answer details
      metadata: challenge.metadata ? {
        imageUrl: challenge.metadata.imageUrl,
        citation: challenge.metadata.citation,
        source: challenge.metadata.source
        // Don't include importedAt in the client response
      } : undefined,
      // Include expanded content for answer details modal
      expanded: challenge.metadata?.expanded
    });
  } catch (error) {
    logger.error('Error fetching daily challenge', { 
      component: 'daily-challenge-api',
      operation: 'fetchChallenge',
      error 
    });
    return createInternalErrorResponse();
  }
}