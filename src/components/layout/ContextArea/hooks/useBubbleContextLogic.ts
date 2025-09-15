import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Challenge } from '@/types';
import { generateBubbleMessage, getBubbleTextClassName } from '../helpers';

interface UseBubbleContextLogicParams {
  challenge: Challenge | null;
  hoveredFact: number | null;
  revealedFacts: number[];
  isGameOver: boolean;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  colors: { primary: string };
  darkMode: boolean;
}

export const useBubbleContextLogic = ({
  challenge,
  hoveredFact,
  revealedFacts,
  isGameOver,
  isFinalFiveActive,
  showFinalFiveTransition,
  colors,
  darkMode
}: UseBubbleContextLogicParams) => {
  const { t } = useTranslation('common');

  const message = useMemo(() => 
    generateBubbleMessage({
      hoveredFact,
      challenge,
      revealedFacts,
      isGameOver,
      isFinalFiveActive,
      showFinalFiveTransition,
      t
    }),
    [hoveredFact, challenge, revealedFacts, isGameOver, isFinalFiveActive, showFinalFiveTransition, t]
  );

  const textClassName = useMemo(() => 
    getBubbleTextClassName(darkMode, colors.primary),
    [darkMode, colors.primary]
  );

  return {
    message,
    textColor: darkMode ? 'white' : colors.primary,
    textClassName
  };
};