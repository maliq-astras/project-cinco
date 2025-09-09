import { useLoadingAnimationState } from './useLoadingAnimationState';
import { useLoadingAnimationEvents } from './useLoadingAnimationEvents';
import { useLoadingAnimationLogic } from './useLoadingAnimationLogic';

interface UseLoadingAnimationProps {
  finalCategory: string;
  onComplete: () => void;
  isChallengeFetched: boolean;
}

export const useLoadingAnimation = ({ 
  finalCategory, 
  onComplete, 
  isChallengeFetched 
}: UseLoadingAnimationProps) => {
  const state = useLoadingAnimationState({ finalCategory });
  const events = useLoadingAnimationEvents({ onComplete });
  const logic = useLoadingAnimationLogic({
    finalCategory,
    isChallengeFetched,
    onComplete,
    ...state
  });

  return {
    mounted: state.mounted,
    isAnimationComplete: state.isAnimationComplete,
    onComplete: events.handleComplete,
    ...logic
  };
};