import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { getFactIcon, useIconFilter } from '@/helpers/iconHelpers';
import { useResponsive } from '@/hooks/responsive';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

interface UseFactBubbleLogicProps {
  factType: string;
  isRevealed: boolean;
  category: string;
  slotIndex?: number;
  bubbleRef: React.RefObject<HTMLButtonElement | null>;
  popPosition: { x: number; y: number };
  setIsTouchDevice: (value: boolean) => void;
}

export const useFactBubbleLogic = ({
  factType,
  isRevealed,
  category,
  slotIndex,
  bubbleRef,
  popPosition,
  setIsTouchDevice
}: UseFactBubbleLogicProps) => {
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const isPendingFinalFiveTransition = useGameStore(state => state.isPendingFinalFiveTransition);
  
  const { colors } = useTheme();
  const getFilter = useIconFilter();
  const { responsiveValues } = useResponsive();
  const { registerElement } = useDOMRefs();

  useEffect(() => {
    if (slotIndex === 0 && bubbleRef.current) {
      registerElement('bubble-0', bubbleRef.current);
    }
  }, [slotIndex, registerElement, factType, isRevealed, bubbleRef]);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, [setIsTouchDevice]);

  const isClickable = useMemo(() => 
    (isRevealed || canRevealNewClue) && !isGameOver && !isFinalFiveActive && !showFinalFiveTransition && !isPendingFinalFiveTransition, 
  [isRevealed, canRevealNewClue, isGameOver, isFinalFiveActive, showFinalFiveTransition, isPendingFinalFiveTransition]);

  const icon = useMemo(() => {
    const bubbleSize = responsiveValues.bubbleSize;    
    const iconSize = Math.max(28, Math.round(bubbleSize * 0.6));
    
    return getFactIcon(factType, false, iconSize, category);
  }, [factType, category, responsiveValues.bubbleSize]);

  const bubbleAnimation = useMemo(() => ({
    scale: [1, 1.2, 0],
    opacity: [1, 1, 0],
    x: popPosition.x,
    y: popPosition.y,
    transition: {
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1]
    }
  }), [popPosition]);

  return {
    isClickable,
    icon,
    colors,
    bubbleAnimation,
    getIconFilter: getFilter,
    responsiveValues
  };
};