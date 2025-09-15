import { useEffect } from 'react';
import { useResponsive } from '@/hooks/responsive';

interface UseWrongAnswerOverlayEventsProps {
  isVisible: boolean;
  actualWrongGuessCount: number;
  totalWrongGuessCount: number;
  maxGuesses: number;
  guesses: any[];
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
  guesses,
  previousWrongGuessCount,
  setCurrentWrongGuessCount,
  setIsVisible,
  setModalAnimation
}: UseWrongAnswerOverlayEventsProps) {
  // Show overlay when actual wrong guess count increases (but display total count)
  useEffect(() => {
    // Only trigger if we have a new wrong guess (actualWrongGuessCount increased)
    if (actualWrongGuessCount > previousWrongGuessCount.current && totalWrongGuessCount <= maxGuesses) {
      // Check if the most recent guess was actually wrong (not a skip)
      const lastGuess = guesses[guesses.length - 1];
      const wasLastGuessActuallyWrong = lastGuess && !lastGuess.isCorrect && !lastGuess.isFinalFiveGuess && lastGuess.guess !== "___SKIPPED___";
      
      if (wasLastGuessActuallyWrong) {
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
    }
  }, [actualWrongGuessCount, totalWrongGuessCount, maxGuesses, guesses, setCurrentWrongGuessCount, setIsVisible]);

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