// src/app/api/final-five/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';

type FinalFiveRequest = {
  challengeId: string;
  previousGuesses?: string[];
  language?: 'en' | 'es';
};

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
      const dbPromise = (db.collection('challenges') as any).findOne({ challengeId });
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
  console.log('Processing alternatives - before filtering:', alternatives.length);
  
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
    
    if (!shouldKeep) {
      console.log(`Filtering out alternative: "${alt}" - Already guessed: ${isAlreadyGuessed}, Is answer: ${isAnswer}`);
    }
    
    return shouldKeep;
  });
  
  console.log('Processing alternatives - after filtering:', availableAlternatives.length);
  
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
    const { challengeId, previousGuesses = [], language = 'en' } = await request.json() as FinalFiveRequest;
    
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
    
    console.log('Final Five API - Previous guesses:', normalizedPreviousGuesses);
    
    // Process alternatives
    const availableAlternatives = processAlternatives(
      alternatives,
      allAnswers,
      normalizedPreviousGuesses,
      answer,
      previousGuesses,
      challengeId,
      language
    );
    
    // Create and shuffle options
    const shuffledOptions = createFinalFiveOptions(answer, availableAlternatives);
    
    // Double-check no previous guesses are included
    const finalOptions = shuffledOptions.filter(option => 
      !normalizedPreviousGuesses.includes(option.trim().toLowerCase())
    );
    
    console.log('Final Five API - Returning options:', finalOptions);
    
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
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('id');
    const previousGuessesParam = searchParams.get('previousGuesses');
    const language = (searchParams.get('lang') || 'en') as 'en' | 'es';
    
    if (!challengeId) {
      return NextResponse.json(
        { error: 'Missing challenge ID' }, 
        { status: 400 }
      );
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
    
    console.log('Final Five API - Previous guesses:', normalizedPreviousGuesses);
    
    // Process alternatives
    const availableAlternatives = processAlternatives(
      alternatives,
      allAnswers,
      normalizedPreviousGuesses,
      answer,
      previousGuesses,
      challengeId,
      language
    );
    
    // Create and shuffle options
    const shuffledOptions = createFinalFiveOptions(answer, availableAlternatives);
    
    // Double-check no previous guesses are included
    const finalOptions = shuffledOptions.filter(option => 
      !normalizedPreviousGuesses.includes(option.trim().toLowerCase())
    );
    
    console.log('Final Five API - Returning options:', finalOptions);
    
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