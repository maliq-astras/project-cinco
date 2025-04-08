import { FormEvent, useRef, useImperativeHandle, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { showToastMessage } from '../../../helpers/uiHelpers';
import { isDuplicateGuess } from '../../../helpers/gameLogic';

export interface GameControlsHandle {
  focusInput: () => void;
}

export const useGameControls = (ref: Ref<GameControlsHandle>) => {
  const { t } = useTranslation();
  const guesses = useGameStore(state => state.gameState.guesses);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const submitGuess = useGameStore(state => state.submitGuess);
  const hardMode = useGameStore(state => state.hardMode);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const isProcessingGuess = useGameStore(state => state.isProcessingGuess);
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
    if (isProcessingGuess) return; // Don't allow submitting while processing
    
    // Check if this guess has been made before
    if (isDuplicateGuess(guesses, guess)) {
      // Show duplicate error message
      showToastMessage('duplicate-error');
      return;
    }
    
    submitGuess(guess);
    inputEl.value = '';
  };

  // Handle skip button click - submit a skipped guess
  const handleSkip = () => {
    if (!hasSeenClue || !canMakeGuess || isProcessingGuess) return;
    
    // Submit a special "skipped" guess
    submitGuess("___SKIPPED___");
    
    // Show custom toast
    showToastMessage('skip-message');
  };

  // Generate a descriptive message based on the game state
  const getInputPlaceholder = () => {
    if (!hasSeenClue) {
      return t('game.input.disabled');
    }
    
    return t('game.input.placeholder');
  };

  // Determine if input should be disabled
  const isInputDisabled = () => {
    return !hasSeenClue || !canMakeGuess || isProcessingGuess;
  };

  // Determine if skip button should be disabled
  const isSkipDisabled = () => {
    return !hasSeenClue || !canMakeGuess || isProcessingGuess;
  };

  return {
    inputRef,
    timeRemaining,
    isVictoryAnimationActive,
    colors,
    handleSubmit,
    handleSkip,
    getInputPlaceholder,
    isInputDisabled,
    isSkipDisabled
  };
}; 