import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useCardStack } from '@/hooks/card';
import { calculateCardPosition, getCardAnimationVariants } from '@/helpers/uiHelpers';
import { deviceDetection } from '@/helpers/deviceHelpers';

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
  const windowWidth = useGameStore(state => state.windowWidth);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const { colors, darkMode } = useTheme();
  
  // Filter out the currently viewed card from the stack unless it's returning
  const visibleStackFacts = useMemo(() => {
    return revealedFacts.filter(factIndex => 
      factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
    );
  }, [revealedFacts, viewingFact, isReturningToStack, isCardAnimatingOut]);
  
  // Use our custom hook for card stack interactions and animations
  const cardStackHook = useCardStack(visibleStackFacts);
  const centerIndex = Math.floor(visibleStackFacts.length / 2);

  // Responsive card sizes based on screen width
  const getCardSize = () => {
    // Special case for iPad Air landscape - needs smaller cards to fit
    if (deviceDetection.isIpadAirLandscape()) {
      return { width: 100, height: 150 }; // Smaller cards for iPad Air landscape
    }
    
    // iPhone-specific sizes (around 390-430px width)
    if (windowWidth >= 375 && windowWidth <= 430) return { width: 90, height: 135 }; 
    
    // General sizes
    if (windowWidth < 360) return { width: 85, height: 128 }; // Extra small mobile
    if (windowWidth < 480) return { width: 90, height: 135 }; // Small mobile
    if (windowWidth < 640) return { width: 100, height: 150 }; // Mobile
    if (windowWidth < 768) return { width: 110, height: 165 }; // Small tablets
    if (windowWidth < 1024) return { width: 120, height: 180 }; // Tablets
    return { width: 140, height: 200 }; // Desktop
  };

  const cardSize = getCardSize();
  
  // Height of the container
  const getContainerHeight = () => {
    // iPhone-specific height
    if (windowWidth >= 375 && windowWidth <= 430) return 150;
    
    if (windowWidth < 360) return 145; // Extra small devices
    if (windowWidth < 480) return 155; // Small devices
    if (windowWidth < 640) return 170; // Medium-small devices
    if (windowWidth < 768) return 180; // Medium devices
    return 220; // Large devices
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
      cardStackHook.hoveredCardIndex
    );
    
    // Scale hover effect based on screen size
    const getHoverTranslateY = () => {
      if (windowWidth < 480) return -15; // Less dramatic on small screens
      if (windowWidth < 768) return -20;
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
      paddingTop: '1rem', 
      paddingBottom: '1rem'
    },
    inner: {
      perspective: '1000px',
      transform: `rotateX(${cardStackHook.handPosition.y * -3}deg) rotateY(${cardStackHook.handPosition.x * 5}deg)`,
      width: '100%',
      height: `${getContainerHeight() - 20}px`
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
    victoryVariants
  };
} 