import { useMemo } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { Fact } from '../../../types';

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
  
  // Grid layout configuration
  const gridConfig = {
    cols: 4,
    rows: 2,
    totalSlots: 8
  };

  // Calculate container height based on screen size
  const getContainerHeight = () => {
    if (windowWidth < 380) return 140; // Small mobile
    if (windowWidth < 480) return 150; // Medium mobile
    if (windowWidth < 640) return 160; // Large mobile
    // For larger screens, dynamically calculate based on bubble and gap
    return gridConfig.rows * getBubbleSize() + getGapSize() * (gridConfig.rows - 1);
  };
  
  // Calculate bubble size based on screen width
  const getBubbleSize = () => {
    if (windowWidth < 380) return 65; // Small mobile
    if (windowWidth < 480) return 70; // Medium mobile
    if (windowWidth < 640) return 75; // Large mobile
    if (windowWidth < 768) return 80; // Small tablets
    if (windowWidth < 1024) return 90; // Larger tablets
    if (windowWidth < 1280) return 100; // Small desktops
    return 110; // Large desktops
  };
  
  // Calculate gap size based on screen width
  const getGapSize = () => {
    if (windowWidth < 380) return 16;
    if (windowWidth < 640) return 20;
    if (windowWidth < 1024) return 24;
    return 32;
  };
  
  // Calculate the grid items to display
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
  const containerWidth = Math.min(
    windowWidth - 32, // Account for page padding
    (getBubbleSize() * gridConfig.cols) + (getGapSize() * (gridConfig.cols - 1)) // Bubbles + gaps
  );
  
  // Grid style props
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
    width: `${containerWidth}px`,
    gap: `${getGapSize()}px`,
    height: `${getContainerHeight()}px`
  };
  
  return {
    gridItems,
    gridStyle,
    bubbleSize: getBubbleSize(),
    animationProps,
    isVictoryAnimationActive
  };
} 