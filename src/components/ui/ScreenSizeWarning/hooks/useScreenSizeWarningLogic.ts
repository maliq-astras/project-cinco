import { Monitor, Smartphone } from 'lucide-react';
import { getScreenSizeMessage, getMinimumRequirements } from '../helpers';

interface UseScreenSizeWarningLogicProps {
  isMobile: boolean;
  mounted: boolean;
}

export const useScreenSizeWarningLogic = ({ isMobile, mounted }: UseScreenSizeWarningLogicProps) => {
  const getIcon = () => {
    if (!mounted) {
      // Use Monitor icon during SSR to prevent hydration mismatch
      return Monitor;
    }
    return isMobile ? Smartphone : Monitor;
  };

  const message = getScreenSizeMessage(isMobile);
  const requirements = getMinimumRequirements(isMobile);

  return {
    Icon: getIcon(),
    message,
    requirements
  };
};