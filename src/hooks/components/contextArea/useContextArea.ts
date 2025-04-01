import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { contextAreaStyles, getContextTextClassNames } from '../../../styles/contextAreaStyles';

/**
 * Hook to manage the bubble context area state and logic
 */
export function useBubbleContext() {
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
      return challenge?.facts[hoveredFact].factType;
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
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const { colors } = useTheme();

  // Generate a game status message based on current state
  const getMessage = () => {
    if (isGameOver) {
      return ""; // Don't show instructions during game over
    }
    
    if (!hasSeenClue) {
      return "Reveal a fact to start guessing...";
    }
    
    if (!canMakeGuess) {
      return "Reveal a new fact to make another guess...";
    }
    
    return "Enter your guess...";
  };

  // Animation properties
  const animation = {
    initial: { opacity: 1 },
    animate: { opacity: isGameOver ? 0 : 1 },
    transition: { duration: contextAreaStyles.animation.duration }
  };

  return {
    message: getMessage(),
    textColor: colors.primary,
    textClassName: getContextTextClassNames(colors.primary, contextAreaStyles.instructions),
    shouldAnimate: true,
    isHidden: isGameOver,
    animationProps: animation,
    styles: contextAreaStyles
  };
} 