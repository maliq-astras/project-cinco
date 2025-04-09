import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { contextAreaStyles, getContextTextClassNames } from '../../../styles/contextAreaStyles';

/**
 * Hook to manage the bubble context area state and logic
 */
export function useBubbleContext() {
  const { t } = useTranslation('common');
  const challenge = useGameStore(state => state.gameState.challenge);
  const hoveredFact = useGameStore(state => state.hoveredFact);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const { colors } = useTheme();

  // Determine message to show when hovering over a bubble
  const getMessage = () => {
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
    textColor: colors.primary,
    textClassName: getContextTextClassNames(colors.primary, contextAreaStyles.bubble),
    styles: contextAreaStyles
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
  const { colors } = useTheme();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

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
    if (isProcessingGuess) {
      // Only show loading indicator if request takes longer than 500ms
      const timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setShowLoading(false);
    }
  }, [isProcessingGuess]);

  // Generate a game status message based on current state
  const getMessage = () => {
    if (isGameOver) {
      return ""; // Don't show instructions during game over
    }
    
    if (showLoading) {
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
    transition: { duration: contextAreaStyles.animation.duration }
  };

  // Get loading animation if processing a guess for more than the threshold
  const loadingAnimation = showLoading ? {
    animate: {
      rotate: 360
    },
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  } : {};

  return {
    message: getMessage(),
    textColor: colors.primary,
    textClassName: getContextTextClassNames(colors.primary, contextAreaStyles.instructions),
    shouldAnimate: true,
    isHidden: isGameOver,
    animationProps: animation,
    loadingAnimation,
    isProcessingGuess: showLoading, // Use the delayed state instead of immediate state
    styles: contextAreaStyles
  };
} 