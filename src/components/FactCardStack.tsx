'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FactCardBack from './FactCardBack';
import { useGameStore } from '../store/gameStore';
import { useCardStack } from '../hooks/useCardStack';
import { calculateCardPosition, getCardAnimationVariants } from '../helpers/uiHelpers';

export default function FactCardStack() {
  // Access state and actions from the store
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const facts = useGameStore(state => state.gameState.challenge?.facts || []);
  const handleCardClick = useGameStore(state => state.handleCardClick);
  const viewingFact = useGameStore(state => state.viewingFact);
  const isReturningToStack = useGameStore(state => state.isReturningToStack);
  const isCardAnimatingOut = useGameStore(state => state.isCardAnimatingOut);
  
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

  // Handle card click event to open a card
  const onCardClicked = (factIndex: number, index: number, e: React.MouseEvent) => {
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
  
  return (
    <div 
      className="flex justify-center items-end min-h-[250px] relative py-8 card-stack-container"
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
          height: '220px'
        }}
      >
        <AnimatePresence mode="popLayout">
          {visibleStackFacts.map((factIndex, i) => {
            // Use helper function to calculate card position and styling
            const isHovered = hoveredCardIndex === i;
            const cardPosition = calculateCardPosition(i, visibleStackFacts.length, isHovered, hoveredCardIndex);
            
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
            
            return (
              <motion.div
                key={factIndex}
                ref={el => {
                  cardRefs.current[i] = el;
                  return undefined;
                }}
                onClick={(e) => onCardClicked(factIndex, i, e)}
                onMouseEnter={() => setHoveredCardIndex(i)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                className={`absolute p-0 border-2 border-blue-200 rounded-lg 
                  cursor-pointer w-[120px] sm:w-[140px] h-[180px] sm:h-[200px] card-hover-glow card-in-stack
                  ${cardPosition.shadowClass}`}
                initial={animations.initialState}
                animate={{
                  x: cardPosition.translateX,
                  y: cardPosition.translateY,
                  rotate: cardPosition.rotation,
                  scale: cardPosition.scale,
                  opacity: 1,
                  zIndex: cardPosition.zIndex
                }}
                exit={animations.exitState}
                transition={animations.transitionSettings}
                style={{
                  transformOrigin: 'bottom center',
                  left: 'calc(50% - 60px)', // Center the card (half of card width)
                  bottom: '0px',
                }}
                layout
              >
                {/* Card Content */}
                <FactCardBack fact={facts[factIndex]} size="small" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 