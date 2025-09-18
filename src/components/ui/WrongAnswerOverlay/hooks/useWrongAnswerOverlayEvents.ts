import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

interface Guess {
  isCorrect: boolean;
  isFinalFiveGuess: boolean;
  guess: string;
}

interface UseWrongAnswerOverlayEventsProps {
  isVisible: boolean;
  actualWrongGuessCount: number;
  totalWrongGuessCount: number;
  maxGuesses: number;
  _guesses: Guess[];
  previousWrongGuessCount: React.MutableRefObject<number>;
  setCurrentWrongGuessCount: (count: number) => void;
  setIsVisible: (visible: boolean) => void;
  setModalAnimation: (animation: string) => void;
}

export function useWrongAnswerOverlayEvents({
  isVisible,
  actualWrongGuessCount,
  totalWrongGuessCount,
  maxGuesses,
  _guesses,
  previousWrongGuessCount,
  setCurrentWrongGuessCount,
  setIsVisible,
  setModalAnimation
}: UseWrongAnswerOverlayEventsProps) {
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const hasInitialized = useRef(false);

  // Initialize previousWrongGuessCount on mount to prevent showing overlay for existing guesses
  useEffect(() => {
    if (!hasInitialized.current) {
      // ALWAYS initialize to current count on page refresh to prevent showing overlay
      // for existing wrong guesses. Overlay should ONLY show for new user input guesses.
      previousWrongGuessCount.current = actualWrongGuessCount;
      hasInitialized.current = true;
    }
  }, [actualWrongGuessCount]);

  // Show overlay when actual wrong guess count increases (but display total count)
  useEffect(() => {
    // Never show overlay if game is over
    if (isGameOver) return;

    // Only trigger if we have a new wrong guess (actualWrongGuessCount increased)
    if (actualWrongGuessCount > previousWrongGuessCount.current && totalWrongGuessCount <= maxGuesses) {
      // Update previous count IMMEDIATELY to prevent retriggering
      previousWrongGuessCount.current = actualWrongGuessCount;

      setCurrentWrongGuessCount(totalWrongGuessCount); // Display total including skips
      setIsVisible(true);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [actualWrongGuessCount, totalWrongGuessCount, maxGuesses, isGameOver, setCurrentWrongGuessCount, setIsVisible]);

  // Trigger shake animation after modal appears
  useEffect(() => {
    if (isVisible) {
      setModalAnimation("visible");
      const timer = setTimeout(() => {
        setModalAnimation("shake");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, setModalAnimation]);

}