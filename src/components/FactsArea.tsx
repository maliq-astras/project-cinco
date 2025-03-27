import React from 'react';
import { Challenge } from '../types';
import FactCardStack from './FactCardStack';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

// Extracted placeholder component for empty card stack
const EmptyStackPlaceholder: React.FC = () => (
  <motion.div 
    className="border-2 border-dashed border-gray-200 rounded-lg w-[80%] max-w-[350px] h-[120px] sm:h-[140px] md:h-[160px] bg-gray-100 flex items-center justify-center absolute"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-gray-400 font-display text-sm sm:text-base">Revealed facts will appear here</div>
  </motion.div>
);

const FactsArea: React.FC = () => {
  // Access state from the store
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const challenge = useGameStore(state => state.gameState.challenge);
  const windowWidth = useGameStore(state => state.windowWidth);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const guesses = useGameStore(state => state.gameState.guesses);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const { colors } = useTheme();

  // If Final Five is active, don't render the FactsArea to avoid duplicate card stacks
  if (isFinalFiveActive) {
    return null;
  }

  // Calculate the appropriate height based on screen size
  const getResponsiveHeight = () => {
    // iPhone-specific height
    if (windowWidth >= 375 && windowWidth <= 430) return 150;
    
    if (windowWidth < 360) return 140; // Extra small devices
    if (windowWidth < 480) return 150; // Small devices
    if (windowWidth < 640) return 170; // Medium devices
    if (windowWidth < 768) return 180; // Medium-large devices
    return 220; // Large devices
  };

  // Get the correct answer for the victory message
  const correctGuess = guesses.find(g => g.isCorrect);

  return (
    <div 
      className="w-full max-w-4xl rounded-lg p-2 sm:p-3 md:p-4 mb-2 sm:mb-4 relative"
      style={{ height: `${getResponsiveHeight()}px` }}
    >
      {challenge && (
        <>
          {/* Placeholder that fades out when cards appear */}
          <AnimatePresence>
            {revealedFacts.length === 0 && !isVictoryAnimationActive && (
              <div className="flex items-center justify-center w-full h-full">
                <EmptyStackPlaceholder />
              </div>
            )}
          </AnimatePresence>
          
          {/* Container for cards */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full h-full">
            {/* Card stack that's always present but initially invisible */}
            <div 
              className={`${revealedFacts.length === 0 ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'} 
                w-full`}
            >
              <FactCardStack />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FactsArea; 