'use client';

import React from 'react';
import FactCardStack from '../FactCardStack';
import { AnimatePresence } from 'framer-motion';
import { useFactCardStackContainer } from './hooks';
import { getResponsiveContainerStyle } from './helpers';
import styles from './FactCardStackContainer.module.css';
import EmptyStackPlaceholder from '../EmptyStackPlaceholder';

const FactCardStackContainer = React.memo(() => {
  const { 
    shouldShowPlaceholder,
    containerStyles,
    cardStackVisibilityClass,
    isHidden,
    factsAreaRef,
    containerRef,
    responsiveValues,
  } = useFactCardStackContainer();

  const responsiveContainerStyle = getResponsiveContainerStyle(responsiveValues.spacing);

  return (
    <div 
      ref={factsAreaRef} 
      className={`fact-card-stack-container ${styles.container}`}
      style={responsiveContainerStyle}
      id="facts-area"
    >
      <div 
        ref={containerRef}
        className={styles.innerContainer}
        style={containerStyles}
      >
        <AnimatePresence>
          {shouldShowPlaceholder && !isHidden && (
            <EmptyStackPlaceholder key="placeholder" />
          )}
        </AnimatePresence>

        <div className={styles.cardStackWrapper}>
          <div className={cardStackVisibilityClass} style={{ opacity: isHidden ? 0 : 1 }}>
            <FactCardStack key="main-stack" />
          </div>
        </div>
      </div>
    </div>
  );
});

FactCardStackContainer.displayName = 'FactCardStackContainer';

export default FactCardStackContainer; 