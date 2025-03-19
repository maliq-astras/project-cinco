import React, { FormEvent } from 'react';
import { UserGuess } from '../types';
import GuessProgressBar from './GuessProgressBar';
import { animateFactBubbles, showToastMessage } from '../helpers/uiHelpers';
import { MAX_WRONG_GUESSES, isDuplicateGuess } from '../helpers/gameLogic';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

const GameControls: React.FC = () => {
  const guesses = useGameStore(state => state.gameState.guesses);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const submitGuess = useGameStore(state => state.submitGuess);
  const { colors } = useTheme();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = e.currentTarget.elements[0] as HTMLInputElement;
    const guess = inputEl.value.trim();
    
    if (!guess) return;
    
    // Check if this guess has been made before
    if (isDuplicateGuess(guesses, guess)) {
      // Show duplicate error message
      showToastMessage('duplicate-error');
      
      // Animate fact bubbles
      animateFactBubbles();
      
      return;
    }
    
    submitGuess(guess);
    inputEl.value = '';
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 border-t border-gray-200 p-3 sm:p-0 sm:static sm:border-0 sm:flex sm:flex-col sm:items-center z-10">
        <div className="flex w-full max-w-md gap-2 mx-auto">
          <div className="flex-1 flex flex-col">
            <div className="relative">
              {/* Toast container above input */}
              <div className="absolute -top-12 left-0 right-0 flex justify-center">
                {/* Duplicate guess toast */}
                <div id="duplicate-error" className="hidden bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-fadeIn">
                  You've already tried that guess. Try something else!
                </div>

                {/* Wrong guess toast */}
                <div id="wrong-guess-toast" className="hidden bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium border border-red-200 shadow-md animate-fadeIn">
                  Wrong answer! Try again.
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Enter your guess..."
                  className={`w-full p-3 border border-gray-200 rounded-full bg-white text-gray-900 font-display focus:ring-2 focus:ring-${colors.primary} focus:border-${colors.primary} outline-none`}
                />
              </form>
            </div>
            
            <div className="mt-2">
              <GuessProgressBar />
            </div>
          </div>
          
          <div className={`text-xl bg-${colors.light} rounded-lg text-black flex items-center justify-center h-[76px] px-4 min-w-[80px] font-iceberg`}>
            {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 