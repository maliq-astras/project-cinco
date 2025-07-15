import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Fact } from '../../types';
import { getBubbleSize, getGapSize, getGridConfig, getContainerHeight } from '../../helpers';

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
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  
  // Grid layout configuration using the helper function
  const gridConfig = getGridConfig(windowWidth);

  // Calculate grid items to display
  const gridItems = useMemo<BubbleGridItem[]>(() => {
    return Array.from({ length: gridConfig.totalSlots }).map((_, slotIndex) => {
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
  
  // Calculate container width
  const bubbleSizeValue = getBubbleSize(windowWidth);
  const gapSizeValue = getGapSize(windowWidth);
  
  const containerWidth = Math.min(
    windowWidth - 32, // Account for page padding
    (bubbleSizeValue * gridConfig.cols) + (gapSizeValue * (gridConfig.cols - 1)) // Bubbles + gaps
  );
  
  // Grid style props
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
    width: `${containerWidth}px`,
    gap: `${gapSizeValue}px`,
    height: `${getContainerHeight(windowWidth, gridConfig)}px`
  };
  
  return {
    gridItems,
    gridStyle,
    bubbleSize: bubbleSizeValue,
    animationProps,
    isVictoryAnimationActive
  };
} 