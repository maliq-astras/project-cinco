import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateInput, VALIDATION_RULES, createValidationResponse } from '@/middleware/validation';
import { checkRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';
import { validateRequestSize, SIZE_LIMITS } from '@/middleware/requestSize';
import { TIMEOUTS } from '@/constants/timeouts';
import { createNotFoundResponse, createServiceUnavailableResponse } from '@/utils/errorUtils';
import { logger } from '@/utils/logger';

// Cache for challenge answers to reduce database load
const answerCache = new Map<string, string>();

type ChallengeWithAnswer = {
  answer: string | { [key: string]: string };
};

// Database indexes are initialized elsewhere to avoid Next.js route validation issues

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.FINAL_FIVE);
    if (rateLimitResponse) return rateLimitResponse;

    // Request size validation
    const sizeResponse = await validateRequestSize(request, SIZE_LIMITS.SMALL);
    if (sizeResponse) return sizeResponse;

    const { challengeId, language = 'en' } = await request.json();
    
    // Validate inputs
    const errors: string[] = [];
    
    const challengeIdError = validateInput(challengeId, VALIDATION_RULES.challengeId);
    if (challengeIdError) errors.push(`challengeId: ${challengeIdError}`);
    
    const languageError = validateInput(language, VALIDATION_RULES.language);
    if (languageError) errors.push(`language: ${languageError}`);
    
    if (errors.length > 0) {
      return createValidationResponse(errors);
    }
    
    // Try to get cached answer
    const cacheKey = `${challengeId}-${language}`;
    let answer = answerCache.get(cacheKey);
    
    if (!answer) {
      const { db } = await connectToDatabase();
      
      // Find the challenge with a timeout
      const dbPromise = db.collection('challenges').findOne(
        { challengeId },
        { projection: { _id: 0, answer: 1 } }
      ) as Promise<ChallengeWithAnswer | null>;
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timed out')), TIMEOUTS.DB_HEAVY_QUERY)
      );
      
      const challenge = await Promise.race([dbPromise, timeoutPromise]) as ChallengeWithAnswer | null;
      
      if (!challenge) {
        return createNotFoundResponse('Challenge');
      }
      
      // Get the answer in the requested language
      let fetchedAnswer: string;
      
      if (typeof challenge.answer === 'string') {
        fetchedAnswer = challenge.answer;
      } else {
        fetchedAnswer = challenge.answer[language] || challenge.answer.en || '';
      }
      
      if (!fetchedAnswer) {
        return createNotFoundResponse('Answer for language');
      }
      
      answer = fetchedAnswer;
        
      // Cache the result for 5 minutes
      answerCache.set(cacheKey, answer);
      setTimeout(() => answerCache.delete(cacheKey), 5 * 60 * 1000);
    }
      
    return NextResponse.json({ answer });
  } catch (error) {
    logger.error('Error fetching answer', { 
      component: 'final-five-answer-api',
      operation: 'fetchAnswer',
      error 
    });
    return createServiceUnavailableResponse();
  }
} 