import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  calculateRemainingGuesses,
  generateXMarkSlots,
  getModalStyle,
  getXMarkCircleStyle,
  getGlowingRingStyle,
  getTitleStyle,
  getProgressDotStyle
} from '../helpers';

interface UseWrongAnswerOverlayLogicProps {
  wrongGuessCount: number;
  maxGuesses: number;
  setIsVisible: (visible: boolean) => void;
}

export function useWrongAnswerOverlayLogic({
  wrongGuessCount,
  maxGuesses,
  setIsVisible
}: UseWrongAnswerOverlayLogicProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const remainingGuesses = calculateRemainingGuesses(maxGuesses, wrongGuessCount);
  const xMarkSlots = generateXMarkSlots();

  // Handle manual close of overlay
  const handleAnimationComplete = () => {
    setIsVisible(false);
  };
  
  // Force hide overlay (useful for when Final Five starts, etc.)
  const hideOverlay = () => {
    setIsVisible(false);
  };

  // Style generators
  const modalStyle = getModalStyle(colors.primary);
  const getXMarkCircleStyleForIndex = () => getXMarkCircleStyle(colors.primary, colors.accent);
  const glowingRingStyle = getGlowingRingStyle(colors.primary);
  const titleStyle = getTitleStyle(colors.primary);
  const getProgressDotStyleForIndex = (isActive: boolean) => getProgressDotStyle(colors.primary, isActive);

  return {
    remainingGuesses,
    xMarkSlots,
    handleAnimationComplete,
    hideOverlay,
    modalStyle,
    getXMarkCircleStyleForIndex,
    glowingRingStyle,
    titleStyle,
    getProgressDotStyleForIndex,
    t
  };
}