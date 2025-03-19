'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

export default function FinalFiveOptions() {
  const options = useGameStore(state => state.gameState.finalFiveOptions || []);
  const selectFinalFiveOption = useGameStore(state => state.selectFinalFiveOption);
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      {options.map((option, index) => (
        <button
          key={index}
          className={`p-4 border rounded-lg bg-white hover:bg-${colors.light} transition-colors text-left font-medium shadow-sm hover:shadow`}
          onClick={() => selectFinalFiveOption(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
} 