'use client';

import React from 'react';
import FactBubble from '../FactBubble';
import { AnimatePresence, motion } from 'framer-motion';
import { useFactBubbleGrid } from './useFactBubbleGrid';
import styles from './FactBubbleGrid.module.css';

/**
 * Grid component that displays interactive fact bubbles
 * Handles responsive layout and animations
 */
const FactBubbleGrid: React.FC = () => {
  const {
    gridItems,
    bubbleSize,
    gapSize,
    animationProps,
    bubbleGridRef,
    responsiveValues,
    breakpoint,
    willFit,
    availableContentHeight,
    remainingFactsCount,
    layoutMode,
    isNarrow
  } = useFactBubbleGrid();

  // Create responsive container style
  const containerStyle = {
    '--bubble-size': `${bubbleSize}px`,
    '--bubble-spacing': `${gapSize}px`,
    '--grid-margin-top': `${responsiveValues.spacing}px`,
    '--remaining-count': remainingFactsCount
  } as React.CSSProperties;

  // Determine if we should use single row layout (4 or fewer bubbles, and only in desktop mode)
  const isSingleRow = remainingFactsCount <= 4 && remainingFactsCount > 0 && layoutMode === 'desktop';
  
  // Check if grid will fit in available height
  const gridHeight = isSingleRow ? bubbleSize : (2 * bubbleSize) + gapSize;
  const willGridFit = willFit.bubbleGrid(gridHeight);

  // Calculate responsive scale if grid doesn't fit
  const gridScale = willGridFit ? 1 : Math.min(0.9, availableContentHeight / gridHeight);

  return (
    <div className={styles.container} style={containerStyle}>
      <div 
        ref={bubbleGridRef}
        id="bubble-grid"
        className={`${styles.grid} ${isSingleRow ? styles.singleRow : styles.doubleRow}`}
        style={{
          // Add responsive adjustments if grid doesn't fit
          transform: gridScale !== 1 ? `scale(${gridScale})` : undefined,
          transformOrigin: 'center'
        }}
      >
        {(isSingleRow ? gridItems.filter(item => !item.isEmpty) : gridItems).map(item => {
          // For empty slots, render a placeholder (only in double row mode)
          if (item.isEmpty) {
            return (
              <div 
                key={item.key} 
                style={{ width: `${bubbleSize}px` }}
                className={styles.emptySlot}
              />
            );
          }

          // For fact bubbles, render the animated bubble
          return (
            <AnimatePresence mode="popLayout" key={`slot-${item.slotIndex}`}>
              <motion.div
                key={item.key}
                layout
                {...animationProps(item.slotIndex)}
                className={styles.bubbleContainer}
              >
                <FactBubble
                  factType={item.fact?.factType || ''}
                  isRevealed={false}
                  data-fact-index={item.factIndex ?? 0}
                  style={{ width: `${bubbleSize}px` }}
                  className="aspect-square"
                  category={item.category}
                  slotIndex={item.slotIndex}
                />
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
};

export default FactBubbleGrid; 