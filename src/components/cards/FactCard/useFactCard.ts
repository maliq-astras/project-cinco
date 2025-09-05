import { useMemo, useRef } from 'react';
import { Fact } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useCardFlip, useResponsiveCard } from '@/hooks/card';
import { useCardAnimations } from '@/hooks/animation';
import { factCardInlineStyles, normalizeCategory } from '@/helpers/factCardHelpers';

interface UseFactCardProps {
  fact: Fact<any>;
  visibleStackCount: number;
}

export function useFactCard({
  fact,
  visibleStackCount
}: UseFactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
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
    cardRef,
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