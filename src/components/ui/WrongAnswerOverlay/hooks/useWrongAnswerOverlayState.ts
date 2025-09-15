import { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { UserGuess } from '@/types';

interface UseWrongAnswerOverlayStateProps {
  maxGuesses: number;
}

export function useWrongAnswerOverlayState({ maxGuesses: _maxGuesses }: UseWrongAnswerOverlayStateProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWrongGuessCount, setCurrentWrongGuessCount] = useState(0);
  const [modalAnimation, setModalAnimation] = useState("visible");
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

  return {
    isVisible,
    setIsVisible,
    currentWrongGuessCount,
    setCurrentWrongGuessCount,
    modalAnimation,
    setModalAnimation,
    previousWrongGuessCount,
    guesses,
    totalWrongGuessCount,
    actualWrongGuessCount
  };
}