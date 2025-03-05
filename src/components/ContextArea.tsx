import React from 'react';
import { Challenge } from '../types';
import { useGameStore } from '../store/gameStore';

const ContextArea: React.FC = () => {
  const challenge = useGameStore(state => state.gameState.challenge);
  const hoveredFact = useGameStore(state => state.hoveredFact);
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);

  return (
    <div className="h-[40px] w-full max-w-4xl rounded-lg p-3 mb-6 bg-white text-center flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Invisible placeholder text to maintain space */}
        <span className="invisible" aria-hidden="true">
          Geographic Features & Border Info Fact
        </span>
        
        {/* Actual text that appears on hover */}
        <span 
          className={`absolute inset-0 flex items-center justify-center text-blue-600 font-medium font-display transition-opacity duration-200 ${
            hoveredFact !== null && !revealedFacts.includes(hoveredFact) 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          {hoveredFact !== null && !revealedFacts.includes(hoveredFact) && challenge
            ? `${challenge.facts[hoveredFact].factType} Fact`
            : ''
          }
        </span>
      </div>
    </div>
  );
};

export default ContextArea; 