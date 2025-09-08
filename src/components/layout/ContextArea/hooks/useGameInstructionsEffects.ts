import { useEffect } from 'react';

interface UseGameInstructionsEffectsParams {
  isProcessingGuess: boolean;
  setShowLoading: (loading: boolean) => void;
  setIsLongRequest: (longRequest: boolean) => void;
}

export const useGameInstructionsEffects = ({
  isProcessingGuess,
  setShowLoading,
  setIsLongRequest
}: UseGameInstructionsEffectsParams) => {
  useEffect(() => {
    let longRequestTimeoutId: NodeJS.Timeout;
    
    if (isProcessingGuess) {
      setShowLoading(true);
      
      longRequestTimeoutId = setTimeout(() => {
        setIsLongRequest(true);
      }, 5000);
      
      return () => {
        clearTimeout(longRequestTimeoutId);
      };
    } else {
      setShowLoading(false);
      setIsLongRequest(false);
    }
  }, [isProcessingGuess, setShowLoading, setIsLongRequest]);
};