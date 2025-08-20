'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Fact } from '@/types';
import IconContainer from '../../ui/IconContainer';
import FactCardBack from '../FactCardBack';
import { factCardStyles } from './FactCard.styles';
import { useFactCard } from './useFactCard';
import { getFactTypeName } from '@/helpers/i18nHelpers';
import { useLanguage } from '@/contexts/LanguageContext';

interface FactCardProps {
  fact: Fact<any>;
  visibleStackCount?: number;
}

/**
 * Component for displaying a single fact card
 * Handles animations for drawing, flipping, and returning cards
 */
export default function FactCard({ 
  fact, 
  visibleStackCount = 0
}: FactCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const currentLanguage = language as 'en' | 'es';
  
  // Exit immediately if no fact exists at all
  if (!fact) {
    return null;
  }
  
  // Function to determine the content to show based on current language
  const getContentForLanguage = () => {
    // If content is an object with language keys, use those
    if (fact.content && typeof fact.content === 'object') {
      return fact.content[currentLanguage] || fact.content.en || '';
    }
    
    // If content is a string, just return it
    if (typeof fact.content === 'string') {
      return fact.content;
    }
    
    return '';
  };

  // Use comprehensive hook for all card logic and state
  const {
    // Refs
    cardRef,
    
    // State
    isFlipped,
    isDrawn,
    isClosing,
    canClose,
    
    // Event handlers
    handleClose,
    handleClickOutside,
    handleAnimationComplete,
    
    // Animation properties
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition,
    closeButtonAnimations,
    closeButtonIconAnimations,
    
    // Styling and data
    factTypeStyle,
    strokeStyle,
    factTypeClasses,
    category,
    iconSize,
    cardStyles
  } = useFactCard({
    fact,
    visibleStackCount
  });

  return (
    <div className={factCardStyles.modalOverlay} onClick={handleClickOutside}>
      <div className="flip-card-container" ref={cardRef}>
        <motion.div
          className={factCardStyles.cardContainer}
          initial={initialAnimation}
          animate={cardAnimation}
          transition={cardTransition}
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Card container with 3D transform */}
          <motion.div
            className={factCardStyles.flipCard}
            initial={factCardStyles.flipAnimation.initial}
            animate={factCardStyles.flipAnimation.animate(isFlipped, isDrawn, isClosing)}
            transition={flipTransition}
            style={factCardStyles.preserve3d}
          >
            {/* Card Back (blue with white icon) - visible first */}
            <div className={factCardStyles.cardBack} style={cardStyles.hidden}>
              <FactCardBack fact={fact} inStack={false} />
            </div>

            {/* Card Front (white with fact content) - visible after flip */}
            <div 
              className={factCardStyles.cardFront}
              style={cardStyles.hidden}
            >
              {/* Close button - only visible when card is flipped to front */}
              {isFlipped && !isClosing && canClose && (
                <motion.button
                  onClick={handleClose}
                  className={factCardStyles.closeButton}
                  aria-label="Close fact card"
                  {...closeButtonAnimations}
                >
                  <motion.svg 
                    viewBox="0 0 100 100" 
                    className={factCardStyles.closeButtonIcon}
                    {...closeButtonIconAnimations}
                  >
                    <g stroke={strokeStyle} strokeWidth="12" strokeLinecap="round">
                      <path d="M30,30 L70,70" />
                      <path d="M70,30 L30,70" />
                    </g>
                  </motion.svg>
                </motion.button>
              )}
              
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
                  
                  <h3 className={factTypeClasses} style={factTypeStyle}>
                    {getFactTypeName(fact.factType, t)}
                  </h3>
                </div>
                
                {/* Bottom half - Fact Content */}
                <div className={factCardStyles.bottomHalf}>
                  <p className={factCardStyles.factContent}>
                    {getContentForLanguage()}
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