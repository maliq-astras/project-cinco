import { useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Fact } from '@/types';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

interface BubbleGridItem {
  key: string;
  isEmpty: boolean;
  factIndex?: number;
  fact?: Fact<any>;
  category?: string;
  slotIndex: number;
}

/**
 * Hook for managing FactBubbleGrid logic and layout
 */
export function useFactBubbleGrid() {
  // Access state from the store
  const challenge = useGameStore(state => state.gameState.challenge);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  
  // Use our new unified responsive system
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    willFit,
    availableContentHeight
  } = useResponsive();
  
  // DOM refs for tutorial targeting
  const bubbleGridRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();
  
  // Always 8 grid items (4x2 layout)
  const totalSlots = 8;

  // Calculate grid items to display
  const gridItems = useMemo<BubbleGridItem[]>(() => {
    return Array.from({ length: totalSlots }).map((_, slotIndex) => {
      // Find the fact that should be in this position
      const factIndex = challenge?.facts.findIndex((_, factIndex) => 
        !revealedFacts.includes(factIndex) && 
        challenge?.facts
          .filter((_, i) => !revealedFacts.includes(i))
          .indexOf(challenge?.facts[factIndex]) === slotIndex
      );
      
      // If no fact should be in this position, it's an empty slot
      if (factIndex === undefined || factIndex === -1) {
        return {
          key: `empty-${slotIndex}`,
          isEmpty: true,
          slotIndex
        };
      }
      
      // Otherwise, it's a fact bubble
      const fact = challenge?.facts[factIndex];
      const category = fact?.category ? fact.category : challenge?.category;
      
      return {
        key: `fact-${factIndex}`,
        isEmpty: false,
        factIndex,
        fact,
        category: category?.toString().toLowerCase(),
        slotIndex
      };
    });
  }, [challenge, revealedFacts]);
  
  // Register grid container once
  useEffect(() => {
    if (bubbleGridRef.current) {
      registerElement('bubble-grid', bubbleGridRef.current);
    }
    return () => {
      unregisterElement('bubble-grid');
    };
  }, [registerElement, unregisterElement]);

  // Animation variants for the bubbles
  const animationProps = (slotIndex: number) => ({
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: isVictoryAnimationActive ? [1, 1.3, 0] : 1, 
      opacity: isVictoryAnimationActive ? [1, 1, 0] : 1,
      rotate: isVictoryAnimationActive ? [0, 15] : 0
    },
    exit: { scale: 0.8, opacity: 0 },
    transition: { 
      type: isVictoryAnimationActive ? "tween" : "spring",
      duration: isVictoryAnimationActive ? 0.5 : undefined,
      stiffness: isVictoryAnimationActive ? undefined : 300,
      damping: isVictoryAnimationActive ? undefined : 25,
      delay: isVictoryAnimationActive ? slotIndex * 0.15 : 0 // Staggered delay
    }
  });
  
  return {
    gridItems,
    bubbleSize: responsiveValues.bubbleSize,
    gapSize: responsiveValues.bubbleSpacing,
    animationProps,
    isVictoryAnimationActive,
    bubbleGridRef,
    
    // Responsive values from our new system
    responsiveValues,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    willFit,
    availableContentHeight
  };
} 