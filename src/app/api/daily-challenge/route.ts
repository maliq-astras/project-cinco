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

// Database indexes are initialized elsewhere to avoid Next.js route validation issues

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

    // Add timeout handling for database query
    const dbPromise = challengesCollection.findOne(
      { date: today },
      { projection: { _id: 0 } }
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), TIMEOUTS.DB_QUERY)
    );

    const challenge = await Promise.race([dbPromise, timeoutPromise]) as Challenge | null;

    if (!challenge) {
      logger.info('No challenge found for today, attempting fallback', {
        component: 'daily-challenge-api',
        operation: 'getDailyChallenge',
        date: today
      });

      // Fallback: Get any available challenge if no challenge exists for today
      const fallbackChallenge = await challengesCollection.findOne(
        {},
        {
          projection: { _id: 0 },
          sort: { date: 1 } // Get the earliest challenge
        }
      ) as Challenge | null;

      if (fallbackChallenge) {
        logger.info('Using fallback challenge', {
          component: 'daily-challenge-api',
          operation: 'getDailyChallenge',
          fallbackDate: fallbackChallenge.date,
          targetDate: today
        });
      }

      return fallbackChallenge;
    }

    logger.info('Found daily challenge', {
      component: 'daily-challenge-api',
      operation: 'getDailyChallenge',
      challengeId: challenge.challengeId,
      category: challenge.category
    });

    return challenge;
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

    return NextResponse.json({
      ...challengeWithoutAnswer,
      facts: challenge.facts.map(fact => ({
        ...fact,
        content: typeof fact.content === 'string'
          ? fact.content // If content is already a string, keep it as is
          : (fact.content[language] || fact.content.en) // If content has language keys, get the right one
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