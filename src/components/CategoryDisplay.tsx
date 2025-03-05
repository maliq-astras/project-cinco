import React from 'react';
import { useGameStore } from '../store/gameStore';

interface CategoryDisplayProps {
  timeRemaining: number;
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ timeRemaining }) => {
  const challenge = useGameStore(state => state.gameState.challenge);
  
  return (
    <div className="text-center mb-6">
      <h3 className="inline-flex items-center justify-center gap-2 bg-blue-50 py-3 px-6 rounded-lg text-xl font-medium text-blue-800 font-display">
        CATEGORY: {challenge?.category?.toUpperCase()}
        <button className="text-blue-600 hover:text-blue-800 ml-1" aria-label="Information">ⓘ</button>
      </h3>
    </div>
  );
};

export default CategoryDisplay; 