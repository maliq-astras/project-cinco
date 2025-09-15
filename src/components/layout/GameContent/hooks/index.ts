import { useGameContentState } from './useGameContentState';
import { useGameContentLogic } from './useGameContentLogic';
import { GameState, GameOutcome } from '@/types';
import type { GameControlsHandle } from '../../../game/GameControls';

interface UseGameContentProps {
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
  gameControlsRef: React.RefObject<GameControlsHandle | null>;
}

export const useGameContent = (props: UseGameContentProps) => {
  const state = useGameContentState();
  
  const logic = useGameContentLogic({
    isDragging: state.isDragging,
    isTutorialOpen: state.isTutorialOpen,
    dropZoneRef: state.dropZoneRef,
    registerElement: state.registerElement,
    unregisterElement: state.unregisterElement,
    responsiveValues: state.responsiveValues
  });

  return {
    // Props pass-through
    ...props,
    
    // State
    colors: state.colors,
    isDragging: state.isDragging,
    isTutorialOpen: state.isTutorialOpen,
    dropZoneRef: state.dropZoneRef,
    
    // Logic
    bubbleContextSpacing: logic.bubbleContextSpacing,
    animations: logic.animations
  };
};