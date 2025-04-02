import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';

export const useHeader = () => {
  const { colors } = useTheme();
  const challenge = useGameStore(state => state.gameState.challenge);

  return {
    colors,
    challenge
  };
}; 