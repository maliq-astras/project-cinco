import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface UseFinalFiveModalActionsProps {
  isGameOver: boolean;
  loading: boolean;
  challenge: { challengeId: string } | null;
  selectedOption: string | null;
  language: string;
  selectFinalFiveOption: (option: string) => Promise<void>;
  setLoadingStage: (loadingStage: 'verifying' | 'determining' | 'slow' | null) => void;
  setSelectedOption: (selectedOption: string | null) => void;
  setLoading: (loading: boolean) => void;
  setVerifyRetryCount: (verifyRetryCount: number) => void;
  setCorrectAnswer: (correctAnswer: string | null) => void;
}

/**
 * Hook for handling FinalFiveModal actions
 * @param props Dependencies and state setters
 * @returns Action handlers
 */
export function useFinalFiveModalActions({
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
}: UseFinalFiveModalActionsProps) {

  const maxRetries = 3;

  const handleOptionClick = useCallback(async (option: string) => {
    if (isGameOver || loading || !challenge || selectedOption) return;

    setLoadingStage(null);
    setSelectedOption(option);
    setLoading(true);
    setVerifyRetryCount(0);

    const attemptVerification = async (currentRetry = 0): Promise<void> => {
      try {
        await selectFinalFiveOption(option);

        const isCorrect = useGameStore.getState().gameState.guesses.some(
          g => g.isCorrect && g.guess.toLowerCase() === option.toLowerCase()
        );

        if (isCorrect) {
          setCorrectAnswer(option);
        } else {
          const fetchCorrectAnswer = async (retryAttempt = 0): Promise<void> => {
            try {
              const response = await fetch('/api/final-five-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  challengeId: challenge.challengeId,
                  language
                }),
                signal: AbortSignal.timeout(15000)
              });

              if (response.ok) {
                const data = await response.json();
                if (data.answer) {
                  setCorrectAnswer(data.answer);
                }
              } else {
                throw new Error(`Server responded with ${response.status}`);
              }
            } catch (fetchError) {
              console.error(`Error fetching correct answer (attempt ${retryAttempt + 1}):`, fetchError);
              
              if (retryAttempt < maxRetries - 1) {
                const backoffDelay = Math.min(1000 * Math.pow(2, retryAttempt), 5000);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
                return fetchCorrectAnswer(retryAttempt + 1);
              }
              setCorrectAnswer("Answer not available");
            }
          };
          await fetchCorrectAnswer();
        }
        setVerifyRetryCount(0);
      } catch (error) {
        console.error(`Error selecting option (attempt ${currentRetry + 1}):`, error);

        if (currentRetry < maxRetries - 1) {
          setVerifyRetryCount(currentRetry + 1);
          const backoffDelay = Math.min(1000 * Math.pow(2, currentRetry), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return attemptVerification(currentRetry + 1);
        } else {
          useGameStore.setState({ finalFiveError: "Failed to verify your answer. Please try again." });
        }
      } finally {
        setLoading(false);
      }
    };

    attemptVerification().catch(() => {
      setLoading(false);
    });
  }, [isGameOver, loading, challenge, selectFinalFiveOption, language, selectedOption, maxRetries, setLoadingStage, setSelectedOption, setLoading, setVerifyRetryCount, setCorrectAnswer]);

  return {
    handleOptionClick
  };
}