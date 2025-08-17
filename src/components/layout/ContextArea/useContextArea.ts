import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ContextArea.module.css';

/**
 * Hook to manage the bubble context area state and logic
 */
export function useBubbleContext() {
  const { t } = useTranslation('common');
  const challenge = useGameStore(state => state.gameState.challenge);
  const hoveredFact = useGameStore(state => state.hoveredFact);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const windowWidth = useGameStore(state => state.windowWidth);
  const { colors, darkMode } = useTheme();
  const hasUserInput = useGameStore(state => state.hasUserInput);

  // Determine message to show when hovering over a bubbleZ
  const getMessage = () => {
    // Don't show bubble context if the game is over, Final Five is active, or transitioning to Final Five
    if (isGameOver || isFinalFiveActive || showFinalFiveTransition) {
      return "";
    }
    
    const shouldShowHoverContext = hoveredFact !== null && 
      challenge?.facts && 
      !revealedFacts.includes(hoveredFact);
      
    if (shouldShowHoverContext) {
      return t(`factTypes.${challenge?.facts[hoveredFact].factType.toLowerCase()}`, challenge?.facts[hoveredFact].factType);
    }
    
    return "";
  };

  return {
    message: getMessage(),
    textColor: darkMode ? 'white' : colors.primary,
    textClassName: `${styles.bubblePrimary} ${darkMode ? 'text-white' : `text-${colors.primary}`}`
  };
}

/**
 * Hook to manage the game instructions area state and logic
 */
export function useGameInstructions() {
  const { t } = useTranslation('common');
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isProcessingGuess = useGameStore(state => state.isProcessingGuess);
  const windowWidth = useGameStore(state => state.windowWidth);
  const { colors, darkMode } = useTheme();
  const hasUserInput = useGameStore(state => state.hasUserInput);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isLongRequest, setIsLongRequest] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    detectTouch();
    window.addEventListener('touchstart', () => setIsTouchDevice(true), { once: true });
    
    return () => window.removeEventListener('touchstart', () => setIsTouchDevice(true));
  }, []);

  // Delayed loading indicator for better user experience
  useEffect(() => {
    let longRequestTimeoutId: NodeJS.Timeout;
    
    if (isProcessingGuess) {
      // Show loading state immediately
      setShowLoading(true);
      
      // Show long request message if it takes longer than 5 seconds
      longRequestTimeoutId = setTimeout(() => {
        setIsLongRequest(true);
      }, 5000);
      
      return () => {
        clearTimeout(longRequestTimeoutId);
      };
    } else {
      setShowLoading(false);
      setIsLongRequest(false);
    }
  }, [isProcessingGuess]);

  // Generate a game status message based on current state
  const getMessage = () => {
    if (isGameOver) {
      return ""; // Don't show instructions during game over
    }
    
    if (showLoading) {
      if (isLongRequest) {
        return t('game.status.longRequest', 'Still working on it... This is taking longer than expected');
      }
      return t('game.status.guessing', 'Guessing...');
    }
    
    if (!hasSeenClue) {
      return t('game.instructions.dragToBegin', 'Drag a bubble to reveal a fact and begin...');
    }
    
    if (!canMakeGuess) {
      return t('game.instructions.revealNew', 'Reveal a new fact to make another guess...');
    }
    
    return t('game.instructions.enterGuess', 'Enter your guess...');
  };

  // Animation properties
  const animation = {
    initial: { opacity: 1 },
    animate: { opacity: isGameOver ? 0 : 1 },
    transition: { duration: 0.8 }
  };

  // Get loading animation if processing a guess for more than the threshold
  const loadingAnimation = showLoading ? {
    animate: {
      rotate: 360
    },
    transition: {
      repeat: Infinity,
      duration: isLongRequest ? 1.5 : 1, // Slow down animation slightly for long requests
      ease: "linear"
    }
  } : {};

  return {
    message: getMessage(),
    textColor: darkMode ? 'white' : colors.primary,
    textClassName: `${styles.instructionsPrimary} ${darkMode ? 'text-white' : `text-${colors.primary}`} ${hasUserInput ? styles.visuallyHidden : ''}`,
    shouldAnimate: true,
    isHidden: isGameOver,
    animationProps: animation,
    loadingAnimation,
    isProcessingGuess: showLoading, // Use the delayed state instead of immediate state
    isLongRequest // Make this available in case we want different styling
  };
} 