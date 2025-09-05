'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FactCardBack from '../FactCardBack';
import { useFactCardStack } from './useFactCardStack';
import { getCardPosition } from '@/helpers/uiHelpers';
import styles from './FactCardStack.module.css';

export default function FactCardStack() {
  const {
    facts,
    visibleStackFacts,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    stackRef,
    cardRefs,
    setHoveredCardIndex,
    cardSize,
    containerStyles,
    onCardClicked,
    isCardClickable,
    getCardVariants
  } = useFactCardStack();

  return (
    <div 
      className={styles.container}
      style={containerStyles.main}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={stackRef}
    >
      <motion.div 
        className={styles.innerContainer}
        style={containerStyles.inner}
      >
        <AnimatePresence mode="popLayout">
          {visibleStackFacts.map((factIndex, i) => {
            const cardVariantInfo = getCardVariants(factIndex, i);
            
            return (
              <motion.div
                key={`card-${factIndex}`}
                data-card-index={i}
                ref={el => {
                  cardRefs.current[i] = el;
                  return undefined;
                }}
                onClick={(e) => onCardClicked(factIndex, i, e)}
                onMouseEnter={() => isCardClickable(factIndex) && setHoveredCardIndex(i)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                className={[
                  styles.card,
                  cardVariantInfo.isClickable ? `${styles.cardClickable} card-hover-glow` : styles.cardNonClickable,
                  cardVariantInfo.shadowClass
                ].join(' ')}
                custom={i}
                variants={cardVariantInfo.variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={cardVariantInfo.transitionSettings}
                style={getCardPosition(
                  cardSize,
                  i,
                  visibleStackFacts.length
                )}
              >
                <FactCardBack fact={facts[factIndex]} size="small" inStack={true} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 