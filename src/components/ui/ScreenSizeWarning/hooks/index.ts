import { useScreenSizeWarningState } from './useScreenSizeWarningState';
import { useScreenSizeWarningLogic } from './useScreenSizeWarningLogic';

interface UseScreenSizeWarningProps {
  isMobile: boolean;
}

export const useScreenSizeWarning = ({ isMobile }: UseScreenSizeWarningProps) => {
  const { mounted } = useScreenSizeWarningState();
  
  const { Icon, message, requirements } = useScreenSizeWarningLogic({
    isMobile,
    mounted
  });

  return {
    mounted,
    Icon,
    message,
    requirements
  };
};