import { useEffect } from 'react';

interface UseFinalFiveIntroEffectsProps {
  isLoading: boolean;
  finalFiveOptions: string[] | null;
  setIsLoading: (loading: boolean) => void;
  setIsSlowConnection: (slow: boolean) => void;
  setShowStartButton: (show: boolean) => void;
}

/**
 * Hook for managing FinalFiveIntro side effects and timers
 * @param props Dependencies and state setters
 */
export function useFinalFiveIntroEffects({
  isLoading,
  finalFiveOptions,
  setIsLoading,
  setIsSlowConnection,
  setShowStartButton
}: UseFinalFiveIntroEffectsProps) {
  
  // Show start button after delay
  useEffect(() => {
    const buttonDelay = setTimeout(() => {
      setShowStartButton(true);
    }, 6000); 
    
    return () => clearTimeout(buttonDelay);
  }, [setShowStartButton]);
  
  // Monitor final five options loading
  useEffect(() => {
    if (finalFiveOptions && finalFiveOptions.length > 0) {
      setIsLoading(false);
      setIsSlowConnection(false);
    }
  }, [finalFiveOptions, setIsLoading, setIsSlowConnection]);
  
  // Handle slow connection detection
  useEffect(() => {
    let slowConnectionTimer: NodeJS.Timeout;
    
    if (isLoading) {
      slowConnectionTimer = setTimeout(() => {
        setIsSlowConnection(true);
      }, 3000);
    } else {
      setIsSlowConnection(false);
    }
    
    return () => {
      if (slowConnectionTimer) clearTimeout(slowConnectionTimer);
    };
  }, [isLoading, setIsSlowConnection]);
}