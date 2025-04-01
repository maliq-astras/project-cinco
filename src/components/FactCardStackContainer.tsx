'use client';

import React from 'react';
import FactCardStack from './FactCardStack';
import { AnimatePresence } from 'framer-motion';
import { useFactCardStackContainer } from '../hooks';
import { factCardStackContainerStyles } from '../styles/factCardStackContainerStyles';
import EmptyStackPlaceholder from './EmptyStackPlaceholder';

/**
 * Container component for FactCardStack
 */
export const FactCardStackContainer: React.FC = () => {
  const { 
    isFinalFiveActive,
    shouldShowPlaceholder,
    containerStyles,
    cardStackVisibilityClass
  } = useFactCardStackContainer();

  // Don't render if Final Five is active to avoid duplicate stacks
  if (isFinalFiveActive) {
    return null;
  }

  return (
    <div className={factCardStackContainerStyles.container}>
      <div 
        className={factCardStackContainerStyles.innerContainer}
        style={containerStyles}
        id="facts-area"
      >
        <AnimatePresence>
          {shouldShowPlaceholder && (
            <EmptyStackPlaceholder key="placeholder" />
          )}
        </AnimatePresence>

        <div className={`${cardStackVisibilityClass} ${factCardStackContainerStyles.cardStackWrapper}`}>
          <FactCardStack key="main-stack" />
        </div>
      </div>
    </div>
  );
};

export default FactCardStackContainer; 