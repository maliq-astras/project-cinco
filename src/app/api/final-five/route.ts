// src/app/api/final-five/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';
import { validateInput, VALIDATION_RULES, createValidationResponse } from '@/middleware/validation';
import { checkRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';
import { validateRequestSize, SIZE_LIMITS } from '@/middleware/requestSize';

type FinalFiveRequest = {
  challengeId: string;
  previousGuesses?: string[];
  language?: 'en' | 'es';
};

// Initialize database indexes
export async function initializeIndexes() {
  const { db } = await connectToDatabase();
  
  // Create indexes if they don't exist
  await db.collection('challenges').createIndex(
    { challengeId: 1 }, 
    { unique: true, name: 'challengeId_1' }
  );
}

// Initialize indexes on startup
initializeIndexes().catch(console.error);

// Cache for challenge data to reduce database load
const challengeCache = new Map<string, any>();

/**
 * Fetches a challenge by ID with caching
 */
async function fetchChallengeById(challengeId: string, language: string = 'en') {
  if (!challengeId) {
    return { error: 'Missing challenge ID', status: 400 };
  }
  
  // Try to get cached challenge
  const cacheKey = `${challengeId}-${language}`;
  let challenge = challengeCache.get(cacheKey);
  
  if (!challenge) {
    try {
      const { db } = await connectToDatabase();
      
      // Find the challenge with a timeout
      const dbPromise = db.collection('challenges').findOne(
        { challengeId },
        { 
          projection: { 
            _id: 0, 
            answer: 1, 
            alternatives: 1, 
            category: 1 
          } 
        }
      );
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timed out')), 15000)
      );
      
      challenge = await Promise.race([dbPromise, timeoutPromise]);
      
      if (challenge) {
        // Cache the result for 5 minutes
        challengeCache.set(cacheKey, challenge);
        setTimeout(() => challengeCache.delete(cacheKey), 5 * 60 * 1000);
      }
    } catch (error) {
      console.error('Database error:', error);
      return { error: 'Connection error - please try again', status: 503 };
    }
  }
  
  if (!challenge) {
    return { error: 'Challenge not found', status: 404 };
  }
  
  return { challenge };
}

/**
 * Get the localized answer and alternatives from a challenge
 */
function getLocalizedChallengeContent(challenge: any, language: string = 'en') {
  // Get the answer in the requested language
  const answer = typeof challenge.answer === 'string' 
    ? challenge.answer 
    : challenge.answer[language] || challenge.answer.en;
  
  // Get the alternatives in the requested language
  const alternatives = Array.isArray(challenge.alternatives)
    ? challenge.alternatives
    : challenge.alternatives[language] || challenge.alternatives.en;
    
  // Get all possible answers in all languages
  const allAnswers = typeof challenge.answer === 'string'
    ? [challenge.answer.toLowerCase()]
    : (Object.values(challenge.answer) as string[]).map(a => a.toLowerCase());
    
  return { answer, alternatives, allAnswers };
}

/**
 * Process and filter alternatives based on previous guesses
 */
function processAlternatives(
  alternatives: string[], 
  allAnswers: string[], 
  normalizedPreviousGuesses: string[],
  answer: string,
  previousGuesses: string[],
  challengeId: string,
  language: string
) {  
  // Filter out alternatives that:
  // 1. Have already been guessed
  // 2. Are answers in any language
  let availableAlternatives = alternatives.filter((alt: string) => {
    const normalizedAlt = alt.trim().toLowerCase();
    
    // Check if it's already been guessed
    const isAlreadyGuessed = normalizedPreviousGuesses.includes(normalizedAlt);
    
    // Check if it's an answer in any language
    const isAnswer = allAnswers.includes(normalizedAlt);
    
    // Only keep if not guessed and not an answer
    const shouldKeep = !isAlreadyGuessed && !isAnswer;
    
    return shouldKeep;
  });
  
  // Ensure we only return 4 alternatives (plus the correct answer)
  availableAlternatives = availableAlternatives.slice(0, 4);
  
  // If we don't have enough alternatives, this is a data issue
  if (availableAlternatives.length < 4) {
    console.error(`Not enough alternatives for challenge ${challengeId} in ${language}`);
    
    // We still have to handle this case, but log it as a data error
    // Fill with some of the prior used options (but marked so they're identifiable)
    const remainingNeeded = 4 - availableAlternatives.length;
    for (let i = 0; i < remainingNeeded; i++) {
      // This is just for data integrity - the game should have proper alternatives
      if (i < previousGuesses.length) {
        availableAlternatives.push(previousGuesses[i] + " (used)");
      } else {
        // Last resort - should never happen with proper data
        availableAlternatives.push(answer + ` (similar ${i+1})`);
      }
    }
  }
  
  return availableAlternatives;
}

/**
 * Create and shuffle the final five options
 */
function createFinalFiveOptions(answer: string, availableAlternatives: string[]) {
  // Create the Final 5 options with the correct answer and 4 alternatives
  const finalFiveOptions = [
    answer,
    ...availableAlternatives
  ];
  
  // Shuffle the options
  return finalFiveOptions.sort(() => Math.random() - 0.5);
}

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.FINAL_FIVE);
    if (rateLimitResponse) return rateLimitResponse;

    // Request size validation
    const sizeResponse = await validateRequestSize(request, SIZE_LIMITS.MEDIUM);
    if (sizeResponse) return sizeResponse;

    const { challengeId, previousGuesses = [], language = 'en' } = await request.json() as FinalFiveRequest;
    
    // Validate inputs
    const errors: string[] = [];
    
    const challengeIdError = validateInput(challengeId, VALIDATION_RULES.challengeId);
    if (challengeIdError) errors.push(`challengeId: ${challengeIdError}`);
    
    const languageError = validateInput(language, VALIDATION_RULES.language);
    if (languageError) errors.push(`language: ${languageError}`);
    
    const previousGuessesError = validateInput(previousGuesses, VALIDATION_RULES.previousGuesses);
    if (previousGuessesError) errors.push(`previousGuesses: ${previousGuessesError}`);
    
    if (errors.length > 0) {
      return createValidationResponse(errors);
    }
    
    // Fetch the challenge
    const result = await fetchChallengeById(challengeId, language);
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    
    const { challenge } = result;
    
    // Get localized content
    const { answer, alternatives, allAnswers } = getLocalizedChallengeContent(challenge, language);
    
    // Normalize previous guesses
    const normalizedPreviousGuesses = previousGuesses.map(guess => 
      guess.trim().toLowerCase()
    );
      
    // Process alternatives
    const availableAlternatives = processAlternatives(
      alternatives,
      allAnswers,
      normalizedPreviousGuesses,
      answer,
      previousGuesses,
      challengeId!,
      language
    );
    
    // Create and shuffle options
    const shuffledOptions = createFinalFiveOptions(answer, availableAlternatives);
    
    // Double-check no previous guesses are included
    const finalOptions = shuffledOptions.filter(option => 
      !normalizedPreviousGuesses.includes(option.trim().toLowerCase())
    );
    
    return NextResponse.json({
      options: finalOptions
    });
  } catch (error) {
    console.error('Error fetching Final Five options:', error);
    // Return a proper error response
    return NextResponse.json(
      { error: 'Service unavailable - please try again' }, 
      { status: 503 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.FINAL_FIVE);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('id');
    const previousGuessesParam = searchParams.get('previousGuesses');
    const language = (searchParams.get('lang') || 'en') as 'en' | 'es';
    
    // Validate inputs
    const errors: string[] = [];
    
    const challengeIdError = validateInput(challengeId, VALIDATION_RULES.challengeId);
    if (challengeIdError) errors.push(`challengeId: ${challengeIdError}`);
    
    const languageError = validateInput(language, VALIDATION_RULES.language);
    if (languageError) errors.push(`language: ${languageError}`);
    
    if (errors.length > 0) {
      return createValidationResponse(errors);
    }
    
    // Fetch the challenge (challengeId is guaranteed to be valid string after validation)
    const result = await fetchChallengeById(challengeId!, language);
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    
    const { challenge } = result;
    
    // Get localized content
    const { answer, alternatives, allAnswers } = getLocalizedChallengeContent(challenge, language);
    
    // Parse previous guesses if provided
    let previousGuesses: string[] = [];
    if (previousGuessesParam) {
      try {
        previousGuesses = JSON.parse(previousGuessesParam);
      } catch (e) {
        console.error('Error parsing previousGuesses:', e);
      }
    }
    
    // Normalize previous guesses
    const normalizedPreviousGuesses = previousGuesses.map(guess => 
      guess.trim().toLowerCase()
    );
    
    // Process alternatives
    const availableAlternatives = processAlternatives(
      alternatives,
      allAnswers,
      normalizedPreviousGuesses,
      answer,
      previousGuesses,
      challengeId!,
      language
    );
    
    // Create and shuffle options
    const shuffledOptions = createFinalFiveOptions(answer, availableAlternatives);
    
    // Double-check no previous guesses are included
    const finalOptions = shuffledOptions.filter(option => 
      !normalizedPreviousGuesses.includes(option.trim().toLowerCase())
    );
    
    return NextResponse.json({
      options: finalOptions
    });
  } catch (error) {
    console.error('Error fetching Final Five options:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}