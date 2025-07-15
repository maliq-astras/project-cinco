import { FormEvent, useRef, useImperativeHandle, Ref, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { useTheme } from '../../contexts/ThemeContext';
import { showToastMessage } from '../../helpers/uiHelpers';
import { isDuplicateGuess } from '../../helpers/gameLogic';

export interface GameControlsHandle {
  focusInput: () => void;
}

export const useGameControls = (ref: Ref<GameControlsHandle>) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isSkipConfirmActive, setIsSkipConfirmActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
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

  // Reset skip confirmation after a delay
  useEffect(() => {
    if (isSkipConfirmActive) {
      const timer = setTimeout(() => {
        setIsSkipConfirmActive(false);
      }, 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isSkipConfirmActive]);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const guess = inputValue.trim();
    
    if (!guess) return;
    if (!hasSeenClue) return;
    if (!canMakeGuess) return;
    if (isProcessingGuess) return;
    
    if (isDuplicateGuess(guesses, guess)) {
      showToastMessage('duplicate-error');
      return;
    }
    
    // Set processing state immediately
    useGameStore.setState({ isProcessingGuess: true, hasMadeGuess: true });
    setInputValue('');
    submitGuess(guess);
  };

  // Handle skip button click - now with confirmation
  const handleSkip = () => {
    if (!hasSeenClue || !canMakeGuess || isProcessingGuess) return;
    
    if (!isSkipConfirmActive) {
      setIsSkipConfirmActive(true);
      return;
    }

    // Second click - actually skip
    setIsSkipConfirmActive(false);
    submitGuess("___SKIPPED___");
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
    isSkipDisabled,
    inputValue,
    setInputValue,
    isSkipConfirmActive,
    isTouchDevice
  };
}; 