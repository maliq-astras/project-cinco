'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Fact, CategoryType } from '@/types';
import IconContainer from '../../ui/IconContainer';
import FactCardBack from '../FactCardBack';
import styles from './FactCard.module.css';
import { useFactCard } from './hooks';
import { getFactTypeName } from '@/helpers/i18nHelpers';
import { getContentForLanguage, getFlipCardAnimationProps, factTypeClasses } from './helpers';

interface FactCardProps {
  fact: Fact<CategoryType>;
  visibleStackCount?: number;
}

const FactCard = React.memo<FactCardProps>(({ 
  fact, 
  visibleStackCount = 0
}) => {
  const {
    cardRef,
    t,
    currentLanguage,
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

  const flipCardAnimationProps = getFlipCardAnimationProps(isFlipped, isDrawn, isClosing);

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
            {...flipCardAnimationProps}
            transition={flipTransition}
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
                    {getContentForLanguage(fact, currentLanguage)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
});

FactCard.displayName = 'FactCard';

export default FactCard; 