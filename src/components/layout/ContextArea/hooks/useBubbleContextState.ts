import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';

export const useBubbleContextState = () => {
  const challenge = useGameStore(state => state.gameState.challenge);
  const hoveredFact = useGameStore(state => state.hoveredFact);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const { colors, darkMode } = useTheme();

  return {
    challenge,
    hoveredFact,
    revealedFacts,
    isGameOver,
    isFinalFiveActive,
    showFinalFiveTransition,
    colors,
    darkMode
  };
};