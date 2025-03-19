import React from 'react';
import FactBubble from './FactBubble';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const FactBubbleGrid: React.FC = () => {
  // Access state from the store
  const challenge = useGameStore(state => state.gameState.challenge);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const windowWidth = useGameStore(state => state.windowWidth);
  
  // Always use a fixed 4x2 grid layout
  const cols = 4;
  const rows = 2;
  const totalSlots = cols * rows;
  
  // Enhanced sizing logic for multiple breakpoints
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px
  const getBubbleSize = () => {
    if (windowWidth < 640) return 65; // Mobile
    if (windowWidth < 768) return 80; // Small tablets
    if (windowWidth < 1024) return 90; // Larger tablets
    if (windowWidth < 1280) return 100; // Small desktops
    return 110; // Large desktops
  };
  
  const bubbleSize = getBubbleSize();
  
  // Calculate gap size based on screen width
  const gapSize = windowWidth < 640 ? 16 : windowWidth < 1024 ? 24 : 32; // 4, 6, or 8 in Tailwind scale
  
  // Calculate container width based on screen size and bubble sizes
  const containerWidth = Math.min(
    windowWidth - 32, // Account for page padding
    (bubbleSize * cols) + (gapSize * (cols - 1)) // Bubbles + gaps
  );

  return (
    <div 
      className="grid justify-items-center"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        width: containerWidth + 'px',
        gap: `${gapSize}px`,
        height: `${rows * bubbleSize + gapSize * (rows - 1)}px` // Dynamic height based on bubble size and gaps
      }}
    >
      {/* Map through all 8 positions in the grid */}
      {Array.from({ length: totalSlots }).map((_, slotIndex) => {
        // Find the fact that should be in this position
        const factIndex = challenge?.facts.findIndex((_, factIndex) => 
          !revealedFacts.includes(factIndex) && 
          challenge?.facts
            .filter((_, i) => !revealedFacts.includes(i))
            .indexOf(challenge?.facts[factIndex]) === slotIndex
        );
        
        // If no fact should be in this position, render an empty slot
        if (factIndex === undefined || factIndex === -1) {
          return (
            <div 
              key={`empty-${slotIndex}`} 
              style={{ width: `${bubbleSize}px` }}
              className="aspect-square opacity-0"
            />
          );
        }
        
        // Otherwise, render the fact bubble
        const fact = challenge?.facts[factIndex];
        if (!fact) return null;
        
        // Get category either from the fact itself or from the challenge
        const category = fact.category ? fact.category : challenge?.category;
        
        return (
          <AnimatePresence mode="popLayout" key={`slot-${slotIndex}`}>
            <motion.div
              key={`fact-${factIndex}`}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.4
              }}
              className="flex items-center justify-center"
            >
              <FactBubble
                factType={fact.factType}
                isRevealed={false}
                data-fact-index={factIndex}
                style={{ width: `${bubbleSize}px` }}
                className="aspect-square" // Maintain square aspect ratio
                category={category.toString().toLowerCase()}
              />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default FactBubbleGrid; 