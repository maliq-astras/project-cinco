import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generateInstructionMessage, getInstructionTextClassName } from '../helpers';

interface UseGameInstructionsLogicParams {
  isGameOver: boolean;
  showLoading: boolean;
  isLongRequest: boolean;
  hasSeenClue: boolean;
  canMakeGuess: boolean;
  darkMode: boolean;
  colors: { primary: string };
  hasUserInput: boolean;
}

export const useGameInstructionsLogic = ({
  isGameOver,
  showLoading,
  isLongRequest,
  hasSeenClue,
  canMakeGuess,
  darkMode,
  colors,
  hasUserInput
}: UseGameInstructionsLogicParams) => {
  const { t } = useTranslation('common');

  const message = useMemo(() => 
    generateInstructionMessage({
      isGameOver,
      showLoading,
      isLongRequest,
      hasSeenClue,
      canMakeGuess,
      t
    }),
    [isGameOver, showLoading, isLongRequest, hasSeenClue, canMakeGuess, t]
  );

  const textClassName = useMemo(() => 
    getInstructionTextClassName(darkMode, colors.primary, hasUserInput),
    [darkMode, colors.primary, hasUserInput]
  );

  const animationProps = useMemo(() => ({
    initial: { opacity: 1 },
    animate: { opacity: isGameOver ? 0 : 1 },
    transition: { duration: 0.8 }
  }), [isGameOver]);

  const loadingAnimation = useMemo(() => 
    showLoading ? {
      animate: {
        rotate: 360
      },
      transition: {
        repeat: Infinity,
        duration: isLongRequest ? 1.5 : 1,
        ease: "linear"
      }
    } : {},
    [showLoading, isLongRequest]
  );

  return {
    message,
    textColor: darkMode ? 'white' : colors.primary,
    textClassName,
    shouldAnimate: true,
    isHidden: isGameOver,
    animationProps,
    loadingAnimation,
    isProcessingGuess: showLoading,
    isLongRequest
  };
};