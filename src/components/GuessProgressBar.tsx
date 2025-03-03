'use client';

import React from 'react';
import { UserGuess } from '../types';

interface GuessProgressBarProps {
  guesses: UserGuess[];
  maxGuesses: number;
}

export default function GuessProgressBar({ guesses, maxGuesses }: GuessProgressBarProps) {
  // Filter to only wrong guesses
  const wrongGuesses = guesses.filter(guess => !guess.isCorrect);
  const wrongGuessCount = wrongGuesses.length;
  
  // Calculate progress percentage
  const progressPercentage = (wrongGuessCount / maxGuesses) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{wrongGuessCount} wrong {wrongGuessCount === 1 ? 'guess' : 'guesses'}</span>
        <span>{maxGuesses - wrongGuessCount} {maxGuesses - wrongGuessCount === 1 ? 'try' : 'tries'} remaining</span>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-1">
        {Array.from({ length: maxGuesses }).map((_, index) => (
          <div 
            key={index}
            className={`w-4 h-4 rounded-full flex items-center justify-center text-xs
              ${index < wrongGuessCount 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-400'}`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
} 