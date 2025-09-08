import { useMemo } from 'react';
import { Fact, CategoryType } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useCardFlip } from './useCardFlip';
import { useResponsiveCard } from './useResponsiveCard';
import { useCardAnimations } from './useCardAnimations';
import { factCardInlineStyles, normalizeCategory } from '../helpers';

interface UseFactCardLogicProps {
  fact: Fact<CategoryType>;
  visibleStackCount: number;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function useFactCardLogic({
  fact,
  visibleStackCount,
  cardRef
}: UseFactCardLogicProps) {
  const sourcePosition = useGameStore(state => state.cardSourcePosition);
  const { colors } = useTheme();

  const { iconSize } = useResponsiveCard(cardRef);
  const { 
    isFlipped, 
    isDrawn, 
    isClosing, 
    canClose,
    handleClose, 
    handleClickOutside,
    handleAnimationComplete,
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition
  } = useCardFlip({ 
    sourcePosition, 
    visibleStackCount
  });
  
  const {
    closeButtonAnimations,
    closeButtonIconAnimations,
    colorStyle: factTypeStyle,
    strokeStyle
  } = useCardAnimations({
    primaryColor: colors.primary
  });

  const category = useMemo(() => 
    normalizeCategory(fact.category), 
    [fact.category]
  );
  
  const cardStyles = {
    preserve3d: factCardInlineStyles.preserve3d,
    hidden: factCardInlineStyles.hidden
  };

  return {
    isFlipped,
    isDrawn,
    isClosing,
    canClose,
    handleClose,
    handleClickOutside,
    handleAnimationComplete,
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition,
    closeButtonAnimations,
    closeButtonIconAnimations,
    factTypeStyle,
    strokeStyle,
    category,
    iconSize,
    cardStyles
  };
} 