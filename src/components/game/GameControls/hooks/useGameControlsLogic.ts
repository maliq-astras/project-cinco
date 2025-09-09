import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/responsive';
import { showToastMessageFromElement } from '@/helpers/uiHelpers';
import { isDuplicateGuess } from '@/helpers/gameLogic';

interface UseGameControlsLogicProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isSkipConfirmActive: boolean;
  setIsSkipConfirmActive: React.Dispatch<React.SetStateAction<boolean>>;
  duplicateErrorRef: React.RefObject<HTMLDivElement | null>;
  skipMessageRef: React.RefObject<HTMLDivElement | null>;
}

export const useGameControlsLogic = ({
  inputValue,
  setInputValue,
  isSkipConfirmActive,
  setIsSkipConfirmActive,
  duplicateErrorRef,
  skipMessageRef
}: UseGameControlsLogicProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { responsiveValues, breakpoint, isLandscape, isPortrait } = useResponsive();
  
  // Game store selectors
  const guesses = useGameStore(state => state.gameState.guesses);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const canMakeGuess = useGameStore(state => state.canMakeGuess);
  const submitGuess = useGameStore(state => state.submitGuess);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const isProcessingGuess = useGameStore(state => state.isProcessingGuess);
  const setHasUserInput = useGameStore(state => state.setHasUserInput);

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
    // Store values
    timeRemaining,
    isVictoryAnimationActive,
    colors,
    responsiveValues,
    breakpoint,
    isLandscape,
    isPortrait,
    
    // Handlers
    handleSubmit,
    handleSkip,
    getInputPlaceholder,
    isInputDisabled,
    isSkipDisabled
  };
};