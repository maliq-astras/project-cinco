import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface UseFinalFiveIntroActionsProps {
  onStart: () => void;
  isTransitioning: boolean;
  finalFiveOptions: string[] | null;
  setIsTransitioning: (transitioning: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSlowConnection: (slow: boolean) => void;
  setRetryCount: (count: number) => void;
}

/**
 * Hook for handling FinalFiveIntro actions and business logic
 * @param props Dependencies and state setters
 * @returns Action handlers
 */
export function useFinalFiveIntroActions({
  onStart,
  isTransitioning,
  finalFiveOptions,
  setIsTransitioning,
  setIsLoading,
  setIsSlowConnection,
  setRetryCount
}: UseFinalFiveIntroActionsProps) {
  
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  const maxRetries = 3;

  const handleStart = useCallback(async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (!finalFiveOptions || finalFiveOptions.length === 0) {
      setIsLoading(true);
    }
    
    try {
      onStart();
      
      const attemptFetch = async (currentRetry = 0): Promise<void> => {
        try {
          await triggerFinalFive();
          setIsLoading(false);
          setIsSlowConnection(false);
          setRetryCount(0); 
        } catch (error) {
          console.error(`Error fetching Final Five options (attempt ${currentRetry + 1}):`, error);
          
          if (currentRetry < maxRetries) {
            setRetryCount(currentRetry + 1);
            const backoffDelay = Math.min(1000 * Math.pow(2, currentRetry), 5000);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return attemptFetch(currentRetry + 1);
          } else {
            setIsLoading(false);
            setIsSlowConnection(true);
          }
        }
      };
      
      attemptFetch().finally(() => {
        if (setIsLoading) {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error transitioning to Final Five:", error);
      setIsTransitioning(false);
      setIsLoading(false);
    }
  }, [
    isTransitioning,
    onStart,
    finalFiveOptions,
    setIsTransitioning,
    setIsLoading,
    setIsSlowConnection,
    setRetryCount,
    triggerFinalFive
  ]);

  return {
    handleStart
  };
}