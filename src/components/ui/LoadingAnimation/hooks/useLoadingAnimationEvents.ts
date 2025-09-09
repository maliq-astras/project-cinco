interface UseLoadingAnimationEventsProps {
  onComplete: () => void;
}

export const useLoadingAnimationEvents = ({ onComplete }: UseLoadingAnimationEventsProps) => {
  const handleComplete = () => {
    onComplete();
  };

  return {
    handleComplete
  };
};