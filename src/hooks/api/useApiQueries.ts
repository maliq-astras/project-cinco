import { useQuery, useMutation } from '@tanstack/react-query';
import { Challenge } from '@/types';

/**
 * Fetches a challenge from the API
 */
async function fetchChallengeFromApi(language: string = 'en'): Promise<Challenge> {
  const response = await fetch(`/api/daily-challenge?lang=${language}`);
  if (!response.ok) {
    throw new Error('Failed to fetch challenge');
  }
  const data = await response.json();
  return data;
}

/**
 * Verifies a guess with the API
 */
async function verifyGuessWithApi(params: { 
  challengeId: string; 
  guess: string;
  language: string;
}): Promise<{ isCorrect: boolean }> {
  const { challengeId, guess, language } = params;
  const response = await fetch('/api/verify-guess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      challengeId,
      guess,
      language
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to verify guess');
  }
  
  return await response.json();
}

/**
 * Fetches final five options from the API
 */
async function fetchFinalFiveOptionsFromApi(params: {
  challengeId: string;
  previousGuesses?: string[];
  language?: string;
  retries?: number;
}): Promise<string[]> {
  const { challengeId, previousGuesses = [], language = 'en', retries = 3 } = params;
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
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
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
        console.error('Error fetching final five options:', error);
      }
    }
  }
  
  // If we get here, all attempts failed
  throw lastError || new Error('Failed to fetch final five options');
}

/**
 * Custom hook to fetch a challenge
 */
export function useChallenge(language: string = 'en') {
  return useQuery({
    queryKey: ['challenge', language],
    queryFn: () => fetchChallengeFromApi(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Custom hook to verify a guess
 */
export function useVerifyGuess() {
  return useMutation({
    mutationFn: verifyGuessWithApi,
    // On success, invalidate any relevant queries
    onSuccess: () => {
      // We don't need to invalidate anything here since
      // the game state is mostly managed by Zustand
    }
  });
}

/**
 * Custom hook to fetch final five options
 */
export function useFinalFiveOptions(params: {
  challengeId: string;
  previousGuesses: string[];
  language: string;
  enabled?: boolean;
}) {
  const { challengeId, previousGuesses, language, enabled = true } = params;
  
  return useQuery({
    queryKey: ['finalFiveOptions', challengeId, previousGuesses, language],
    queryFn: () => fetchFinalFiveOptionsFromApi({
      challengeId,
      previousGuesses,
      language
    }),
    enabled: enabled && !!challengeId, // Only run if enabled and we have a challengeId
    staleTime: Infinity, // The options should never change for a given challenge and set of guesses
    gcTime: 1000 * 60 * 60, // Cache for 1 hour (formerly called cacheTime)
  });
} 