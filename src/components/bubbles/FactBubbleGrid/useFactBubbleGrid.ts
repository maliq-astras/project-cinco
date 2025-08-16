import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Fact } from '@/types';
import { getBubbleSize, getGapSize } from '@/helpers';

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
  const windowWidth = useGameStore(state => state.windowWidth);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  
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
  
  // Get window height for responsive sizing
  const windowHeight = window.innerHeight;
  
  // Calculate bubble and gap sizes using responsive helpers
  const bubbleSizeValue = getBubbleSize(windowHeight);
  const gapSizeValue = getGapSize(windowHeight);
  
  // Use full available width to ensure proper centering
  const containerWidth = windowWidth - 32; // Account for page padding
  
  // Use the calculated bubble size (CSS handles the grid layout)
  const finalBubbleSize = bubbleSizeValue;
  
  return {
    gridItems,
    bubbleSize: finalBubbleSize,
    gapSize: gapSizeValue,
    animationProps,
    isVictoryAnimationActive
  };
} 