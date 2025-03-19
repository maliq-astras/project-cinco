import React from 'react';
import { Challenge } from '../types';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

const ContextArea: React.FC = () => {
  const challenge = useGameStore(state => state.gameState.challenge);
  const hoveredFact = useGameStore(state => state.hoveredFact);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const { colors } = useTheme();

  // Generate a game status message based on the current state
  const getGameStatusMessage = () => {
    if (!hasSeenClue) {
      return "Click a fact bubble to start the game";
    }
    if (!canMakeGuess) {
      return "Reveal a new fact to make another guess";
    }
    if (!canRevealNewClue) {
      return "Make a guess for this fact";
    }
    return "Choose another fact or make a guess";
  };

  // Determine what message to show: hover context or game status
  const shouldShowHoverContext = hoveredFact !== null && (!revealedFacts.includes(hoveredFact) || revealedFacts.length === 0);
  
  // Determine what text to display
  const messageToShow = shouldShowHoverContext && hoveredFact !== null && challenge && !revealedFacts.includes(hoveredFact)
    ? `${challenge.facts[hoveredFact].factType} Fact`
    : getGameStatusMessage();
  
  return (
    <span className={`text-${colors.primary} font-medium text-center whitespace-nowrap ${shouldShowHoverContext ? 'font-display' : ''}`}>
      {messageToShow}
    </span>
  );
};

export default ContextArea; 