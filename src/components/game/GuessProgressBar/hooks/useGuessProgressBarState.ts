import { useState, useEffect, useRef } from 'react';
import { UserGuess } from '@/types';

interface UseGuessProgressBarStateProps {
  guesses: UserGuess[];
  maxGuesses: number;
}

export function useGuessProgressBarState({
  guesses,
  maxGuesses
}: UseGuessProgressBarStateProps) {
  const wrongGuesses = guesses.filter(guess => !guess.isCorrect && !guess.isFinalFiveGuess);
  const wrongGuessCount = wrongGuesses.length;
  
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const prevWrongGuessCount = useRef(0);

  useEffect(() => {
    if (wrongGuessCount > animatedCount) {
      const timer = setTimeout(() => {
        setAnimatedCount(wrongGuessCount);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessCount, animatedCount, maxGuesses]);

  return {
    wrongGuessCount,
    animatedCount,
    isShaking,
    setIsShaking,
    prevWrongGuessCount
  };
}