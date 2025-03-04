'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fact } from '../types';
import { FactCardBack } from './FactCard';

interface FactCardStackProps {
  revealedFacts: number[];
  facts: Fact<any>[];
  onCardClick: (index: number, sourcePosition: { x: number, y: number }) => void;
}

export default function FactCardStack({ revealedFacts, facts, onCardClick }: FactCardStackProps) {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [prevRevealedFacts, setPrevRevealedFacts] = useState<number[]>([]);
  const [isCardReturning, setIsCardReturning] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);

  // Reset the initial render state when new facts are revealed
  useEffect(() => {
    // Check if this is a new card being added or removed
    const isNewCardAdded = revealedFacts.length > prevRevealedFacts.length;
    const isCardRemoved = revealedFacts.length < prevRevealedFacts.length;
    
    // Only set initial render to true for the first render or when a new card is added from a bubble
    if (prevRevealedFacts.length === 0 || (isNewCardAdded && !prevRevealedFacts.some(fact => !revealedFacts.includes(fact)))) {
      setIsInitialRender(true);
      const timer = setTimeout(() => {
        setIsInitialRender(false);
      }, revealedFacts.length * 100 + 500); // Wait for all cards to be dealt
      
      return () => clearTimeout(timer);
    }
    
    // Check if a card is returning to the stack (length is the same but order changed)
    if (revealedFacts.length === prevRevealedFacts.length && 
        JSON.stringify(revealedFacts) !== JSON.stringify(prevRevealedFacts)) {
      setIsCardReturning(true);
      const timer = setTimeout(() => {
        setIsCardReturning(false);
      }, 800); // Increased duration for the return animation to match the slower animations
      
      return () => clearTimeout(timer);
    }
    
    // Update the previous revealed facts
    setPrevRevealedFacts(revealedFacts);
    
    // Resize the refs array
    cardRefs.current = cardRefs.current.slice(0, revealedFacts.length);
  }, [revealedFacts]);

  // Handle mouse movement over the card area to create a subtle tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setHandPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHandPosition({ x: 0, y: 0 }); // Reset to neutral position
  };

  const handleCardClick = (factIndex: number, index: number, e: React.MouseEvent) => {
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
      
      // Pass the fact index and source position to the parent component
      onCardClick(factIndex, sourcePosition);
    } else {
      // Fallback to using the click position if the card element isn't available
      onCardClick(factIndex, { 
        x: e.clientX, 
        y: e.clientY 
      });
    }
  };

  if (revealedFacts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 min-h-[220px] flex items-center justify-center card-stack-container" ref={stackRef}>
        {prevRevealedFacts.length > 0 
          ? "Card in view. Close it to return to the stack."
          : "No facts revealed yet. Select a fact bubble below to reveal a clue!"}
      </div>
    );
  }

  // Calculate the fan angle based on the number of cards
  const fanAngle = Math.min(4, 12 / revealedFacts.length);
  const centerIndex = Math.floor(revealedFacts.length / 2);
  
  // Calculate the spread width based on the number of cards
  // For 5 cards, we want a wider spread than for 2 cards
  const spreadFactor = Math.max(40, 30 + (revealedFacts.length * 15));
  
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
          {revealedFacts.map((factIndex, i) => {
            // Calculate rotation and position for fan effect
            const isHovered = hoveredCardIndex === i;
            const isAdjacent = hoveredCardIndex !== null && 
                              (i === hoveredCardIndex - 1 || i === hoveredCardIndex + 1);
            
            // Base rotation for fan effect
            const baseRotation = (i - centerIndex) * fanAngle;
            
            // Base position - spread cards out in a fan
            const baseTranslateX = (i - centerIndex) * spreadFactor;
            
            // Adjust rotation and position when a card is hovered
            let rotation = baseRotation;
            let translateX = baseTranslateX;
            let translateY = 0;
            let scale = 1;
            let zIndex = revealedFacts.length - Math.abs(i - centerIndex); // Center cards on top
            let shadowClass = "shadow-sm";
            
            if (hoveredCardIndex !== null) {
              if (isHovered) {
                // Lift the hovered card up and forward
                translateY = -30;
                scale = 1.1;
                zIndex = 100; // Ensure it's on top
                rotation = 0; // Straighten the card
                shadowClass = "shadow-xl"; // Stronger shadow for lifted card
              } else if (isAdjacent) {
                // Adjacent cards move slightly away
                translateX = i < hoveredCardIndex ? translateX - 15 : translateX + 15;
                zIndex = 50 + i; // Higher than non-adjacent but lower than hovered
                shadowClass = "shadow-md"; // Medium shadow for adjacent cards
              } else {
                // Non-adjacent cards move slightly away
                translateX = i < hoveredCardIndex ? translateX - 10 : translateX + 10;
                translateY = -5; // Slight lift to create depth
              }
            }
            
            // Special animation for the last card if it's returning to the stack
            const isLastCard = i === revealedFacts.length - 1;
            const isReturningCard = isLastCard && isCardReturning;
            
            return (
              <motion.div
                key={factIndex}
                ref={el => {
                  cardRefs.current[i] = el;
                  return undefined;
                }}
                onClick={(e) => handleCardClick(factIndex, i, e)}
                onMouseEnter={() => setHoveredCardIndex(i)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                className={`absolute p-0 border-2 border-blue-200 rounded-lg 
                  cursor-pointer w-[140px] h-[200px] card-hover-glow card-in-stack
                  ${shadowClass}`}
                initial={isInitialRender ? {
                  y: 100,
                  x: -50 * (i - centerIndex),
                  rotate: -10,
                  opacity: 0
                } : isReturningCard ? {
                  x: 200, // Start from further to the right
                  y: 0,
                  opacity: 0,
                  scale: 0.4167, // Exact ratio between stack card and open card
                  rotate: 0
                } : {
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotate: rotation,
                  scale: scale,
                  opacity: 1,
                  zIndex: zIndex
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 280, // Slightly reduced stiffness for smoother animation
                  damping: 22, // Slightly increased damping for smoother animation
                  delay: isInitialRender ? i * 0.1 : isReturningCard ? 0.4 : 0 // Increased delay for returning cards
                }}
                style={{
                  transformOrigin: 'bottom center',
                  left: 'calc(50% - 70px)', // Center the card (half of card width)
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