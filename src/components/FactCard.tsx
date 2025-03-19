'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Fact } from '../types';
import IconContainer from './IconContainer';
import FactCardBack from './FactCardBack';
import { useGameStore } from '../store/gameStore';
import { getCardInitialPosition, getCardReturnPosition, calculateCardReturnPosition } from '../helpers/cardAnimationHelpers';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();

  // Ensure we have a valid category
  const category = fact.category ? 
    (typeof fact.category === 'string' ? fact.category : fact.category.toString()) : 
    'countries';

  // Dynamically adjust icon size based on card size
  useEffect(() => {
    const updateIconSize = () => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
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

  // Handle click outside the card
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      handleClose();
    }
  }, []);

  // Handle closing the card
  const handleClose = () => {
    // First flip the card back
    setIsFlipped(false);
    setIsClosing(true);
    
    // After the flip animation, start the return animation
    setTimeout(() => {
      // Calculate the return position
      setReturnPosition(calculateCardReturnPosition(visibleStackCount));
      
      // After the return animation completes, call closeFactCard from the store
      setTimeout(() => {
        closeFactCard();
      }, 500);
    }, 400);
  };

  // Setup animations and event listeners
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
      }, 500);
      
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

  // Handle animation completion
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
          initial={getCardInitialPosition(sourcePosition)}
          animate={!isClosing ? { 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0
          } : getCardReturnPosition(returnPosition)}
          transition={{
            duration: sourcePosition || isClosing ? 0.7 : 0.3,
            ease: "easeInOut"
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            className="flip-card w-full h-full"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 15,
              duration: 0.9
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
                    category={category.toLowerCase()}
                  />
                  
                  <h3 className={`text-base sm:text-lg font-semibold text-${colors.dark} text-center mt-4`}>
                    {fact.factType}
                  </h3>
                </div>
                
                {/* Bottom half - Fact Content */}
                <div className="flex-1 flex items-center justify-center pt-4">
                  <p className="text-gray-800 text-sm sm:text-base text-center leading-tight sm:leading-snug">
                    {fact.content}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 