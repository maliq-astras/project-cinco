import React from 'react';
import FactBubble from './FactBubble';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const FactBubbleGrid: React.FC = () => {
  // Access state from the store
  const challenge = useGameStore(state => state.gameState.challenge);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const windowWidth = useGameStore(state => state.windowWidth);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  
  // Always use a fixed 4x2 grid layout
  const cols = 4;
  const rows = 2;
  const totalSlots = cols * rows;
  
  // Enhanced sizing logic for multiple breakpoints
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px
  const getBubbleSize = () => {
    if (windowWidth < 380) return 65; // Small mobile
    if (windowWidth < 480) return 70; // Medium mobile
    if (windowWidth < 640) return 75; // Large mobile
    if (windowWidth < 768) return 80; // Small tablets
    if (windowWidth < 1024) return 90; // Larger tablets
    if (windowWidth < 1280) return 100; // Small desktops
    return 110; // Large desktops
  };
  
  const bubbleSize = getBubbleSize();
  
  // Calculate gap size based on screen width
  const gapSize = windowWidth < 380 ? 16 : windowWidth < 640 ? 20 : windowWidth < 1024 ? 24 : 32; // 4, 5, 6, or 8 in Tailwind scale

  // Calculate fixed height for different screen sizes - to prevent layout shifts
  const getContainerHeight = () => {
    if (windowWidth < 380) return 155; // Fixed height for small mobile
    if (windowWidth < 480) return 165; // Fixed height for medium mobile
    if (windowWidth < 640) return 175; // Fixed height for large mobile
    // For larger screens, dynamically calculate based on bubble and gap
    return rows * bubbleSize + gapSize * (rows - 1);
  };
  
  // Calculate container width based on screen size and bubble sizes
  const containerWidth = Math.min(
    windowWidth - 32, // Account for page padding
    (bubbleSize * cols) + (gapSize * (cols - 1)) // Bubbles + gaps
  );

  return (
    <div className="w-full flex justify-center">
      <div 
        className="grid justify-items-center"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          width: containerWidth + 'px',
          gap: `${gapSize}px`,
          height: getContainerHeight() + 'px'
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
                animate={{ 
                  scale: isVictoryAnimationActive ? [1, 1.3, 0] : 1, 
                  opacity: isVictoryAnimationActive ? [1, 1, 0] : 1,
                  rotate: isVictoryAnimationActive ? [0, 15] : 0
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  type: isVictoryAnimationActive ? "tween" : "spring",
                  duration: isVictoryAnimationActive ? 0.5 : undefined,
                  stiffness: isVictoryAnimationActive ? undefined : 300,
                  damping: isVictoryAnimationActive ? undefined : 25,
                  delay: isVictoryAnimationActive ? slotIndex * 0.15 : 0 // Increased stagger delay
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
    </div>
  );
};

export default FactBubbleGrid; 