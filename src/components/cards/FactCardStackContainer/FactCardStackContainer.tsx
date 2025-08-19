'use client';

import React from 'react';
import FactCardStack from '../FactCardStack';
import { AnimatePresence } from 'framer-motion';
import { useFactCardStackContainer } from './useFactCardStackContainer';
import styles from './FactCardStackContainer.module.css';
import EmptyStackPlaceholder from '../EmptyStackPlaceholder';
import DropZoneIndicator from '../DropZoneIndicator';
import { useDragState } from '@/hooks/ui/useDragState';

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
    containerRef
  } = useFactCardStackContainer();

  const isDragging = useDragState(state => state.isDragging);

  return (
    <div ref={containerRef} className={`fact-card-stack-container ${styles.container}`}>
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

        <div className={`${cardStackVisibilityClass} ${styles.cardStackWrapper}`}
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