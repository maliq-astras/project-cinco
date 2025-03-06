import React from 'react';
import { Challenge } from '../types';
import FactCardStack from './FactCardStack';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

// Extracted placeholder component for empty card stack
const EmptyStackPlaceholder: React.FC = () => (
  <motion.div 
    className="border-2 border-dashed border-gray-200 rounded-lg w-[350px] h-[180px] bg-gray-100 flex items-center justify-center absolute"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-gray-400 font-display">Revealed facts will appear here</div>
  </motion.div>
);

const FactsArea: React.FC = () => {
  // Access state from the store
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const challenge = useGameStore(state => state.gameState.challenge);

  return (
    <div className="h-[220px] w-full max-w-4xl rounded-lg p-4 mb-6 bg-gray-50 flex items-center justify-center relative">
      {challenge && (
        <>
          {/* Placeholder that fades out when cards appear */}
          <AnimatePresence>
            {revealedFacts.length === 0 && <EmptyStackPlaceholder />}
          </AnimatePresence>
          
          {/* Card stack that's always present but initially invisible */}
          <div className={`w-full ${revealedFacts.length === 0 ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
            <FactCardStack />
          </div>
        </>
      )}
    </div>
  );
};

export default FactsArea; 