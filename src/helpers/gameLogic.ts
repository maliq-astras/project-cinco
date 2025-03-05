import { Challenge, UserGuess } from '../types';

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

export async function fetchChallenge(): Promise<Challenge> {
  const response = await fetch('/api/daily-challenge');
  if (!response.ok) {
    throw new Error('Failed to fetch challenge');
  }
  const data = await response.json();
  return data;
}

export async function verifyGuess(challengeId: string, guess: string): Promise<{ isCorrect: boolean }> {
  const response = await fetch('/api/verify-guess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      challengeId,
      guess
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to verify guess');
  }
  
  return await response.json();
}

export async function fetchFinalFiveOptions(challengeId: string): Promise<string[]> {
  const response = await fetch(`/api/final-five?id=${challengeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch final five options');
  }
  
  const data = await response.json();
  return data.options;
}

export function checkIsGameOver(guesses: UserGuess[]): boolean {
  // Check if any guess is correct
  return guesses.some(guess => guess.isCorrect);
}

export function shouldShowFinalFive(guesses: UserGuess[]): boolean {
  // Check if we've reached the maximum number of wrong guesses
  const wrongGuesses = guesses.filter(g => !g.isCorrect);
  return wrongGuesses.length >= MAX_WRONG_GUESSES;
}

export function isDuplicateGuess(guesses: UserGuess[], newGuess: string): boolean {
  return guesses.some(
    prevGuess => prevGuess.guess.toLowerCase() === newGuess.toLowerCase()
  );
} 