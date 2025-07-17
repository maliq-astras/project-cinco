import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Righteous } from 'next/font/google';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface UseFinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
}

interface UseFinalFiveIntroReturn {
  handleStart: () => Promise<void>;
  isTransitioning: boolean;
  showCountdown: boolean;
  autoStartTimer: number | null;
  message: string;
  colors: { primary: string };
  hardMode: boolean;
  isLoading: boolean;
  isSlowConnection: boolean;
  showStartButton: boolean;
  retryCount: number;
}

export const useFinalFiveIntro = ({ reason, onStart }: UseFinalFiveIntroProps): UseFinalFiveIntroReturn => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  const hardMode = useGameStore(state => state.hardMode);
  const finalFiveOptions = useGameStore(state => state.gameState.finalFiveOptions);
  const autoStartTimer = null;
  const showCountdown = false;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  // Delay showing the button to give prefetch time to complete
  useEffect(() => {
    const buttonDelay = setTimeout(() => {
      setShowStartButton(true);
    }, 6000); // 6 second delay
    
    return () => clearTimeout(buttonDelay);
  }, []);
  
  // Check if options are already loaded
  useEffect(() => {
    // Options are already loaded (prefetched)
    if (finalFiveOptions && finalFiveOptions.length > 0) {
      setIsLoading(false);
      setIsSlowConnection(false);
    }
  }, [finalFiveOptions]);
  
  // Show slow connection message after 3 seconds of loading
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
  }, [isLoading]);
  
  // Handles fetching options and transitioning to Final Five
  const handleStart = async () => {
    // Don't allow multiple transitions
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // If options aren't loaded yet, show loading state
    if (!finalFiveOptions || finalFiveOptions.length === 0) {
      setIsLoading(true);
    }
    
    try {
      // Start the transition first (immediately)
      onStart();
      
      // Attempt to fetch with retries
      const attemptFetch = async (currentRetry = 0): Promise<void> => {
        try {
          await triggerFinalFive();
          setIsLoading(false);
          setIsSlowConnection(false);
          setRetryCount(0); // Reset retry count on success
        } catch (error) {
          console.error(`Error fetching Final Five options (attempt ${currentRetry + 1}):`, error);
          
          // If we haven't reached max retries, try again
          if (currentRetry < maxRetries) {
            setRetryCount(currentRetry + 1);
            // Exponential backoff: wait longer between each retry
            const backoffDelay = Math.min(1000 * Math.pow(2, currentRetry), 5000);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return attemptFetch(currentRetry + 1);
          } else {
            // Max retries reached, show error state
            setIsLoading(false);
            // Error will be shown by the FinalFiveModal component
          }
        }
      };
      
      // Start the fetch process with retry logic
      attemptFetch().finally(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error transitioning to Final Five:", error);
      setIsTransitioning(false);
      setIsLoading(false);
    }
  };
  
  // We've removed the auto-start timer functionality
  // The Final Five will now only start when the user clicks the button
  
  const timeLimit = hardMode ? "5" : "55";
  const message = reason === 'time'
    ? t('game.finalFive.timeUp', { timeLimit })
    : t('game.finalFive.guessesUp', { timeLimit });

  return {
    handleStart,
    isTransitioning,
    showCountdown,
    autoStartTimer,
    message,
    colors,
    hardMode,
    isLoading,
    isSlowConnection,
    showStartButton,
    retryCount
  };
}; 