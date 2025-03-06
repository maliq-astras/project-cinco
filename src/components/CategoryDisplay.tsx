import React from 'react';
import { useGameStore } from '../store/gameStore';

interface CategoryDisplayProps {
  timeRemaining: number;
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ timeRemaining }) => {
  const challenge = useGameStore(state => state.gameState.challenge);
  
  return (
    <div className="text-center mb-6">
      <h1 className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-xl font-medium text-blue-800 font-display">
          {challenge?.category?.toUpperCase()}
      </h1>
    </div>
  );
};

export default CategoryDisplay; 