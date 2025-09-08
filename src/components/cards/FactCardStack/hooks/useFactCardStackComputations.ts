import { useMemo, useCallback } from 'react';
import { calculateCardPosition, getCardAnimationVariants } from '../helpers';

interface UseFactCardStackComputationsProps {
  revealedFacts: number[];
  viewingFact: number | null;
  isReturningToStack: boolean;
  isCardAnimatingOut: boolean;
  responsiveValues: Record<string, any>;
  hoveredCardIndex: number | null;
  isCardReturning: boolean;
  isInitialRender: boolean;
  breakpoint: string;
  isVictoryAnimationActive: boolean;
  victoryAnimationStep: string;
  getResponsiveValue: (values: Record<string, number>) => number;
  isCardClickable: (factIndex: number) => boolean;
}

/**
 * Hook for computing FactCardStack derived values and animations
 * @param props Dependencies for computations
 * @returns Computed values and functions
 */
export function useFactCardStackComputations({
  revealedFacts,
  viewingFact,
  isReturningToStack,
  isCardAnimatingOut,
  responsiveValues,
  hoveredCardIndex,
  isCardReturning,
  isInitialRender,
  breakpoint,
  isVictoryAnimationActive,
  victoryAnimationStep,
  getResponsiveValue,
  isCardClickable
}: UseFactCardStackComputationsProps) {

  const visibleStackFacts = useMemo(() => {
    return revealedFacts.filter(factIndex => 
      factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
    );
  }, [revealedFacts, viewingFact, isReturningToStack, isCardAnimatingOut]);

  const centerIndex = Math.floor(visibleStackFacts.length / 2);

  const cardSize = useMemo(() => {
    return responsiveValues.cardSize;
  }, [responsiveValues.cardSize]);
  
  const getContainerHeight = useCallback(() => {
    const baseHeight = responsiveValues.cardSize.height;
    const spacing = responsiveValues.spacing;
    
    return baseHeight + (spacing * 2);
  }, [responsiveValues]);

  const getCardVariants = useCallback((factIndex: number, index: number) => {
    const isHovered = hoveredCardIndex === index && isCardClickable(factIndex);
    const cardPosition = calculateCardPosition(
      index, 
      visibleStackFacts.length, 
      isHovered, 
      hoveredCardIndex,
      breakpoint
    );
    
    const getHoverTranslateY = () => {
      return getResponsiveValue({ xs: -15, sm: -18, md: -20, lg: -25, xl: -30 });
    };
    
    const adjustedTranslateY = isHovered ? getHoverTranslateY() : cardPosition.translateY;
    
    const isLastCard = index === visibleStackFacts.length - 1;
    const isReturningCard = isLastCard && isCardReturning;
    
    const animations = getCardAnimationVariants(
      isInitialRender,
      isReturningCard,
      index,
      centerIndex
    );

    return {
      variants: {
        initial: animations.initialState,
        animate: isVictoryAnimationActive ? (
          victoryAnimationStep === 'summary' ? {
            x: cardPosition.translateX,
            y: adjustedTranslateY,
            rotate: [cardPosition.rotation - 5, cardPosition.rotation + 5],
            scale: cardPosition.scale,
            opacity: isCardClickable(factIndex) ? 1 : 0.7,
            transition: {
              rotate: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut"
              }
            }
          } : {
            x: cardPosition.translateX,
            y: adjustedTranslateY,
            rotate: cardPosition.rotation,
            scale: cardPosition.scale,
            opacity: isCardClickable(factIndex) ? 1 : 0.7
          }
        ) : {
          x: cardPosition.translateX,
          y: adjustedTranslateY,
          rotate: cardPosition.rotation,
          scale: cardPosition.scale,
          opacity: isCardClickable(factIndex) ? 1 : 0.7
        },
        exit: animations.exitState
      },
      transitionSettings: animations.transitionSettings,
      cardPosition,
      shadowClass: cardPosition.shadowClass,
      isClickable: isCardClickable(factIndex)
    };
  }, [
    hoveredCardIndex,
    isCardReturning, 
    isInitialRender,
    visibleStackFacts.length,
    breakpoint,
    centerIndex,
    isVictoryAnimationActive,
    victoryAnimationStep,
    getResponsiveValue,
    isCardClickable
  ]);

  return {
    visibleStackFacts,
    centerIndex,
    cardSize,
    getContainerHeight,
    getCardVariants
  };
}