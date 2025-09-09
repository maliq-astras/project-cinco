import { useEndGameMessageState } from './useEndGameMessageState';
import { useEndGameMessageEvents } from './useEndGameMessageEvents';
import { useEndGameMessageLogic } from './useEndGameMessageLogic';
import { GameOutcome } from '@/types/index';

interface UseEndGameMessageProps {
  outcome: GameOutcome;
  correctAnswer: string;
  numberOfTries?: number;
  timeSpent: number;
}

export const useEndGameMessage = ({
  outcome,
  correctAnswer,
  numberOfTries = 0,
  timeSpent
}: UseEndGameMessageProps) => {
  const state = useEndGameMessageState({ outcome, correctAnswer });
  const events = useEndGameMessageEvents({
    setIsAnswerModalOpen: state.setIsAnswerModalOpen,
    correctAnswer
  });
  const logic = useEndGameMessageLogic({
    outcome,
    correctAnswer,
    numberOfTries,
    timeSpent,
    ...state
  });

  return {
    ...state,
    ...events,
    ...logic
  };
};

