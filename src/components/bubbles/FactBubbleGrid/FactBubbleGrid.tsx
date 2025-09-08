'use client';

import React from 'react';
import FactBubble from '../FactBubble';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './FactBubbleGrid.module.css';
import { useFactBubbleGrid } from './hooks';
import { 
  getContainerStyle, 
  getGridTransformStyle, 
  isSingleRowLayout, 
  getGridHeight, 
  calculateGridScale 
} from './helpers';

const FactBubbleGrid = React.memo(() => {
  const {
    gridItems,
    bubbleSize,
    gapSize,
    animationProps,
    bubbleGridRef,
    responsiveValues,
    willFit,
    availableContentHeight,
    remainingFactsCount,
    layoutMode
  } = useFactBubbleGrid();

  const containerStyle = getContainerStyle(
    bubbleSize, 
    gapSize, 
    responsiveValues.spacing, 
    remainingFactsCount
  );

  const isSingleRow = isSingleRowLayout(remainingFactsCount, layoutMode);
  const gridHeight = getGridHeight(isSingleRow, bubbleSize, gapSize);
  const willGridFit = willFit.bubbleGrid(gridHeight);
  const gridScale = calculateGridScale(willGridFit, availableContentHeight, gridHeight);
  const gridTransformStyle = getGridTransformStyle(gridScale);

  return (
    <div className={styles.container} style={containerStyle}>
      <div 
        ref={bubbleGridRef}
        id="bubble-grid"
        className={`${styles.grid} ${isSingleRow ? styles.singleRow : styles.doubleRow}`}
        style={gridTransformStyle}
      >
        {(isSingleRow ? gridItems.filter(item => !item.isEmpty) : gridItems).map(item => {
          if (item.isEmpty) {
            return (
              <div 
                key={item.key} 
                style={{ width: `${bubbleSize}px` }}
                className={styles.emptySlot}
              />
            );
          }

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
});

FactBubbleGrid.displayName = 'FactBubbleGrid';

export default FactBubbleGrid;