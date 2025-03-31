'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Fact } from '../types';
import IconContainer from './IconContainer';
import FactCardBack from './FactCardBack';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { useCardFlip } from '../hooks/useCardFlip';
import { useResponsiveCard } from '../hooks/useResponsiveCard';
import { factCardInlineStyles, normalizeCategory } from '../helpers/factCardHelpers';
import { factCardStyles } from '../styles/factCardStyles';

interface FactCardProps {
  fact: Fact<any>;
  visibleStackCount?: number;
}

export default function FactCard({ 
  fact, 
  visibleStackCount = 0,
}: FactCardProps) {
  // Access state from the store
  const sourcePosition = useGameStore(state => state.cardSourcePosition);
  const cardRef = useRef<HTMLDivElement>(null);
  const { colors } = useTheme();

  // Use custom hooks for card logic
  const { iconSize } = useResponsiveCard(cardRef);
  const { 
    isFlipped, 
    isDrawn, 
    isClosing, 
    canClose,
    returnPosition, 
    handleClose, 
    handleAnimationComplete,
    // Use the animation properties from the hook
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition
  } = useCardFlip({ 
    sourcePosition, 
    visibleStackCount 
  });

  // Normalize the category
  const category = normalizeCategory(fact.category);
  
  // Get dynamic styles
  const factTypeClasses = factCardStyles.getFactTypeClasses(colors.dark);

  return (
    <div className={factCardStyles.modalOverlay}>
      <div className="flip-card-container" ref={cardRef}>
        <motion.div
          className={factCardStyles.cardContainer}
          initial={initialAnimation}
          animate={cardAnimation}
          transition={cardTransition}
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Close button - only visible when card is flipped to front */}
          {isFlipped && !isClosing && canClose && (
            <motion.button
              onClick={handleClose}
              className={factCardStyles.closeButton}
              aria-label="Close fact card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <motion.svg 
                viewBox="0 0 100 100" 
                className={factCardStyles.closeButtonIcon}
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <g stroke={`var(--color-${colors.primary})`} strokeWidth="12" strokeLinecap="round">
                  <path d="M30,30 L70,70" />
                  <path d="M70,30 L30,70" />
                </g>
              </motion.svg>
            </motion.button>
          )}
          
          {/* Card container with 3D transform */}
          <motion.div
            className={factCardStyles.flipCard}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 }}
            transition={flipTransition}
            style={factCardInlineStyles.preserve3d}
          >
            {/* Card Back (blue with white icon) - visible first */}
            <div className={factCardStyles.cardBack} style={factCardInlineStyles.hidden}>
              <FactCardBack fact={fact} />
            </div>

            {/* Card Front (white with fact content) - visible after flip */}
            <div 
              className={factCardStyles.cardFront}
              style={factCardInlineStyles.hidden}
            >
              <div className={factCardStyles.cardContent}>
                {/* Top half - Icon and Fact Type */}
                <div className={factCardStyles.topHalf}>
                  <IconContainer 
                    factType={fact.factType} 
                    isRevealed={true} 
                    size="medium"
                    iconSize={iconSize}
                    category={category.toLowerCase()}
                  />
                  
                  <h3 className={factTypeClasses}>
                    {fact.factType}
                  </h3>
                </div>
                
                {/* Bottom half - Fact Content */}
                <div className={factCardStyles.bottomHalf}>
                  <p className={factCardStyles.factContent}>
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