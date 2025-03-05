'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Fact } from '../types';
import IconContainer, { FactCardBackIcon } from './IconContainer';
import { useGameStore } from '../store/gameStore';

// Shared component for the back of the card
export function FactCardBack({ fact, size = 'large' }: { fact: Fact<any>, size?: 'small' | 'large' }) {
  return (
    <div className="bg-blue-600 rounded-lg flex items-center justify-center w-full h-full">
      <FactCardBackIcon fact={fact} size={size} />
    </div>
  );
}

interface FactCardProps {
  fact: Fact<any>;
  visibleStackCount?: number;
}

export default function FactCard({ 
  fact, 
  visibleStackCount = 0,
}: FactCardProps) {
  // Access state and actions from the store
  const closeFactCard = useGameStore(state => state.closeFactCard);
  const completeCardAnimation = useGameStore(state => state.completeCardAnimation);
  const sourcePosition = useGameStore(state => state.cardSourcePosition);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDrawn, setIsDrawn] = useState(!sourcePosition);
  const [isClosing, setIsClosing] = useState(false);
  const [returnPosition, setReturnPosition] = useState<{ x: number, y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [frontIconSize, setFrontIconSize] = useState(40);

  // Dynamically adjust icon size based on card size
  useEffect(() => {
    const updateIconSize = () => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
        // Set icon size to be proportional to card width
        // For a 320px wide card, we want a 40px icon
        const newIconSize = Math.max(32, Math.round(cardWidth * 0.125));
        setFrontIconSize(newIconSize);
      }
    };
    
    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    
    return () => {
      window.removeEventListener('resize', updateIconSize);
    };
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      handleClose();
    }
  }, []);

  const handleClose = () => {
    // First flip the card back
    setIsFlipped(false);
    setIsClosing(true);
    
    // After the flip animation, start the return animation
    setTimeout(() => {
      // Find the card stack element to get its position
      const cardStackElement = document.querySelector('.card-stack-container');
      
      if (cardStackElement) {
        const rect = cardStackElement.getBoundingClientRect();
        
        // Check if there are visible cards in the stack
        if (visibleStackCount > 0) {
          // Find the rightmost card in the stack
          const rightmostCard = document.querySelector('.card-stack-container .card-in-stack:last-child');
          
          if (rightmostCard) {
            // Position to the right of the rightmost card
            const cardRect = rightmostCard.getBoundingClientRect();
            setReturnPosition({
              x: cardRect.right + 20, // Position to the right of the last card with some spacing
              y: cardRect.top + cardRect.height / 2 // Align with the vertical center of the card
            });
          } else {
            // Fallback: position to the right side of the stack
            setReturnPosition({
              x: rect.right - 70, // Position at the right edge of the stack minus half card width
              y: rect.top + rect.height / 2 // Position at the vertical center of the stack
            });
          }
        } else {
          // If no cards in the stack, position to the center of the stack
          setReturnPosition({
            x: rect.left + rect.width / 2, // Center of the stack horizontally
            y: rect.top + rect.height / 2 // Center of the stack vertically
          });
        }
      } else {
        // Fallback if we can't find the card stack element
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const centerX = viewportWidth / 2;
        
        // Position based on whether there are cards in the stack
        if (visibleStackCount > 0) {
          setReturnPosition({
            x: centerX + 150, // Move to the right side
            y: viewportHeight / 2 - 50 // Adjust to match the card stack's vertical position
          });
        } else {
          setReturnPosition({
            x: centerX, // Center horizontally
            y: viewportHeight / 2 - 50 // Adjust to match the card stack's vertical position
          });
        }
      }
      
      // After the return animation completes, call closeFactCard from the store
      setTimeout(() => {
        closeFactCard();
      }, 500); // Return animation duration - increased for smoother animation
    }, 400); // Flip animation duration - increased for smoother animation
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    
    // If we're drawing from the stack, first animate the drawing
    if (sourcePosition && !isClosing) {
      // Start the flip animation after the drawing animation completes
      const timer = setTimeout(() => {
        setIsDrawn(true);
        
        // Then start the flip animation after a short delay
        const flipTimer = setTimeout(() => {
          setIsFlipped(true);
        }, 300);
        
        return () => clearTimeout(flipTimer);
      }, 500); // Drawing animation duration
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        clearTimeout(timer);
      };
    } else if (!isClosing) {
      // If not drawing from stack, just do the flip animation
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 300);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        clearTimeout(timer);
      };
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, sourcePosition, isClosing]);

  // Calculate the initial position for the drawing animation
  const getInitialPosition = () => {
    if (!sourcePosition) return { opacity: 0, scale: 0.8 };
    
    // Get the center of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Calculate the offset from center
    const offsetX = sourcePosition.x - centerX;
    const offsetY = sourcePosition.y - centerY;
    
    // Calculate the rotation based on the position in the stack
    // Cards on the left side of the stack have negative rotation, right side have positive
    const rotation = offsetX > 0 ? Math.min(5, offsetX / 50) : Math.max(-5, offsetX / 50);
    
    // Calculate the exact scale ratio between stack card and open card
    // For small screens: stack card (120x180) and open card (280x420)
    // For larger screens: stack card (140x200) and open card (320x480)
    const isSmallScreen = window.innerWidth < 640; // sm breakpoint in Tailwind
    const scaleRatio = isSmallScreen ? 0.429 : 0.4167; // 120/280 = 0.429 or 140/320 = 0.4375
    
    return {
      x: offsetX,
      y: offsetY,
      rotate: rotation,
      scale: scaleRatio,
      opacity: 1
    };
  };

  // Calculate the final position for the return animation
  const getFinalPosition = () => {
    if (!returnPosition) return { opacity: 0 };
    
    // Get the center of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Calculate the offset from center
    const offsetX = returnPosition.x - centerX;
    const offsetY = returnPosition.y - centerY;
    
    // Calculate the exact scale ratio between stack card and open card
    // For small screens: stack card (120x180) and open card (280x420)
    // For larger screens: stack card (140x200) and open card (320x480)
    const isSmallScreen = window.innerWidth < 640; // sm breakpoint in Tailwind
    const scaleRatio = isSmallScreen ? 0.429 : 0.4167; // 120/280 = 0.429 or 140/320 = 0.4375
    
    return {
      x: offsetX,
      y: offsetY,
      scale: scaleRatio,
      opacity: 1, // Keep the card fully opaque
      rotateY: 0
    };
  };

  // Handle animation completion with store action
  const handleAnimationComplete = () => {
    if (isClosing) {
      completeCardAnimation();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay bg-black bg-opacity-50">
      <div className="flip-card-container" ref={cardRef}>
        <motion.div
          className="relative w-[280px] sm:w-[320px] h-[420px] sm:h-[480px] rounded-lg shadow-xl overflow-hidden"
          initial={getInitialPosition()}
          animate={!isClosing ? { 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0
          } : getFinalPosition()}
          transition={{
            duration: sourcePosition || isClosing ? 0.7 : 0.3, // Increased duration for smoother animation
            ease: "easeInOut" // Changed to easeInOut for smoother animation
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            className="flip-card w-full h-full"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 70, // Reduced stiffness for smoother animation
              damping: 15,
              duration: 0.9 // Increased duration for smoother animation
            }}
          >
            {/* Card Back (blue with white icon) - visible first */}
            <div className="flip-card-back absolute inset-0">
              <FactCardBack fact={fact} />
            </div>

            {/* Card Front (white with fact content) - visible after flip */}
            <div className="flip-card-front absolute inset-0 bg-white rounded-lg shadow-xl p-4 sm:p-6 flex flex-col card-border-glow">
              <div className="w-full h-full flex flex-col z-10">
                {/* Top half - Icon and Fact Type */}
                <div className="flex-1 flex flex-col items-center justify-center pb-4 border-b border-gray-200">
                  <IconContainer 
                    factType={fact.factType} 
                    isRevealed={true} 
                    size="medium"
                    iconSize={frontIconSize}
                  />
                  
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 text-center mt-4">
                    {fact.factType}
                  </h3>
                </div>
                
                {/* Bottom half - Fact Content */}
                <div className="flex-1 flex items-center justify-center pt-4">
                  <div className="w-full max-h-[200px] sm:max-h-[240px] overflow-y-auto">
                    <p className="text-sm sm:text-base text-gray-700 text-left">{fact.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 