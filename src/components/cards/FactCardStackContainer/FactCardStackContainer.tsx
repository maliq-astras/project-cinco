'use client';

import React from 'react';
import FactCardStack from '../FactCardStack';
import { AnimatePresence } from 'framer-motion';
import { useFactCardStackContainer } from './useFactCardStackContainer';
import styles from './FactCardStackContainer.module.css';
import EmptyStackPlaceholder from '../EmptyStackPlaceholder';

/**
 * Container component for FactCardStack
 */
export const FactCardStackContainer: React.FC = () => {
  const { 
    shouldShowPlaceholder,
    containerStyles,
    cardStackVisibilityClass,
    isHidden,
    factsAreaRef,
    containerRef,
    responsiveValues,
  } = useFactCardStackContainer();



  // Create responsive container style
  const responsiveContainerStyle = {
    padding: `${responsiveValues.spacing}px`,
    marginBottom: `${responsiveValues.spacing}px`
  };

  return (
    <div 
      ref={containerRef} 
      className={`fact-card-stack-container ${styles.container}`}
      style={responsiveContainerStyle}
    >
      <div 
        ref={factsAreaRef}
        className={styles.innerContainer}
        style={containerStyles}
        id="facts-area"
      >
        <AnimatePresence>
          {shouldShowPlaceholder && !isHidden && (
            <EmptyStackPlaceholder key="placeholder" />
          )}
        </AnimatePresence>

        {/* FactCardStack - clean component, no drop zone logic */}
        <div className={styles.cardStackWrapper}>
          <div className={cardStackVisibilityClass} style={{ opacity: isHidden ? 0 : 1 }}>
            <FactCardStack key="main-stack" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactCardStackContainer; 