import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';
import { unstable_cache } from 'next/cache';
import { Collection } from 'mongodb';
import { validateInput, VALIDATION_RULES, createValidationResponse } from '@/middleware/validation';
import { checkRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';
import { validateRequestSize, SIZE_LIMITS } from '@/middleware/requestSize';
import { TIMEOUTS } from '@/constants/timeouts';
import { createNotFoundResponse, createInternalErrorResponse } from '@/utils/errorUtils';
import { logger } from '@/utils/logger';

// Cache the answers for a challenge for 24 hours
const getChallengeAnswers = unstable_cache(
  async (challengeId: string, language: 'en' | 'es') => {
    const { db } = await connectToDatabase();
    
    const challengesCollection = db.collection('challenges') as Collection<Challenge>;
    
    // Add timeout to prevent hanging queries
    const dbPromise = challengesCollection.findOne(
      { challengeId },
      { projection: { _id: 0, answer: 1 } }
    ) as Promise<{ answer: string | { en: string; es: string } } | null>;
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timed out')), TIMEOUTS.DB_QUERY)
    );
    
    const challenge = await Promise.race([dbPromise, timeoutPromise]) as { answer: string | { en: string; es: string } } | null;

    if (!challenge) return null;

    // Get answer in requested language
    const answer = typeof challenge.answer === 'string'
      ? challenge.answer
      : challenge.answer[language] || challenge.answer.en;

    return answer.toLowerCase();
  },
  ['challenge-answers'],
  { revalidate: 86400 } // Cache for 24 hours
);

// Initialize database indexes
export async function initializeIndexes() {
  const { db } = await connectToDatabase();
  
  // Create indexes if they don't exist
  await db.collection('challenges').createIndex(
    { challengeId: 1 }, 
    { unique: true, name: 'challengeId_1' }
  );
  
  console.log('Verify-guess indexes initialized');
}

// Initialize indexes on startup
initializeIndexes().catch(console.error);

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.GUESS);
    if (rateLimitResponse) return rateLimitResponse;

    // Request size validation
    const sizeResponse = await validateRequestSize(request, SIZE_LIMITS.SMALL);
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
    
    const answer = await getChallengeAnswers(challengeId, language as 'en' | 'es');
    if (!answer) {
      return createNotFoundResponse('Challenge');
    }

    const normalizedGuess = guess.trim().toLowerCase();
    const isCorrect = normalizedGuess === answer;

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