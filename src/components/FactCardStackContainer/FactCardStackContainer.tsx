'use client';

import React from 'react';
import FactCardStack from '../FactCardStack';
import { AnimatePresence } from 'framer-motion';
import { useFactCardStackContainer } from './useFactCardStackContainer';
import { factCardStackContainerStyles } from './FactCardStackContainer.styles';
import EmptyStackPlaceholder from '../EmptyStackPlaceholder';
import DropZoneIndicator from '../DropZoneIndicator';
import { useDragState } from '@/hooks/useDragState';

/**
 * Container component for FactCardStack
 */
export const FactCardStackContainer: React.FC = () => {
  const { 
    isFinalFiveActive,
    shouldShowPlaceholder,
    containerStyles,
    cardStackVisibilityClass,
    isHidden
  } = useFactCardStackContainer();

  const isDragging = useDragState(state => state.isDragging);

  // Don't render if Final Five is active to avoid duplicate stacks
  if (isFinalFiveActive) {
    return null;
  }

  return (
    <div className={`fact-card-stack-container ${factCardStackContainerStyles.container}`}>
      <div 
        className={factCardStackContainerStyles.innerContainer}
        style={containerStyles}
        id="facts-area"
      >
        <AnimatePresence>
          {shouldShowPlaceholder && !isHidden && (
            <EmptyStackPlaceholder key="placeholder" />
          )}
        </AnimatePresence>

        <div className={`${cardStackVisibilityClass} ${factCardStackContainerStyles.cardStackWrapper}`}
             style={{ opacity: isHidden ? 0 : 1 }}>
          <FactCardStack key="main-stack" />
        </div>

        {/* Drop zone indicator */}
        <DropZoneIndicator isVisible={isDragging} />
      </div>
    </div>
  );
};

export default FactCardStackContainer; 