import { useState, useEffect } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
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
}

export const useFinalFiveIntro = ({ reason, onStart }: UseFinalFiveIntroProps): UseFinalFiveIntroReturn => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  const hardMode = useGameStore(state => state.hardMode);
  const finalFiveOptions = useGameStore(state => state.gameState.finalFiveOptions);
  const [autoStartTimer, setAutoStartTimer] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if options are already loaded
  useEffect(() => {
    // Options are already loaded (prefetched)
    if (finalFiveOptions && finalFiveOptions.length > 0) {
      setIsLoading(false);
    }
  }, [finalFiveOptions]);
  
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
      
      // Then fetch options in the background
      triggerFinalFive().catch(error => {
        console.error("Error fetching Final Five options:", error);
      }).finally(() => {
        // Hide loading spinner when done, regardless of success/failure
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error transitioning to Final Five:", error);
      setIsTransitioning(false);
      setIsLoading(false);
    }
  };
  
  // Start auto-start timer after 15 seconds of inactivity
  useEffect(() => {
    const INACTIVITY_DELAY = 15000; // 15 seconds before showing countdown
    
    const timer = setTimeout(() => {
      // Don't show countdown if already transitioning
      if (!isTransitioning) {
        setShowCountdown(true);
        setAutoStartTimer(5);
      }
    }, INACTIVITY_DELAY);
    
    return () => clearTimeout(timer);
  }, [isTransitioning]);
  
  // Handle the 5-second countdown
  useEffect(() => {
    if (showCountdown && autoStartTimer !== null) {
      if (autoStartTimer <= 0) {
        // Hide countdown immediately to avoid animation conflicts
        setShowCountdown(false);
        
        // Brief delay before starting Final Five
        setTimeout(() => {
          // Start transition immediately instead of with a delay
          handleStart();
        }, 500);
        return;
      }
      
      const countdownTimer = setTimeout(() => {
        setAutoStartTimer(prevTime => prevTime !== null ? prevTime - 1 : null);
      }, 1000);
      
      return () => clearTimeout(countdownTimer);
    }
  }, [showCountdown, autoStartTimer]);
  
  // When user manually clicks button, hide the countdown if showing
  useEffect(() => {
    if (isTransitioning && showCountdown) {
      setShowCountdown(false);
    }
  }, [isTransitioning, showCountdown]);
  
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
    isLoading
  };
}; 