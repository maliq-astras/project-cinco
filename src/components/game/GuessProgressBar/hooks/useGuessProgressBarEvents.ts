import { useEffect } from 'react';

interface UseGuessProgressBarEventsProps {
  wrongGuessCount: number;
  prevWrongGuessCount: React.MutableRefObject<number>;
  setIsShaking: (shaking: boolean) => void;
  onShakeComplete?: () => void;
}

export function useGuessProgressBarEvents({
  wrongGuessCount,
  prevWrongGuessCount,
  setIsShaking,
  onShakeComplete
}: UseGuessProgressBarEventsProps) {
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
  }, [wrongGuessCount, onShakeComplete, setIsShaking, prevWrongGuessCount]);
}