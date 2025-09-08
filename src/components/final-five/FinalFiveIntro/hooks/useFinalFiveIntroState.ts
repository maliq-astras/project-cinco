import { useState } from 'react';

/**
 * Hook for managing FinalFiveIntro component state
 * @returns State values and setters
 */
export function useFinalFiveIntroState() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  return {
    isTransitioning,
    setIsTransitioning,
    isLoading,
    setIsLoading,
    isSlowConnection,
    setIsSlowConnection,
    showStartButton,
    setShowStartButton,
    retryCount,
    setRetryCount
  };
}