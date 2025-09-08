import { GameState, GameOutcome } from '@/types';
import { shouldRenderGameContent } from '../helpers';
import type { GameControlsHandle } from '../../../game/GameControls';

interface UseGameContentRendererLogicProps {
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

export const useGameContentRendererLogic = ({
  gameState,
  ...restProps
}: UseGameContentRendererLogicProps) => {
  const shouldRender = shouldRenderGameContent(gameState);

  return {
    shouldRender,
    ...restProps
  };
};