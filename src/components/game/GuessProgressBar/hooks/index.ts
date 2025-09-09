import { useGameStore } from '@/store/gameStore';
import { useGuessProgressBarState } from './useGuessProgressBarState';
import { useGuessProgressBarEvents } from './useGuessProgressBarEvents';
import { useGuessProgressBarLogic } from './useGuessProgressBarLogic';

interface UseGuessProgressBarProps {
  maxGuesses?: number;
  onShakeComplete?: () => void;
}

export function useGuessProgressBar({
  maxGuesses = 5,
  onShakeComplete
}: UseGuessProgressBarProps = {}) {
  const guesses = useGameStore(state => state.gameState.guesses);
  
  const {
    wrongGuessCount,
    animatedCount,
    isShaking,
    setIsShaking,
    prevWrongGuessCount
  } = useGuessProgressBarState({
    guesses,
    maxGuesses
  });

  useGuessProgressBarEvents({
    wrongGuessCount,
    prevWrongGuessCount,
    setIsShaking,
    onShakeComplete
  });

  const {
    pulseAnimation,
    gradientStyle,
    shadowStyle,
    barClassName,
    segments
  } = useGuessProgressBarLogic({
    maxGuesses,
    animatedCount,
    isShaking
  });
  
  return {
    // State
    wrongGuessCount,
    animatedCount,
    isShaking,
    maxGuesses,
    
    // Animation properties
    pulseAnimation,
    
    // Styles
    gradientStyle,
    shadowStyle,
    barClassName,
    
    // Data
    segments
  };
} 