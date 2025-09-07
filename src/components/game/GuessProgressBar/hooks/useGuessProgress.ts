import { useState, useEffect, useRef } from 'react';
import { UserGuess } from '@/types';

interface UseGuessProgressProps {
  guesses: UserGuess[];
  maxGuesses: number;
  onShakeComplete?: () => void;
}

export function useGuessProgress({
  guesses,
  maxGuesses,
  onShakeComplete
}: UseGuessProgressProps) {
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
  
  useEffect(() => {
    if (wrongGuessCount > prevWrongGuessCount.current) {
      setIsShaking(true);
      
      setTimeout(() => {
        setIsShaking(false);
        if (onShakeComplete) {
          onShakeComplete();
        }
      }, 500);
    }
    
    prevWrongGuessCount.current = wrongGuessCount;
  }, [wrongGuessCount, onShakeComplete]);

  return {
    wrongGuesses,
    wrongGuessCount,
    animatedCount,
    isShaking
  };
} 