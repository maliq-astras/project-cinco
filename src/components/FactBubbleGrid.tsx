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
  
  // Calculate container width based on screen size
  const containerWidth = windowWidth < 640 
    ? Math.min(windowWidth - 32, cols * 80) // Mobile: account for padding and bubble size
    : Math.min(480, cols * 100); // Desktop: max width or based on columns

  return (
    <div 
      className="grid gap-4 md:gap-6 justify-items-center"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        width: containerWidth + 'px',
        height: `${rows * (windowWidth < 640 ? 80 : 100)}px` // Fixed height based on rows
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
              className="w-[65px] md:w-[80px] aspect-square opacity-0"
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
                className="w-[65px] md:w-[80px]" // Smaller on mobile
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