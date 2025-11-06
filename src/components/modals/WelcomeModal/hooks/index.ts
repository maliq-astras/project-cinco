import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/responsive';

interface UseWelcomeModalProps {
  isOpen: boolean;
}

export const useWelcomeModal = ({ isOpen: _isOpen }: UseWelcomeModalProps) => {
  const { colors } = useTheme();
  const { responsiveValues, width } = useResponsive();

  // Calculate responsive dimensions
  const isVerySmallScreen = width < 480;

  const modalSize = {
    width: Math.min(isVerySmallScreen ? width * 0.9 : 480, width * 0.9),
    height: 'auto' // CSS aspect-ratio: 1 will make it a perfect square
  };

  const buttonPadding = responsiveValues.spacing * 0.75;
  const buttonFontSize = isVerySmallScreen ? 14 : 16;
  const textFontSize = isVerySmallScreen ? 14 : 16;

  return {
    colors,
    modalSize,
    buttonPadding,
    buttonFontSize,
    textFontSize,
  };
};
