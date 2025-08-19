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
    bubbleGridRef
  } = useFactBubbleGrid();

  return (
    <div className={styles.container}>
      <div 
        ref={bubbleGridRef}
        id="bubble-grid"
        className={styles.grid}
        style={{
          '--bubble-size': `${bubbleSize}px`,
          '--bubble-gap': `${gapSize}px`
        } as React.CSSProperties}
      >
        {gridItems.map(item => {
          // For empty slots, render a placeholder
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