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

          // Check if this is a rate limit error - don't retry these!
          const isRateLimitError = error && typeof error === 'object' &&
            (('status' in error && error.status === 429) ||
             ('message' in error && typeof error.message === 'string' &&
              error.message.toLowerCase().includes('too many requests')));

          if (isRateLimitError) {
            console.warn('Rate limit hit - not retrying to avoid making it worse');
            setIsLoading(false);
            setIsSlowConnection(true); // Will show "slow connection" message to user
            return;
          }

          // Only retry on actual network/connection errors
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