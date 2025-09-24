'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FactCardBack from '../FactCardBack';
import { useFactCardStack } from './hooks';
import { getCardPosition } from './helpers';
import styles from './FactCardStack.module.css';
import { ANIMATIONS } from '@/constants/animations';

const FactCardStack = React.memo(() => {
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
    getCardVariants,
    isResizing
  } = useFactCardStack();

  return (
    <motion.div
      className={styles.container}
      style={containerStyles.main}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={stackRef}
      animate={isResizing ? ANIMATIONS.RESIZE_FADE_OUT.animate : ANIMATIONS.RESIZE_FADE_IN.animate}
      transition={isResizing ? ANIMATIONS.RESIZE_FADE_OUT.transition : ANIMATIONS.RESIZE_FADE_IN.transition}
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
    </motion.div>
  );
});

FactCardStack.displayName = 'FactCardStack';

export default FactCardStack; 