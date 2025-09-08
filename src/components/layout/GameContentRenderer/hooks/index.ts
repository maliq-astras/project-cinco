import { useGameContentRendererLogic } from './useGameContentRendererLogic';
import { GameState, GameOutcome } from '@/types';
import type { GameControlsHandle } from '../../../game/GameControls';

interface UseGameContentRendererProps {
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
  showFinalFiveTransition: boolean;
  finalFiveTransitionReason: 'time' | 'guesses' | null;
  startFinalFive: () => void;
  needsMobileLayout: boolean;
  isTabletLandscape: boolean;
  fadeInAnimation: {
    initial: { opacity: number };
    animate: { opacity: number };
    transition: { duration: number; delay: number };
  };
}

export const useGameContentRenderer = (props: UseGameContentRendererProps) => {
  const logic = useGameContentRendererLogic(props);

  return {
    // Props pass-through
    ...props,
    
    // Logic
    shouldRender: logic.shouldRender
  };
};