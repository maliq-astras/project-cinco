import { Challenge, UserGuess } from '../types';
import { TIMEOUTS } from '@/constants/timeouts';
import { logger } from '@/utils/logger';
import { getUserIdentifier } from '@/utils/sessionId';

// Constants
export const MAX_WRONG_GUESSES = 5;

export interface GameState {
  loading: boolean;
  error: string | null;
  challenge: Challenge | null;
  revealedFacts: number[];
  guesses: UserGuess[];
  isGameOver: boolean;
  finalFiveOptions: string[] | null;
}

export const initialGameState: GameState = {
  loading: true,
  error: null,
  challenge: null,
  revealedFacts: [],
  guesses: [],
  isGameOver: false,
  finalFiveOptions: null
};

export async function fetchChallenge(language: string = 'en', retries = 3): Promise<Challenge> {
  let lastError;
  
  // Try up to retries + 1 times in case of connection issues
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // If this isn't the first attempt, wait before retrying
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_SLOW);
      
      const response = await fetch(`/api/daily-challenge?lang=${language}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch challenge: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;
      // Only log on final attempt to avoid console spam
      if (attempt === retries) {
        logger.error('Error fetching challenge', { 
          component: 'gameLogic',
          operation: 'fetchChallenge',
          attempt,
          error 
        });
      }
    }
  }
  
  // If we get here, all attempts failed - instead of throwing, return a user-friendly error
  throw lastError || new Error('Failed to fetch challenge');
}

export async function verifyGuess(challengeId: string, guess: string, language: string = 'en', retries = 2): Promise<{ isCorrect: boolean }> {
  let lastError;
  
  // Try up to retries + 1 times in case of connection issues
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // If this isn't the first attempt, wait before retrying
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 800 * attempt));
      }
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_STANDARD);
      
      // Get session ID for rate limiting
      const sessionId = getUserIdentifier();
      
      const response = await fetch('/api/verify-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          challengeId,
          guess,
          language
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to verify guess: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      // Only log on final attempt to avoid console spam
      if (attempt === retries) {
        logger.error('Error verifying guess', { 
          component: 'gameLogic',
          operation: 'verifyGuess',
          attempt,
          error 
        });
      }
    }
  }
  
  // If we get here, all attempts failed
  throw lastError || new Error('Failed to verify guess');
}

export async function fetchFinalFiveOptions(challengeId: string, previousGuesses?: string[], language: string = 'en', retries = 3): Promise<string[]> {
  let lastError;
  
  // Try up to retries + 1 times in case of connection issues
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // If this isn't the first attempt, wait before retrying
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_SLOW);
      
      // If previous guesses are provided, use POST method
      let response;
      if (previousGuesses && previousGuesses.length > 0) {
        response = await fetch('/api/final-five', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId,
            previousGuesses,
            language
          }),
          signal: controller.signal
        });
      } else {
        // Otherwise use GET method
        response = await fetch(`/api/final-five?id=${challengeId}&lang=${language}`, {
          signal: controller.signal
        });
      }
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      // If the server returned an error, throw it
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch final five options');
      }
      
      // If no options or empty array, throw error
      if (!data.options || !Array.isArray(data.options) || data.options.length < 5) {
        throw new Error('Invalid options returned from server');
      }
      
      return data.options;
    } catch (error) {
      lastError = error;
      // Only log on final attempt to avoid console spam
      if (attempt === retries) {
        logger.error('Error fetching final five options', { 
          component: 'gameLogic',
          operation: 'fetchFinalFiveOptions',
          attempt,
          error 
        });
      }
    }
  }
  
  // If we get here, all attempts failed
  throw lastError || new Error('Failed to fetch final five options');
}

export function checkIsGameOver(guesses: UserGuess[]): boolean {
  // Check if any guess is correct
  return guesses.some(guess => guess.isCorrect);
}

export function shouldShowFinalFive(guesses: UserGuess[]): boolean {
  // Check if we've reached the maximum number of wrong guesses (excluding Final Five guesses)
  const wrongGuesses = guesses.filter(g => !g.isCorrect && !g.isFinalFiveGuess);
  return wrongGuesses.length >= MAX_WRONG_GUESSES;
}

export function isDuplicateGuess(guesses: UserGuess[], newGuess: string): boolean {
  return guesses.some(
    prevGuess => prevGuess.guess.toLowerCase() === newGuess.toLowerCase()
  );
}

export function capitalizeAnswer(answer: string): string {
  return answer
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
} 