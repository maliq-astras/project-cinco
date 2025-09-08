import { ANIMATIONS } from '@/constants/animations';
import { getContextLineBackground, getDropZoneOverlayStyles } from '../helpers';

interface UseMobileGameContentLogicProps {
  colors: {
    primary: string;
  };
}

export const useMobileGameContentLogic = ({
  colors
}: UseMobileGameContentLogicProps) => {
  // Animation configurations using constants
  const animations = {
    cardStack: ANIMATIONS.MOBILE_CARD_STACK,
    topSection: ANIMATIONS.MOBILE_TOP_SECTION,
    middleSection: ANIMATIONS.MOBILE_MIDDLE_SECTION,
    bottomSection: ANIMATIONS.MOBILE_BOTTOM_SECTION
  };

  // Style calculations
  const contextLineBackgroundStyle = getContextLineBackground(colors.primary);
  const dropZoneOverlayStyles = getDropZoneOverlayStyles();

  return {
    animations,
    contextLineBackgroundStyle,
    dropZoneOverlayStyles
  };
};