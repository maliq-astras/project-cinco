import { useDropZoneIndicatorState } from './useDropZoneIndicatorState';

interface UseDropZoneIndicatorProps {
  isVisible: boolean;
}

export const useDropZoneIndicator = ({ isVisible }: UseDropZoneIndicatorProps) => {
  const state = useDropZoneIndicatorState();

  return {
    // State
    t: state.t,
    
    // Props
    isVisible
  };
};