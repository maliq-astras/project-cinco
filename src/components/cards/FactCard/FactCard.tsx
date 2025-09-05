'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Fact } from '@/types';
import IconContainer from '../../ui/IconContainer';
import FactCardBack from '../FactCardBack';
import styles from './FactCard.module.css';
import { useFactCard } from './useFactCard';
import { getFactTypeName } from '@/helpers/i18nHelpers';
import { useLanguage } from '@/contexts/LanguageContext';

interface FactCardProps {
  fact: Fact<any>;
  visibleStackCount?: number;
}

export default function FactCard({ 
  fact, 
  visibleStackCount = 0
}: FactCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const currentLanguage = language as 'en' | 'es';
  
  const {
    cardRef,
    isFlipped,
    isDrawn,
    isClosing,
    canClose,
    handleClose,
    handleClickOutside,
    handleAnimationComplete,
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition,
    closeButtonAnimations,
    closeButtonIconAnimations,
    factTypeStyle,
    strokeStyle,
    category,
    iconSize,
    cardStyles
  } = useFactCard({
    fact,
    visibleStackCount
  });
  
  if (!fact) {
    return null;
  }
  
  const getContentForLanguage = () => {
    if (fact.content && typeof fact.content === 'object') {
      return fact.content[currentLanguage] || fact.content.en || '';
    }
    
    if (typeof fact.content === 'string') {
      return fact.content;
    }
    
    return '';
  };

  const factTypeClasses = `text-base sm:text-lg font-semibold text-center mt-4 fact-type`;

  return (
    <div className={`${styles.modalOverlay} modal-overlay`} onClick={handleClickOutside}>
      <div className="flip-card-container" ref={cardRef}>
        <motion.div
          className={styles.cardContainer}
          initial={initialAnimation}
          animate={cardAnimation}
          transition={cardTransition}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            className="flip-card"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 }}
            transition={flipTransition}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`${styles.cardBack} flip-card-back`} style={cardStyles.hidden}>
              <FactCardBack fact={fact} inStack={false} />
            </div>

            <div 
              className={`${styles.cardFront} flip-card-front`}
              style={cardStyles.hidden}
            >
              {isFlipped && !isClosing && canClose && (
                <motion.button
                  onClick={handleClose}
                  className={styles.closeButton}
                  aria-label="Close fact card"
                  {...closeButtonAnimations}
                >
                  <motion.svg 
                    viewBox="0 0 100 100" 
                    className={styles.closeButtonIcon}
                    {...closeButtonIconAnimations}
                  >
                    <g stroke={strokeStyle} strokeWidth="12" strokeLinecap="round">
                      <path d="M30,30 L70,70" />
                      <path d="M70,30 L30,70" />
                    </g>
                  </motion.svg>
                </motion.button>
              )}
              
              <div className={styles.cardContent}>
                <div className={styles.topHalf}>
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
                
                <div className={styles.bottomHalf}>
                  <p className={styles.factContent}>
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