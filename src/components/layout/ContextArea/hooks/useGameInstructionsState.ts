import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';

export const useGameInstructionsState = () => {
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isProcessingGuess = useGameStore(state => state.isProcessingGuess);
  const hasUserInput = useGameStore(state => state.hasUserInput);
  const { colors, darkMode } = useTheme();
  
  const [showLoading, setShowLoading] = useState(false);
  const [isLongRequest, setIsLongRequest] = useState(false);

  return {
    hasSeenClue,
    canMakeGuess,
    isGameOver,
    isProcessingGuess,
    hasUserInput,
    colors,
    darkMode,
    showLoading,
    setShowLoading,
    isLongRequest,
    setIsLongRequest
  };
};