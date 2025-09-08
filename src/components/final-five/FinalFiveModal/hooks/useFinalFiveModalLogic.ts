import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFinalFiveOptions } from '@/hooks/api';
import { UserGuess } from '@/types';
import { useResponsive } from '@/hooks/responsive';
import { useFinalFiveModalState } from './useFinalFiveModalState';
import { useFinalFiveModalEffects } from './useFinalFiveModalEffects';
import { useFinalFiveModalActions } from './useFinalFiveModalActions';

export function useFinalFiveModal() {
  // External dependencies
  const {
    gameState: { finalFiveOptions, isGameOver, guesses, challenge },
    finalFiveTimeRemaining,
    isFinalFiveActive,
    isFinalFiveCompleted,
    gameOutcome,
    decrementFinalFiveTimer,
    selectFinalFiveOption,
    closeFinalFive,
    hardMode,
    isFetchingFinalFiveOptions
  } = useGameStore();

  const { colors, darkMode } = useTheme();
  const { t } = useTranslation();

  const {
    width,
    height,
    isLandscape,
  } = useResponsive();

  // Component state
  const {
    correctAnswer,
    setCorrectAnswer,
    loading,
    setLoading,
    verifyRetryCount,
    setVerifyRetryCount,
    animationComplete,
    setAnimationComplete,
    flippedCards,
    setFlippedCards,
    allCardsFlipped,
    setAllCardsFlipped,
    startTimer,
    setStartTimer,
    timerReachedZero,
    setTimerReachedZero,
    showContinueButton,
    setShowContinueButton,
    selectedOption,
    setSelectedOption,
    loadingStage,
    setLoadingStage
  } = useFinalFiveModalState();

  const maxRetries = 3;
  const language = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';

  const { isLoading: optionsLoading } = useFinalFiveOptions({
    challengeId: challenge?.challengeId || '',
    previousGuesses: guesses
      .filter((g: UserGuess) => !g.isCorrect && g.guess !== "___SKIPPED___")
      .map((g: UserGuess) => g.guess),
    language,
    enabled: isFinalFiveActive && !finalFiveOptions && !!challenge && !isFetchingFinalFiveOptions
  });

  const options = finalFiveOptions?.slice(0, 5) || [];
  const themeColor = `var(--color-${colors.primary})`;

  // Side effects
  useFinalFiveModalEffects({
    isFinalFiveActive,
    allCardsFlipped,
    options,
    isGameOver,
    finalFiveOptions,
    correctAnswer,
    challenge,
    guesses,
    language,
    loading,
    isFinalFiveCompleted,
    animationComplete,
    startTimer,
    finalFiveTimeRemaining,
    decrementFinalFiveTimer,
    setFlippedCards,
    setAllCardsFlipped,
    setStartTimer,
    setCorrectAnswer,
    setLoading,
    setAnimationComplete,
    setShowContinueButton,
    setTimerReachedZero,
    setVerifyRetryCount,
    setLoadingStage
  });

  // Actions
  const { handleOptionClick } = useFinalFiveModalActions({
    isGameOver,
    loading,
    challenge,
    selectedOption,
    language,
    selectFinalFiveOption,
    setLoadingStage,
    setSelectedOption,
    setLoading,
    setVerifyRetryCount,
    setCorrectAnswer
  });

  // Logic functions
  const isCorrectOption = useCallback((option: string): boolean => {
    if (!isFinalFiveCompleted) return false;
    return option === correctAnswer && option === selectedOption;
  }, [isFinalFiveCompleted, correctAnswer, selectedOption]);

  const isIncorrectGuess = useCallback((option: string): boolean => {
    return selectedOption === option && isFinalFiveCompleted && selectedOption !== correctAnswer;
  }, [selectedOption, isFinalFiveCompleted, correctAnswer]);

  const getMessage = useCallback(() => {
    if (!allCardsFlipped) {
      return t('game.finalFive.revealingCards');
    }

    if (loading || isFetchingFinalFiveOptions || optionsLoading) {
      if (selectedOption && !isGameOver) {
        if (verifyRetryCount > 0) {
          return `${t('game.finalFive.retrying')} (${verifyRetryCount}/${maxRetries})`;
        }

        switch (loadingStage) {
          case 'verifying':
            return t('game.finalFive.verifyingGuess');
          case 'determining':
            return t('game.finalFive.determiningAnswer');
          case 'slow':
            return t('game.finalFive.slowConnection');
          default:
            return t('game.finalFive.verifyingGuess');
        }
      } else {
        switch (loadingStage) {
          case 'determining':
            return t('game.finalFive.determiningAnswer');
          case 'slow':
            return t('game.finalFive.slowConnection');
          default:
            return t('game.finalFive.checkingAnswer');
        }
      }
    }

    if (!isFinalFiveCompleted) {
      if (selectedOption && correctAnswer) {
        if (selectedOption === correctAnswer) {
          return t('game.finalFive.correctAnswer');
        }
      }

      return hardMode
        ? t('game.finalFive.selectAnswerHard')
        : t('game.finalFive.selectAnswer');
    }

    const hasWon = gameOutcome === 'final-five-win';

    if (hasWon) {
      return t('game.finalFive.correctAnswer');
    } else if (correctAnswer) {
      if (!selectedOption && timerReachedZero) {
        return `${t('game.finalFive.theCorrectAnswerWas')} ${correctAnswer}`;
      }
      return `${t('game.finalFive.theCorrectAnswerWas')} ${correctAnswer}`;
    } else if (timerReachedZero) {
      return t('game.finalFive.loadingAnswer');
    } else {
      return t('game.finalFive.incorrectAnswer');
    }
  }, [allCardsFlipped, loading, isGameOver, hardMode, gameOutcome, t, isFetchingFinalFiveOptions, optionsLoading, correctAnswer, selectedOption, timerReachedZero, verifyRetryCount, maxRetries, loadingStage]);

  const getCardStyles = useCallback((option: string) => {
    const frontBg = `var(--color-${colors.primary})`;
    let backBg = `rgba(var(--color-${colors.primary}-rgb), 0.15)`; 

    if (isFinalFiveCompleted && isCorrectOption(option)) backBg = frontBg; 

    let textColor = darkMode ? "white" : "black";

    if (isFinalFiveCompleted && isCorrectOption(option)) textColor = "white";
    return {
      frontBg,
      backBg,
      textColor
    };
  }, [colors.primary, darkMode, isFinalFiveCompleted, isCorrectOption]);

  return {
    options,
    flippedCards,
    allCardsFlipped,
    showContinueButton,
    isFinalFiveActive,
    isGameOver,
    isFinalFiveCompleted,
    finalFiveTimeRemaining,
    gameOutcome,
    animationComplete,
    loading: loading || isFetchingFinalFiveOptions || optionsLoading,
    selectedOption,
    timerReachedZero,
    correctAnswer,
    width,
    height,
    isLandscape,
    themeColor,
    primaryColorClass: colors.primary,
    getMessage,
    getCardStyles,
    isCorrectOption,
    isIncorrectGuess,
    handleOptionClick,
    closeFinalFive
  };
}