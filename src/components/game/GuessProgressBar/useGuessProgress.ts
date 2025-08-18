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
  // Filter to only wrong guesses (excluding Final Five guesses)
  const wrongGuesses = guesses.filter(guess => !guess.isCorrect && !guess.isFinalFiveGuess);
  const wrongGuessCount = wrongGuesses.length;
  
  // State to track animation
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const prevWrongGuessCount = useRef(0);
  
  // Update animated count when wrong guesses change
  useEffect(() => {
    if (wrongGuessCount > animatedCount) {
      // Delay the animation slightly for effect
      const timer = setTimeout(() => {
        setAnimatedCount(wrongGuessCount);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessCount, animatedCount, maxGuesses]);
  
  // Trigger shake animation when wrong guesses increase
  useEffect(() => {
    if (wrongGuessCount > prevWrongGuessCount.current) {
      setIsShaking(true);
      
      // Note: Toast notification removed - now using WrongAnswerOverlay instead
      
      // Reset shake after animation completes
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