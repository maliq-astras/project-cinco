import { useGameButtonsState } from './useGameButtonsState';
import { useGameButtonsEvents } from './useGameButtonsEvents';

export const useGameButtons = () => {
  const state = useGameButtonsState();
  
  useGameButtonsEvents({
    controlsRef: state.controlsRef
  });

  return {
    controlsRef: state.controlsRef
  };
};