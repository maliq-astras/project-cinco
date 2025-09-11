import { useResponsive } from '@/hooks/responsive';
import { useBodyScrollLock } from '@/hooks/ui/useBodyScrollLock';

interface UseSettingsPanelLogicProps {
  isOpen: boolean;
}

export const useSettingsPanelLogic = ({ isOpen }: UseSettingsPanelLogicProps) => {
  const { isMobileMenu } = useResponsive();
  
  useBodyScrollLock(isOpen);
  
  return {
    isMobile: isMobileMenu
  };
};