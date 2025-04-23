'use client';

import React from 'react';
import FactBubble from './FactBubble';
import { AnimatePresence, motion } from 'framer-motion';
import { useFactBubbleGrid } from '../hooks';
import { factBubbleGridStyles } from '../styles/factBubbleGridStyles';

/**
 * Grid component that displays interactive fact bubbles
 * Handles responsive layout and animations
 */
const FactBubbleGrid: React.FC = () => {
  const {
    gridItems,
    gridStyle,
    bubbleSize,
    animationProps
  } = useFactBubbleGrid();

  return (
    <div className={factBubbleGridStyles.container} style={factBubbleGridStyles.containerSpacing}>
      <div 
        id="bubble-grid"
        className={factBubbleGridStyles.grid}
        style={gridStyle}
      >
        {gridItems.map(item => {
          // For empty slots, render a placeholder
          if (item.isEmpty) {
            return (
              <div 
                key={item.key} 
                style={factBubbleGridStyles.bubbleSize(bubbleSize)}
                className={factBubbleGridStyles.emptySlot}
              />
            );
          }

          // For fact bubbles, render the animated bubble
          return (
            <AnimatePresence mode="popLayout" key={`slot-${item.slotIndex}`}>
              <motion.div
                key={item.key}
                id={item.slotIndex === 0 ? 'bubble-0' : undefined}
                layout
                {...animationProps(item.slotIndex)}
                className={factBubbleGridStyles.bubbleContainer}
              >
                <FactBubble
                  factType={item.fact?.factType || ''}
                  isRevealed={false}
                  data-fact-index={item.factIndex ?? 0}
                  style={factBubbleGridStyles.bubbleSize(bubbleSize)}
                  className="aspect-square"
                  category={item.category}
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