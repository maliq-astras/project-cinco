import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/hooks/responsive';

interface UseFinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
}

interface UseFinalFiveIntroReturn {
  handleStart: () => Promise<void>;
  isTransitioning: boolean;
  message: string;
  colors: { primary: string };
  hardMode: boolean;
  isLoading: boolean;
  isSlowConnection: boolean;
  showStartButton: boolean;
  retryCount: number;
  breakpoint: string;
  heightBreakpoint: string;
  isLandscape: boolean;
  isPortrait: boolean;
  responsiveValues: any;
}

export const useFinalFiveIntro = ({ reason, onStart }: UseFinalFiveIntroProps): UseFinalFiveIntroReturn => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  const hardMode = useGameStore(state => state.hardMode);
  const finalFiveOptions = useGameStore(state => state.gameState.finalFiveOptions);
  
  const { 
    breakpoint, 
    heightBreakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues 
  } = useResponsive();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  useEffect(() => {
    const buttonDelay = setTimeout(() => {
      setShowStartButton(true);
    }, 6000); 
    
    return () => clearTimeout(buttonDelay);
  }, []);
  
  useEffect(() => {
    if (finalFiveOptions && finalFiveOptions.length > 0) {
      setIsLoading(false);
      setIsSlowConnection(false);
    }
  }, [finalFiveOptions]);
  
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
  
  const handleStart = async () => {
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
  
  const timeLimit = hardMode ? "5" : "55";
  const message = reason === 'time'
    ? t('game.finalFive.timeUp', { timeLimit })
    : t('game.finalFive.guessesUp', { timeLimit });

  return {
    handleStart,
    isTransitioning,
    message,
    colors,
    hardMode,
    isLoading,
    isSlowConnection,
    showStartButton,
    retryCount,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    responsiveValues
  };
}; 