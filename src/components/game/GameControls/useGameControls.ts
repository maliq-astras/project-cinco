import { FormEvent, useRef, useImperativeHandle, Ref, useState, useEffect, RefObject } from 'react';
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

interface UseGameControlsReturn {
  inputBarRef: RefObject<InputBarHandle | null>;
  timeRemaining: number;
  isVictoryAnimationActive: boolean;
  colors: { primary: string };
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleSkip: () => void;
  getInputPlaceholder: () => string;
  isInputDisabled: () => boolean;
  isSkipDisabled: () => boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  isSkipConfirmActive: boolean;
  isTouchDevice: boolean;
  duplicateErrorRef: RefObject<HTMLDivElement | null>;
  skipMessageRef: RefObject<HTMLDivElement | null>;
  responsiveValues: any;
  breakpoint: string;
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useGameControls = (ref: Ref<GameControlsHandle>): UseGameControlsReturn => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isSkipConfirmActive, setIsSkipConfirmActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const guesses = useGameStore(state => state.gameState.guesses);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const submitGuess = useGameStore(state => state.submitGuess);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const isProcessingGuess = useGameStore(state => state.isProcessingGuess);
  const setHasUserInput = useGameStore(state => state.setHasUserInput);
  const { colors } = useTheme();
  
  const { 
    responsiveValues,
    breakpoint,
    isLandscape,
    isPortrait
  } = useResponsive();
  const duplicateErrorRef = useRef<HTMLDivElement>(null);
  const skipMessageRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<InputBarHandle>(null);
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputBarRef.current && !isInputDisabled()) {
        inputBarRef.current.focusInput();
      }
    }
  }));

  useEffect(() => {
    if (isSkipConfirmActive) {
      const timer = setTimeout(() => {
        setIsSkipConfirmActive(false);
      }, 2000);
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
    
    useGameStore.setState({ isProcessingGuess: true, hasMadeGuess: true });
    setInputValue('');
    setHasUserInput(false); 
    submitGuess(guess);
  };

  const handleSkip = () => {
    if (!hasSeenClue || !canMakeGuess || isProcessingGuess) return;
    
    if (!isSkipConfirmActive) {
      setIsSkipConfirmActive(true);
      return;
    }

    setIsSkipConfirmActive(false);
    submitGuess("___SKIPPED___");
    showToastMessageFromElement(skipMessageRef.current);
  };

  const getInputPlaceholder = () => {
    if (!hasSeenClue) {
      return t('game.input.disabled');
    }
    
    return t('game.input.placeholder');
  };

  const isInputDisabled = () => {
    return !hasSeenClue || !canMakeGuess || isProcessingGuess;
  };

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
    responsiveValues,
    breakpoint,
    isLandscape,
    isPortrait
  };
}; 