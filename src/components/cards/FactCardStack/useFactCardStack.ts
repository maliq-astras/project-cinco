import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useCardStack } from '@/hooks/card';
import { calculateCardPosition, getCardAnimationVariants } from '@/helpers/uiHelpers';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useEffect } from 'react';
import { useResponsive } from '@/hooks/responsive';

/**
 * Hook for managing FactCardStack logic and interactions
 */
export function useFactCardStack() {
  // Access state and actions from the store
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const facts = useGameStore(state => state.gameState.challenge?.facts || []);
  const handleCardClick = useGameStore(state => state.handleCardClick);
  const viewingFact = useGameStore(state => state.viewingFact);
  const isReturningToStack = useGameStore(state => state.isReturningToStack);
  const isCardAnimatingOut = useGameStore(state => state.isCardAnimatingOut);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const { darkMode } = useTheme();
  
  // Use our new unified responsive system
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait
  } = useResponsive();
  
  // DOM refs for accessing card stack elements
  const { registerElement, unregisterElement } = useDOMRefs();
  
  // Filter out the currently viewed card from the stack unless it's returning
  const visibleStackFacts = useMemo(() => {
    return revealedFacts.filter(factIndex => 
      factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
    );
  }, [revealedFacts, viewingFact, isReturningToStack, isCardAnimatingOut]);
  
  // Use our custom hook for card stack interactions and animations
  const cardStackHook = useCardStack(visibleStackFacts);
  const centerIndex = Math.floor(visibleStackFacts.length / 2);

  // Register card stack elements with DOM refs provider
  useEffect(() => {
    if (cardStackHook.stackRef.current) {
      registerElement('card-stack-container', cardStackHook.stackRef.current);
    }
    
    // Register the rightmost card if it exists
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

  // Responsive card sizes using our new system - sized to fit within drop zone
  const cardSize = useMemo(() => {
    // Use responsive values for card sizing
    const baseSize = responsiveValues.cardSize;
    
    // Adjust for different breakpoints while maintaining aspect ratio
    const aspectRatio = baseSize.height / baseSize.width;
    
    // Increased sizes since drop zone now has proper height
    if (breakpoint === 'xs') {
      return { width: Math.round(80 * 1.15), height: Math.round(80 * aspectRatio * 1.1) };
    } else if (breakpoint === 'sm') {
      return { width: Math.round(90 * 1.15), height: Math.round(90 * aspectRatio * 1.1) };
    } else if (breakpoint === 'md') {
      return { width: Math.round(100 * 1.15), height: Math.round(100 * aspectRatio * 1.1) };
    } else if (breakpoint === 'lg') {
      return { width: Math.round(110 * 1.15), height: Math.round(110 * aspectRatio * 1.1) };
    } else {
      return { width: Math.round(120 * 1.15), height: Math.round(120 * aspectRatio * 1.1) };
    }
  }, [responsiveValues.cardSize, breakpoint]);
  
  // Height of the container using responsive values
  const getContainerHeight = () => {
    // Use responsive spacing for container height
    const baseHeight = responsiveValues.cardSize.height;
    const spacing = responsiveValues.spacing;
    
    return baseHeight + (spacing * 2);
  };

  // Handle card click event to open a card
  const onCardClicked = (factIndex: number, index: number, e: React.MouseEvent) => {
    // Don't allow clicking if we can't reveal a new clue
    if (!canRevealNewClue && !revealedFacts.includes(factIndex)) return;
    
    // Get the exact position of the card element
    const cardElement = cardStackHook.cardRefs.current[index];
    
    if (cardElement) {
      // Get the bounding rectangle of the card
      const rect = cardElement.getBoundingClientRect();
      
      // Calculate the center of the card
      const sourcePosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      // Pass the fact index and source position to the store action
      handleCardClick(factIndex, sourcePosition);
    } else {
      // Fallback to using the click position if the card element isn't available
      handleCardClick(factIndex, { 
        x: e.clientX, 
        y: e.clientY 
      });
    }
  };
  
  // Determines if a card is clickable
  const isCardClickable = (factIndex: number) => {
    return canRevealNewClue || revealedFacts.includes(factIndex);
  };
  
  // Animation variants for victory celebration
  const victoryVariants = {
    initial: { x: 0, y: 0, rotate: 0 },
    animate: (i: number) => ({
      x: i % 2 === 0 ? [0, -10, 0, 10, 0] : [0, 10, 0, -10, 0],
      y: [0, -15, 0, -15, 0],
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: 0.5 // Add a small delay before starting the dance
      }
    })
  };

  // Generate card variants for each card in the stack
  const getCardVariants = (factIndex: number, index: number) => {
    const isHovered = cardStackHook.hoveredCardIndex === index && isCardClickable(factIndex);
    const cardPosition = calculateCardPosition(
      index, 
      visibleStackFacts.length, 
      isHovered, 
      cardStackHook.hoveredCardIndex,
      breakpoint
    );
    
    // Scale hover effect based on responsive breakpoint
    const getHoverTranslateY = () => {
      if (breakpoint === 'xs') return -15; // Less dramatic on small screens
      if (breakpoint === 'sm') return -18;
      if (breakpoint === 'md') return -20;
      if (breakpoint === 'lg') return -25;
      return -30; // Full effect on larger screens
    };
    
    // Adjust translateY for hover
    const adjustedTranslateY = isHovered ? getHoverTranslateY() : cardPosition.translateY;
    
    // Special animation for the last card if it's returning to the stack
    const isLastCard = index === visibleStackFacts.length - 1;
    const isReturningCard = isLastCard && cardStackHook.isCardReturning;
    
    // Get animation variants for this card
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
  };

  // Generate container styles for the stack
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
    // State and data
    facts,
    visibleStackFacts,
    isVictoryAnimationActive,
    darkMode,
    
    // Card stack hook properties
    ...cardStackHook,
    
    // Calculated values
    cardSize,
    containerStyles,
    
    // Event handlers
    onCardClicked,
    isCardClickable,
    
    // Animation helpers
    getCardVariants,
    victoryVariants,
    
    // Responsive values from our new system
    responsiveValues,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait
  };
} 