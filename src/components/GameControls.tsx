import React, { FormEvent, useRef, useImperativeHandle, forwardRef } from 'react';
import { UserGuess } from '../types';
import GuessProgressBar from './GuessProgressBar';
import { animateFactBubbles, showToastMessage } from '../helpers/uiHelpers';
import { MAX_WRONG_GUESSES, isDuplicateGuess } from '../helpers/gameLogic';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import Timer from './Timer';

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
    <div className="py-0 sm:py-6 w-full">
      {/* Toast messages container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {/* Duplicate guess toast */}
        <div 
          id="duplicate-error" 
          className="hidden bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-slideInRight"
        >
          You've already tried that guess. Try something else!
        </div>

        {/* Wrong guess toast */}
        <div 
          id="wrong-guess-toast" 
          className="hidden bg-red-100 text-red-800 py-2 px-4 rounded-md text-sm font-medium border border-red-200 shadow-md animate-slideInRight"
        >
          Wrong answer! Try again.
        </div>
      </div>
      
      <div className="w-full border-t border-gray-200 pt-2 pb-0 sm:py-3 sm:border-0 sm:flex sm:flex-col sm:items-center z-10">
        <div className="flex w-full max-w-md gap-2 mx-auto">
          <div className="flex-1 flex flex-col">
            <div className="relative">
              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  placeholder={getInputPlaceholder()}
                  className={`w-full p-2 sm:p-3 border border-gray-200 rounded-full ${isInputDisabled() ? 'bg-gray-100' : 'bg-white'} text-gray-900 font-display outline-none theme-focus-ring transition-all duration-300 ${isInputDisabled() ? 'opacity-70' : 'opacity-100'}`}
                  style={{
                    "--theme-color": `var(--color-${colors.primary})`
                  } as React.CSSProperties}
                  disabled={isInputDisabled()}
                />
              </form>
            </div>
            
            <div className="mt-1 sm:mt-2">
              <GuessProgressBar />
            </div>
          </div>
          
          <Timer seconds={timeRemaining} />
        </div>
      </div>
    </div>
  );
});

export default GameControls; 