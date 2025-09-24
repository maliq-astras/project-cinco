import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useResponsive } from '@/hooks/responsive';
import { Fact, CategoryType } from '@/types';

interface BubbleGridItem {
  key: string;
  isEmpty: boolean;
  factIndex?: number;
  fact?: Fact<CategoryType>;
  category?: string;
  slotIndex: number;
}

interface UseFactBubbleGridLogicProps {
  totalSlots: number;
}

export const useFactBubbleGridLogic = ({ totalSlots }: UseFactBubbleGridLogicProps) => {
  const challenge = useGameStore(state => state.gameState.challenge);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  
  const {
    responsiveValues,
    willFit,
    availableContentHeight,
    layoutMode,
    isResizing
  } = useResponsive();

  const remainingFactsCount = useMemo(() => {
    if (!challenge) return 0;
    return challenge.facts.length - revealedFacts.length;
  }, [challenge, revealedFacts]);

  const gridItems = useMemo<BubbleGridItem[]>(() => {
    if (!challenge) {
      return Array.from({ length: totalSlots }, (_, slotIndex) => ({
        key: `empty-${slotIndex}`,
        isEmpty: true,
        slotIndex
      }));
    }

    const unrevealedFacts = challenge.facts.filter((_, index) => !revealedFacts.includes(index));

    return Array.from({ length: totalSlots }, (_, slotIndex) => {
      const fact = unrevealedFacts[slotIndex];
      
      if (!fact) {
        return {
          key: `empty-${slotIndex}`,
          isEmpty: true,
          slotIndex
        };
      }
      
      const factIndex = challenge.facts.indexOf(fact);
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
  }, [challenge, revealedFacts, totalSlots]);

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
      delay: isVictoryAnimationActive ? slotIndex * 0.15 : 0
    }
  });

  return {
    gridItems,
    remainingFactsCount,
    animationProps,
    bubbleSize: responsiveValues.bubbleSize,
    gapSize: responsiveValues.bubbleSpacing,
    responsiveValues,
    willFit,
    availableContentHeight,
    layoutMode,
    isResizing
  };
};