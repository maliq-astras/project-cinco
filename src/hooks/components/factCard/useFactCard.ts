import { useRef, useMemo } from 'react';
import { Fact } from '../../../types';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCardFlip, useResponsiveCard } from '../../card';
import { useCardAnimations } from '../../animation';
import { factCardInlineStyles, normalizeCategory } from '../../../helpers/factCardHelpers';
import { factCardStyles } from '../../../styles/factCardStyles';

interface UseFactCardProps {
  fact: Fact<any>;
  visibleStackCount: number;
}

/**
 * Comprehensive hook for the FactCard component that encapsulates all logic
 */
export function useFactCard({
  fact,
  visibleStackCount
}: UseFactCardProps) {
  // Create ref for the card container
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Access state from the store
  const sourcePosition = useGameStore(state => state.cardSourcePosition);
  const { colors } = useTheme();

  // Use custom hooks for card logic
  const { iconSize } = useResponsiveCard(cardRef);
  const { 
    isFlipped, 
    isDrawn, 
    isClosing, 
    canClose,
    handleClose, 
    handleAnimationComplete,
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition
  } = useCardFlip({ 
    sourcePosition, 
    visibleStackCount 
  });
  
  // Use animation hook for reusable animations
  const {
    closeButtonAnimations,
    closeButtonIconAnimations,
    colorStyle: factTypeStyle,
    strokeStyle
  } = useCardAnimations({
    primaryColor: colors.primary
  });

  // Process fact data
  const category = useMemo(() => 
    normalizeCategory(fact.category), 
    [fact.category]
  );
  
  // Create fact type classes
  const factTypeClasses = useMemo(() => 
    factCardStyles.getFactTypeClasses(colors.primary), 
    [colors.primary]
  );
  
  // Card style constants
  const cardStyles = {
    preserve3d: factCardInlineStyles.preserve3d,
    hidden: factCardInlineStyles.hidden
  };

  return {
    // Refs
    cardRef,
    
    // State and logic
    isFlipped,
    isDrawn,
    isClosing,
    canClose,
    
    // Event handlers
    handleClose,
    handleAnimationComplete,
    
    // Animation properties
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition,
    closeButtonAnimations,
    closeButtonIconAnimations,
    
    // Styling and data
    factTypeStyle,
    strokeStyle,
    factTypeClasses,
    category,
    iconSize,
    cardStyles
  };
} 