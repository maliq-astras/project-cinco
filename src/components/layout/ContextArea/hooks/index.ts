import { useBubbleContextState } from './useBubbleContextState';
import { useBubbleContextLogic } from './useBubbleContextLogic';
import { useGameInstructionsState } from './useGameInstructionsState';
import { useGameInstructionsEffects } from './useGameInstructionsEffects';
import { useGameInstructionsLogic } from './useGameInstructionsLogic';

export const useBubbleContext = () => {
  const state = useBubbleContextState();
  const logic = useBubbleContextLogic(state);
  
  return {
    ...logic
  };
};

export const useGameInstructions = () => {
  const state = useGameInstructionsState();
  useGameInstructionsEffects(state);
  const logic = useGameInstructionsLogic(state);
  
  return {
    ...logic
  };
};