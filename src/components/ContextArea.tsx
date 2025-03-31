import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

// Component for showing bubble categories when hovering
export const BubbleContextArea: React.FC = () => {
  const challenge = useGameStore(state => state.gameState.challenge);
  const hoveredFact = useGameStore(state => state.hoveredFact);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const { colors } = useTheme();

  // Determine what message to show: hover context
  const shouldShowHoverContext = hoveredFact !== null && (!revealedFacts.includes(hoveredFact) || revealedFacts.length === 0);
  
  // Show fact type when hovering over a bubble
  const messageToShow = shouldShowHoverContext && hoveredFact !== null && challenge && !revealedFacts.includes(hoveredFact)
    ? `${challenge.facts[hoveredFact].factType}`
    : "";
  
  return (
    <span className={`text-${colors.primary} font-medium text-center whitespace-nowrap font-display`}>
      {messageToShow}
    </span>
  );
};

// Component for showing game instructions
export const GameInstructionsArea: React.FC = () => {
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const guesses = useGameStore(state => state.gameState.guesses);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const { colors } = useTheme();

  // Generate a game status message based on the current state
  const getGameStatusMessage = () => {
    if (isGameOver) {
      // Don't show any instruction message during or after game over
      return "";
    }
    
    if (!hasSeenClue) {
      return "Reveal a fact to start guessing...";
    }
    
    if (!canMakeGuess) {
      return "Reveal a new fact to make another guess...";
    }
    
    return "Enter your guess...";
  };
  
  return (
    <motion.span 
      className={`text-${colors.primary} font-medium text-center whitespace-normal max-w-lg font-display`}
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isGameOver ? 0 : 1
      }}
      transition={{ duration: 0.8 }}
    >
      {getGameStatusMessage()}
    </motion.span>
  );
};

// Legacy component for backward compatibility
const ContextArea: React.FC = () => {
  return <GameInstructionsArea />;
};

export default ContextArea; 