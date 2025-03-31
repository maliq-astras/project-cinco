import React, { FormEvent, useRef, useImperativeHandle, forwardRef } from 'react';
import { UserGuess } from '../types';
import GuessProgressBar from './GuessProgressBar';
import { animateFactBubbles, showToastMessage } from '../helpers/uiHelpers';
import { MAX_WRONG_GUESSES, isDuplicateGuess } from '../helpers/gameLogic';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import Timer from './Timer';
import { motion } from 'framer-motion';

// Export the handle type for typescript
export interface GameControlsHandle {
  focusInput: () => void;
}

const GameControls = forwardRef<GameControlsHandle, {}>((props, ref) => {
  const guesses = useGameStore(state => state.gameState.guesses);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const isTimerActive = useGameStore(state => state.isTimerActive);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const submitGuess = useGameStore(state => state.submitGuess);
  const { colors } = useTheme();
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  
  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Expose the focusInput method to parent components
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current && !isInputDisabled()) {
        inputRef.current.focus();
      }
    }
  }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = e.currentTarget.elements[0] as HTMLInputElement;
    const guess = inputEl.value.trim();
    
    if (!guess) return;
    if (!hasSeenClue) return; // Can't guess without seeing a clue
    if (!canMakeGuess) return; // Can't guess without revealing a new fact first
    
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

  // Generate a descriptive message based on the game state
  const getInputPlaceholder = () => {
    if (!hasSeenClue) {
      return "Reveal a fact to start guessing...";
    }
    if (!canMakeGuess) {
      return "Reveal a new fact to make another guess...";
    }
    if (!canRevealNewClue) {
      return "Enter your guess...";
    }
    return "Enter your guess...";
  };

  // Determine if input should be disabled
  const isInputDisabled = () => {
    return !hasSeenClue || !canMakeGuess;
  };

  return (
    <div 
      id="game-controls"
      className="w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: isVictoryAnimationActive ? 0 : 1 
        }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="relative">
          {/* Toast messages container */}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {/* Duplicate guess toast */}
            <div 
              id="duplicate-error" 
              className="hidden bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-slideInRight font-mono"
            >
              You've already tried that guess. Try something else!
            </div>

            {/* Wrong guess toast */}
            <div 
              id="wrong-guess-toast" 
              className="hidden bg-red-100 text-red-800 py-2 px-4 rounded-md text-sm font-medium border border-red-200 shadow-md animate-slideInRight font-mono"
            >
              Wrong answer! Try again.
            </div>
          </div>
          
          <div className="w-full border-t border-gray-200 px-2 pt-3 pb-2 sm:px-0 sm:py-3 sm:border-0 sm:flex sm:flex-col sm:items-center z-10">
            <div id="facts-area" className="flex w-full max-w-md gap-2 mx-auto">
              <Timer seconds={timeRemaining} />

              <div className="flex-1 flex flex-col justify-between">
                <div className="relative">
                  <form onSubmit={handleSubmit}>
                    <input
                      id="game-input"
                      ref={inputRef}
                      placeholder={getInputPlaceholder()}
                      className={`w-full p-2 sm:p-3 border border-gray-200 rounded-full ${isInputDisabled() ? 'bg-gray-100' : 'bg-white'} text-gray-900 font-display outline-none theme-focus-ring transition-all duration-300 ${isInputDisabled() ? 'opacity-70' : 'opacity-100'}`}
                      style={{
                        "--theme-color": `var(--color-${colors.primary})`
                      } as React.CSSProperties}
                      disabled={isInputDisabled()}
                      autoComplete="off"
                    />
                  </form>
                </div>
                
                <div className="mt-1">
                  <div id="game-progress">
                    <GuessProgressBar />
                  </div>
                </div>
              </div>

              <div id="game-controls-right" className="flex flex-col justify-between h-[66px] sm:h-[76px] min-w-[70px] sm:min-w-[80px]">
                <button 
                  className="flex items-center justify-center h-[32px] sm:h-[36px] hover:bg-gray-50 transition-colors"
                  style={{ color: `var(--color-${colors.primary})` }}
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="h-[2px]" style={{ backgroundColor: `var(--color-${colors.primary}40)` }} />
                <button 
                  className="flex items-center justify-center h-[32px] sm:h-[36px] hover:bg-gray-50 transition-colors"
                  style={{ color: `var(--color-${colors.primary})` }}
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default GameControls; 