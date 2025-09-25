import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge, CategoryType } from '@/types';
import { unstable_cache } from 'next/cache';
import { Collection } from 'mongodb';
import { validateInput, VALIDATION_RULES, createValidationResponse } from '@/middleware/validation';
import { checkRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';
import { validateRequestSize, SIZE_LIMITS } from '@/middleware/requestSize';
import { TIMEOUTS } from '@/constants/timeouts';
import { createNotFoundResponse, createInternalErrorResponse } from '@/utils/errorUtils';
import { normalizeGuess, Language } from '@/helpers/autocompleteHelper';
import { logger } from '@/utils/logger';

// Cache the challenge data for 24 hours
const getChallengeData = unstable_cache(
  async (challengeId: string, language: 'en' | 'es') => {
    const { db } = await connectToDatabase();
    
    const challengesCollection = db.collection('challenges') as Collection<Challenge>;
    
    // Add timeout to prevent hanging queries
    const dbPromise = challengesCollection.findOne(
      { challengeId },
      { projection: { _id: 0, answer: 1, category: 1 } }
    ) as Promise<{ answer: string | { en: string; es: string }, category: CategoryType } | null>;
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timed out')), TIMEOUTS.DB_QUERY)
    );
    
    const challenge = await Promise.race([dbPromise, timeoutPromise]) as { answer: string | { en: string; es: string }, category: CategoryType } | null;

    if (!challenge) return null;

    // Get answer in requested language
    const answer = typeof challenge.answer === 'string'
      ? challenge.answer
      : challenge.answer[language] || challenge.answer.en;

    return {
      answer: answer.toLowerCase(),
      category: challenge.category
    };
  },
  ['challenge-data'],
  { revalidate: 86400 } // Cache for 24 hours
);

// Initialize database indexes
// Database indexes are initialized elsewhere to avoid Next.js route validation issues
export async function POST(request: Request) {
  try {
    // Rate limiting check
    const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.GUESS);
    if (rateLimitResponse) return rateLimitResponse;

    // Request size validation
    const sizeResponse = await validateRequestSize(request, SIZE_LIMITS.MEDIUM);
    if (sizeResponse) return sizeResponse;

    const { challengeId, guess, language = 'en' } = await request.json();
    
    // Validate inputs
    const errors: string[] = [];
    
    const challengeIdError = validateInput(challengeId, VALIDATION_RULES.challengeId);
    if (challengeIdError) errors.push(`challengeId: ${challengeIdError}`);
    
    const guessError = validateInput(guess, VALIDATION_RULES.guess);
    if (guessError) errors.push(`guess: ${guessError}`);
    
    const languageError = validateInput(language, VALIDATION_RULES.language);
    if (languageError) errors.push(`language: ${languageError}`);
    
    if (errors.length > 0) {
      return createValidationResponse(errors);
    }
    
    const challengeData = await getChallengeData(challengeId, language as 'en' | 'es');
    if (!challengeData) {
      return createNotFoundResponse('Challenge');
    }

    // Normalize the user's guess using autocomplete data
    const normalizedGuess = await normalizeGuess(
      challengeData.category,
      guess.trim(),
      language as Language
    );

    const isCorrect = normalizedGuess.toLowerCase() === challengeData.answer;

    return NextResponse.json({ isCorrect });
  } catch (error) {
    logger.error('Error verifying guess', { 
      component: 'verify-guess-api',
      operation: 'verifyGuess',
      error 
    });
    return createInternalErrorResponse();
  }
}