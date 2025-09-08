import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/responsive';

export const useFactCardBackState = () => {
  const { colors } = useTheme();
  const { breakpoint, getResponsiveValue } = useResponsive();

  return {
    colors,
    breakpoint,
    getResponsiveValue
  };
};