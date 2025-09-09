import { useStreakDisplayState } from './useStreakDisplayState';
import { useStreakDisplayLogic } from './useStreakDisplayLogic';

interface UseStreakDisplayProps {
  shouldAnimate?: boolean;
}

export const useStreakDisplay = ({ shouldAnimate = false }: UseStreakDisplayProps = {}) => {
  const state = useStreakDisplayState();
  const logic = useStreakDisplayLogic({
    shouldAnimate,
    ...state
  });

  return {
    animatedDays: state.animatedDays,
    showCurrentDaySymbol: state.showCurrentDaySymbol,
    ...logic
  };
};