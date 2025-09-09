import { useWrongAnswerOverlayState } from './useWrongAnswerOverlayState';
import { useWrongAnswerOverlayEvents } from './useWrongAnswerOverlayEvents';
import { useWrongAnswerOverlayLogic } from './useWrongAnswerOverlayLogic';

interface UseWrongAnswerOverlayProps {
  maxGuesses: number;
}

export function useWrongAnswerOverlay({ maxGuesses }: UseWrongAnswerOverlayProps) {
  const {
    isVisible,
    setIsVisible,
    currentWrongGuessCount,
    setCurrentWrongGuessCount,
    modalAnimation,
    setModalAnimation,
    previousWrongGuessCount,
    guesses,
    totalWrongGuessCount,
    actualWrongGuessCount
  } = useWrongAnswerOverlayState({ maxGuesses });

  useWrongAnswerOverlayEvents({
    isVisible,
    actualWrongGuessCount,
    totalWrongGuessCount,
    maxGuesses,
    guesses,
    previousWrongGuessCount,
    setCurrentWrongGuessCount,
    setIsVisible,
    setModalAnimation
  });

  const {
    remainingGuesses,
    xMarkSlots,
    handleAnimationComplete,
    hideOverlay,
    modalStyle,
    getXMarkCircleStyleForIndex,
    glowingRingStyle,
    titleStyle,
    getProgressDotStyleForIndex,
    t
  } = useWrongAnswerOverlayLogic({
    wrongGuessCount: currentWrongGuessCount,
    maxGuesses,
    setIsVisible
  });

  return {
    isVisible,
    wrongGuessCount: currentWrongGuessCount,
    maxGuesses,
    modalAnimation,
    remainingGuesses,
    xMarkSlots,
    onAnimationComplete: handleAnimationComplete,
    hideOverlay,
    modalStyle,
    getXMarkCircleStyleForIndex,
    glowingRingStyle,
    titleStyle,
    getProgressDotStyleForIndex,
    t
  };
}