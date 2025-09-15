import { useMobileGameContentState } from './useMobileGameContentState';
import { useMobileGameContentEvents } from './useMobileGameContentEvents';
import { useMobileGameContentLogic } from './useMobileGameContentLogic';
import { GameState, GameOutcome } from '@/types';
import type { GameControlsHandle } from '../../../game/GameControls';

interface UseMobileGameContentProps {
  gameState: GameState;
  gameEntranceComplete: boolean;
  showGameMessage: boolean;
  getGameMessageProps: () => {
    outcome: GameOutcome;
    correctAnswer: string;
    numberOfTries: number;
    timeSpent: number;
  };
  isFinalFiveActive: boolean;
  isAlreadyPlayedScenario: boolean;
  isVictoryAnimationActive: boolean;
  isTabletLandscape: boolean;
  gameControlsRef: React.RefObject<GameControlsHandle | null>;
}

export const useMobileGameContent = (props: UseMobileGameContentProps) => {
  const state = useMobileGameContentState();
  
  const logic = useMobileGameContentLogic({
    colors: state.colors
  });

  // Events hook for side effects
  useMobileGameContentEvents({
    isDragging: state.isDragging,
    dropZoneRef: state.dropZoneRef,
    registerElement: state.registerElement,
    unregisterElement: state.unregisterElement
  });

  return {
    // Props pass-through
    ...props,
    
    // State
    colors: state.colors,
    isDragging: state.isDragging,
    dropZoneRef: state.dropZoneRef,
    
    // Logic
    animations: logic.animations,
    contextLineBackgroundStyle: logic.contextLineBackgroundStyle,
    dropZoneOverlayStyles: logic.dropZoneOverlayStyles
  };
};