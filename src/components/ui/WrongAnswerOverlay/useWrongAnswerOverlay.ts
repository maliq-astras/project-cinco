import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { UserGuess } from '@/types';

interface UseWrongAnswerOverlayProps {
  maxGuesses: number;
}

export function useWrongAnswerOverlay({ maxGuesses }: UseWrongAnswerOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWrongGuessCount, setCurrentWrongGuessCount] = useState(0);
  const previousWrongGuessCount = useRef(0);
  
  // Get guesses from store
  const guesses = useGameStore(state => state.gameState.guesses);
  
  // Calculate total wrong guesses INCLUDING skips for display (excluding Final Five guesses)
  const totalWrongGuesses = guesses.filter((guess: UserGuess) => 
    !guess.isCorrect && 
    !guess.isFinalFiveGuess
  );
  const totalWrongGuessCount = totalWrongGuesses.length;
  
  // Calculate actual wrong guesses (excluding skips) for triggering overlay
  const actualWrongGuesses = guesses.filter((guess: UserGuess) => 
    !guess.isCorrect && 
    !guess.isFinalFiveGuess && 
    guess.guess !== "___SKIPPED___"
  );
  const actualWrongGuessCount = actualWrongGuesses.length;
  
  // Show overlay when actual wrong guess count increases (but display total count)
  useEffect(() => {
    if (actualWrongGuessCount > previousWrongGuessCount.current && totalWrongGuessCount <= maxGuesses) {
      // Check if the most recent guess was actually wrong (not a skip)
      const lastGuess = guesses[guesses.length - 1];
      const wasLastGuessActuallyWrong = lastGuess && !lastGuess.isCorrect && !lastGuess.isFinalFiveGuess && lastGuess.guess !== "___SKIPPED___";
      
      if (wasLastGuessActuallyWrong) {
        setCurrentWrongGuessCount(totalWrongGuessCount); // Display total including skips
        setIsVisible(true);
        
        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
        
        // Update the previous count to track actual wrong guesses
        previousWrongGuessCount.current = actualWrongGuessCount;
        
        return () => clearTimeout(timer);
      }
    }
  }, [actualWrongGuessCount, totalWrongGuessCount, maxGuesses, guesses]);
  
  // Handle manual close of overlay
  const handleAnimationComplete = () => {
    setIsVisible(false);
  };
  
  // Force hide overlay (useful for when Final Five starts, etc.)
  const hideOverlay = () => {
    setIsVisible(false);
  };
  
  return {
    isVisible,
    wrongGuessCount: currentWrongGuessCount,
    maxGuesses,
    onAnimationComplete: handleAnimationComplete,
    hideOverlay
  };
} 