'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FactCardBack from './FactCardBack';
import { useFactCardStack } from '../hooks';
import { factCardStackStyles, getCardClassNames } from '../styles/factCardStackStyles';

/**
 * Component that displays a stack of revealed fact cards
 * Supports interactive hover effects and animations
 */
export default function FactCardStack() {
  const {
    // State and data
    facts,
    visibleStackFacts,
    darkMode,
    
    // Card interaction handlers
    handleMouseMove,
    handleMouseLeave,
    stackRef,
    cardRefs,
    setHoveredCardIndex,
    
    // Computed values
    cardSize,
    containerStyles,
    
    // Event handlers
    onCardClicked,
    isCardClickable,
    
    // Animation helpers
    getCardVariants
  } = useFactCardStack();

  return (
    <div 
      className={factCardStackStyles.container}
      style={containerStyles.main}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={stackRef}
    >
      <motion.div 
        className={factCardStackStyles.innerContainer}
        style={containerStyles.inner}
      >
        <AnimatePresence mode="popLayout">
          {visibleStackFacts.map((factIndex, i) => {
            const cardVariantInfo = getCardVariants(factIndex, i);
            
            return (
              <motion.div
                key={`card-${factIndex}`}
                ref={el => {
                  cardRefs.current[i] = el;
                  return undefined;
                }}
                onClick={(e) => onCardClicked(factIndex, i, e)}
                onMouseEnter={() => isCardClickable(factIndex) && setHoveredCardIndex(i)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                className={getCardClassNames({
                  isClickable: cardVariantInfo.isClickable,
                  shadowClass: cardVariantInfo.shadowClass,
                  isDarkMode: darkMode
                })}
                custom={i}
                variants={cardVariantInfo.variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={cardVariantInfo.transitionSettings}
                style={factCardStackStyles.getCardPosition(
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