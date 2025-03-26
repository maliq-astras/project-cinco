'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FactCardBack from './FactCardBack';
import { useGameStore } from '../store/gameStore';
import { useCardStack } from '../hooks/useCardStack';
import { calculateCardPosition, getCardAnimationVariants } from '../helpers/uiHelpers';
import { useTheme } from '../context/ThemeContext';

export default function FactCardStack() {
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
  const { colors } = useTheme();
  
  // Filter out the currently viewed card from the stack unless it's returning
  const visibleStackFacts = useMemo(() => {
    return revealedFacts.filter(factIndex => 
      factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
    );
  }, [revealedFacts, viewingFact, isReturningToStack, isCardAnimatingOut]);
  
  // Use our custom hook for card stack interactions and animations
  const {
    hoveredCardIndex,
    isInitialRender,
    isCardReturning,
    handPosition,
    cardRefs,
    stackRef,
    setHoveredCardIndex,
    handleMouseMove,
    handleMouseLeave
  } = useCardStack(visibleStackFacts);

  const centerIndex = Math.floor(visibleStackFacts.length / 2);

  // Responsive card sizes based on screen width
  const getCardSize = () => {
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
    const cardElement = cardRefs.current[index];
    
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

  return (
    <div 
      className="flex justify-center items-end relative card-stack-container"
      style={{ minHeight: `${getContainerHeight()}px`, paddingTop: '1rem', paddingBottom: '1rem' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={stackRef}
    >
      <motion.div 
        className="relative flex items-end justify-center transition-transform duration-300 ease-out" 
        style={{ 
          perspective: '1000px',
          transform: `rotateX(${handPosition.y * -3}deg) rotateY(${handPosition.x * 5}deg)`,
          width: '100%',
          height: `${getContainerHeight() - 20}px`
        }}
      >
        <AnimatePresence mode="popLayout">
          {visibleStackFacts.map((factIndex, i) => {
            // Use helper function to calculate card position and styling
            const isHovered = hoveredCardIndex === i && isCardClickable(factIndex);
            const cardPosition = calculateCardPosition(i, visibleStackFacts.length, isHovered, hoveredCardIndex);
            
            // Scale hover effect based on screen size
            const getHoverTranslateY = () => {
              if (windowWidth < 480) return -15; // Less dramatic on small screens
              if (windowWidth < 768) return -20;
              return -30; // Full effect on larger screens
            };
            
            // Adjust translateY for hover
            const adjustedTranslateY = isHovered ? getHoverTranslateY() : cardPosition.translateY;
            
            // Special animation for the last card if it's returning to the stack
            const isLastCard = i === visibleStackFacts.length - 1;
            const isReturningCard = isLastCard && isCardReturning;
            
            // Get animation variants for this card
            const animations = getCardAnimationVariants(
              isInitialRender,
              isReturningCard,
              i,
              centerIndex
            );

            const variants = {
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
            };

            return (
              <motion.div
                key={`card-${factIndex}`}
                ref={el => {
                  cardRefs.current[i] = el;
                  return undefined;
                }}
                onClick={(e) => onCardClicked(factIndex, i, e)}
                onMouseEnter={() => isCardClickable(factIndex) && setHoveredCardIndex(i)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                className={`absolute p-0 border-2 border-${colors.light} rounded-lg 
                  ${isCardClickable(factIndex) ? 'cursor-pointer card-hover-glow' : 'cursor-not-allowed opacity-70'} card-in-stack
                  ${cardPosition.shadowClass}`}
                custom={i}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={animations.transitionSettings}
                style={{
                  transformOrigin: 'bottom center',
                  left: `calc(50% - ${cardSize.width / 2}px)`, // Center the card
                  bottom: '0px',
                  width: `${cardSize.width}px`,
                  height: `${cardSize.height}px`,
                  zIndex: revealedFacts.length - i
                }}
              >
                <FactCardBack fact={facts[factIndex]} size="small" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 