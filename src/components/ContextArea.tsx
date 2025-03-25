import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();

  // Generate a game status message based on the current state
  const getGameStatusMessage = () => {
    if (!hasSeenClue) {
      return "Double click a fact bubble to start the game";
    }
    if (!canMakeGuess) {
      return "Reveal a new fact to make another guess";
    }
    if (!canRevealNewClue) {
      return "Make a guess for this fact";
    }
    return "Choose another fact or make a guess";
  };
  
  return (
    <span className={`text-${colors.primary} font-medium text-center whitespace-nowrap font-display`}>
      {getGameStatusMessage()}
    </span>
  );
};

// Legacy component for backward compatibility
const ContextArea: React.FC = () => {
  return <GameInstructionsArea />;
};

export default ContextArea; 