import { useEffect } from 'react';

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
  }, [actualWrongGuessCount, totalWrongGuessCount, maxGuesses, guesses, previousWrongGuessCount, setCurrentWrongGuessCount, setIsVisible]);

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