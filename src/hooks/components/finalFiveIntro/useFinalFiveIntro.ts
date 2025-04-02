import { useState, useEffect } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
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
}

export const useFinalFiveIntro = ({ reason, onStart }: UseFinalFiveIntroProps): UseFinalFiveIntroReturn => {
  const { colors } = useTheme();
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  const hardMode = useGameStore(state => state.hardMode);
  const [autoStartTimer, setAutoStartTimer] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handles fetching options and transitioning to Final Five
  const handleStart = async () => {
    // Don't allow multiple transitions
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    try {
      // Get options first (can take some time)
      await triggerFinalFive();
      // Then transition to Final Five with no delay
      onStart();
    } catch (error) {
      console.error("Error transitioning to Final Five:", error);
      setIsTransitioning(false);
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
    ? `Time's up! But here's your chance at glory in the FINAL 5! Choose the correct answer from 5 options in an intense ${timeLimit}-second showdown${hardMode ? " (Hard Mode)" : ""}. Ready to become a champion?`
    : `5 guesses down, but victory awaits in the FINAL 5! You'll have ${timeLimit} seconds to pick the right answer from 5 carefully selected options${hardMode ? " (Hard Mode)" : ""}. This is your moment to shine!`;

  return {
    handleStart,
    isTransitioning,
    showCountdown,
    autoStartTimer,
    message,
    colors,
    hardMode
  };
}; 