import { useMemo, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useCardStack } from './useCardStack';
import { calculateCardPosition, getCardAnimationVariants } from '../helpers';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useEffect } from 'react';
import { useResponsive } from '@/hooks/responsive';

export function useFactCardStack() {
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const facts = useGameStore(state => state.gameState.challenge?.facts || []);
  const handleCardClick = useGameStore(state => state.handleCardClick);
  const viewingFact = useGameStore(state => state.viewingFact);
  const isReturningToStack = useGameStore(state => state.isReturningToStack);
  const isCardAnimatingOut = useGameStore(state => state.isCardAnimatingOut);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  
  const { 
    responsiveValues,
    breakpoint,
    getResponsiveValue
  } = useResponsive();
  
  const { registerElement, unregisterElement } = useDOMRefs();
  
  const visibleStackFacts = useMemo(() => {
    return revealedFacts.filter(factIndex => 
      factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
    );
  }, [revealedFacts, viewingFact, isReturningToStack, isCardAnimatingOut]);
  
  const onCardClicked = (factIndex: number, cardIndex: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!canRevealNewClue && !revealedFacts.includes(factIndex)) return;
    
    // NOTE: Direct DOM query is necessary here due to React ref timing issues
    // The DOM refs are registered in useEffect, but the click handler needs immediate access
    // to the card position. This ensures we get the correct source position for animations.
    const cardElement = document.querySelector(`[data-card-index="${cardIndex}"]`);
    
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      
      const sourcePosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      handleCardClick(factIndex, sourcePosition);
    } else {
      handleCardClick(factIndex, { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
    }
  };

  const cardStackHook = useCardStack(visibleStackFacts, onCardClicked);
  const centerIndex = Math.floor(visibleStackFacts.length / 2);

  useEffect(() => {
    if (cardStackHook.stackRef.current) {
      registerElement('card-stack-container', cardStackHook.stackRef.current);
    }
    
    if (cardStackHook.cardRefs.current.length > 0) {
      const lastIndex = cardStackHook.cardRefs.current.length - 1;
      const rightmostCard = cardStackHook.cardRefs.current[lastIndex];
      if (rightmostCard) {
        registerElement('rightmost-card', rightmostCard);
      }
    }
    
    return () => {
      unregisterElement('card-stack-container');
      unregisterElement('rightmost-card');
    };
  }, [cardStackHook.stackRef, cardStackHook.cardRefs, registerElement, unregisterElement]);

  const cardSize = useMemo(() => {
    return responsiveValues.cardSize;
  }, [responsiveValues.cardSize]);
  
  const getContainerHeight = () => {
    const baseHeight = responsiveValues.cardSize.height;
    const spacing = responsiveValues.spacing;
    
    return baseHeight + (spacing * 2);
  };

  
  const isCardClickable = useCallback((factIndex: number) => {
    return canRevealNewClue || revealedFacts.includes(factIndex);
  }, [canRevealNewClue, revealedFacts]);
  
  const getCardVariants = useCallback((factIndex: number, index: number) => {
    const isHovered = cardStackHook.hoveredCardIndex === index && isCardClickable(factIndex);
    const cardPosition = calculateCardPosition(
      index, 
      visibleStackFacts.length, 
      isHovered, 
      cardStackHook.hoveredCardIndex,
      breakpoint
    );
    
    const getHoverTranslateY = () => {
      return getResponsiveValue({ xs: -15, sm: -18, md: -20, lg: -25, xl: -30 });
    };
    
    const adjustedTranslateY = isHovered ? getHoverTranslateY() : cardPosition.translateY;
    
    const isLastCard = index === visibleStackFacts.length - 1;
    const isReturningCard = isLastCard && cardStackHook.isCardReturning;
    
    const animations = getCardAnimationVariants(
      cardStackHook.isInitialRender,
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
    cardStackHook.hoveredCardIndex,
    cardStackHook.isCardReturning, 
    cardStackHook.isInitialRender,
    visibleStackFacts.length,
    breakpoint,
    centerIndex,
    isVictoryAnimationActive,
    victoryAnimationStep,
    canRevealNewClue,
    revealedFacts,
    getResponsiveValue,
    isCardClickable
  ]);

  const containerStyles = {
    main: {
      minHeight: `${getContainerHeight()}px`, 
      paddingTop: `${responsiveValues.spacing}px`, 
      paddingBottom: `${responsiveValues.spacing}px`
    },
    inner: {
      perspective: '1000px',
      transform: `rotateX(${cardStackHook.handPosition.y * -3}deg) rotateY(${cardStackHook.handPosition.x * 5}deg)`,
      width: '100%',
      height: `${getContainerHeight() - (responsiveValues.spacing * 2)}px`
    }
  };

  return {
    facts,
    visibleStackFacts,
    isVictoryAnimationActive,
    ...cardStackHook,
    cardSize,
    containerStyles,
    onCardClicked,
    isCardClickable,
    getCardVariants,
    responsiveValues,
    breakpoint
  };
} 