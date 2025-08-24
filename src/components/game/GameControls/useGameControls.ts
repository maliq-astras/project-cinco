import { FormEvent, useRef, useImperativeHandle, Ref, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { showToastMessageFromElement } from '@/helpers/uiHelpers';
import { isDuplicateGuess } from '@/helpers/gameLogic';
import { InputBarHandle } from '../InputBar';
import { useResponsive } from '@/hooks/responsive';

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
  const setHasUserInput = useGameStore(state => state.setHasUserInput);
  const { colors } = useTheme();
  
  // Use our new unified responsive system
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait
  } = useResponsive();
  
  // Create refs for toast elements
  const duplicateErrorRef = useRef<HTMLDivElement>(null);
  const skipMessageRef = useRef<HTMLDivElement>(null);
  
  // Create a ref for the InputBar component
  const inputBarRef = useRef<InputBarHandle>(null);
  
  // Expose the focusInput method to parent components
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputBarRef.current && !isInputDisabled()) {
        inputBarRef.current.focusInput();
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
      showToastMessageFromElement(duplicateErrorRef.current);
      return;
    }
    
    // Set processing state immediately
    useGameStore.setState({ isProcessingGuess: true, hasMadeGuess: true });
    setInputValue('');
    setHasUserInput(false); // Reset user input flag so context area becomes visible again
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
    showToastMessageFromElement(skipMessageRef.current);
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
    inputBarRef,
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
    isTouchDevice,
    duplicateErrorRef,
    skipMessageRef,
    
    // Responsive values from our new system
    responsiveValues,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait
  };
}; 