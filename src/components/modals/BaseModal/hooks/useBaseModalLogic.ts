import { useResponsive } from '@/hooks/responsive';

export const useBaseModalLogic = () => {
  const { isMobileMenu } = useResponsive();
  
  // Only use slide-up modals for actual mobile phones (not tablets)
  // Tablets in landscape should use regular modals like desktop
  const isMobile = isMobileMenu;

  const shouldRenderAsPortal = typeof window !== 'undefined';

  return {
    isMobile,
    shouldRenderAsPortal,
  };
};