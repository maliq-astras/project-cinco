import { useState } from 'react';

/**
 * Hook for managing FinalFiveModal component state
 * @returns State values and setters
 */
export function useFinalFiveModalState() {
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyRetryCount, setVerifyRetryCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timerReachedZero, setTimerReachedZero] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<'verifying' | 'determining' | 'slow' | null>(null);

  return {
    correctAnswer,
    setCorrectAnswer,
    loading,
    setLoading,
    verifyRetryCount,
    setVerifyRetryCount,
    animationComplete,
    setAnimationComplete,
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
  };
}