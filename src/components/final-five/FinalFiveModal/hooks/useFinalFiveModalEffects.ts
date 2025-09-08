import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { UserGuess } from '@/types';

interface UseFinalFiveModalEffectsProps {
  isFinalFiveActive: boolean;
  allCardsFlipped: boolean;
  options: string[];
  isGameOver: boolean;
  finalFiveOptions: string[] | null;
  correctAnswer: string | null;
  challenge: { challengeId: string } | null;
  guesses: UserGuess[];
  language: string;
  loading: boolean;
  isFinalFiveCompleted: boolean;
  animationComplete: boolean;
  startTimer: boolean;
  finalFiveTimeRemaining: number;
  decrementFinalFiveTimer: () => void;
  setFlippedCards: (flippedCards: boolean[]) => void;
  setAllCardsFlipped: (allCardsFlipped: boolean) => void;
  setStartTimer: (startTimer: boolean) => void;
  setCorrectAnswer: (correctAnswer: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAnimationComplete: (animationComplete: boolean) => void;
  setShowContinueButton: (showContinueButton: boolean) => void;
  setTimerReachedZero: (timerReachedZero: boolean) => void;
  setVerifyRetryCount: (verifyRetryCount: number) => void;
  setLoadingStage: (loadingStage: 'verifying' | 'determining' | 'slow' | null) => void;
}

/**
 * Hook for managing FinalFiveModal side effects
 * @param props Dependencies and state setters
 */
export function useFinalFiveModalEffects({
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
}: UseFinalFiveModalEffectsProps) {

  // Card flipping animation sequence
  useEffect(() => {
    const flipCardSequentially = (index: number) => {
      if (index >= 5) {
        // All cards have been flipped
        setAllCardsFlipped(true);
        // Start the timer after all cards have flipped
        setTimeout(() => {
          setStartTimer(true);
        }, 500);
        return;
      }

      setTimeout(() => {
        setFlippedCards(prev => {
          const newFlipped = [...prev];
          newFlipped[index] = true;
          return newFlipped;
        });

        flipCardSequentially(index + 1);
      }, 500);
    };

    if (isFinalFiveActive && !allCardsFlipped && options.length === 5) {
      flipCardSequentially(0);
    }
  }, [isFinalFiveActive, allCardsFlipped, options.length, setFlippedCards, setAllCardsFlipped, setStartTimer]);

  // Fetch correct answer when game over
  useEffect(() => {
    let isMounted = true;

    const fetchCorrectAnswer = async () => {
      if (isGameOver && finalFiveOptions && finalFiveOptions.length > 0 && !correctAnswer && challenge) {
        if (loading) return;

        setLoading(true);

        const foundCorrect = guesses.find(g => g.isCorrect);
        if (foundCorrect) {
          if (isMounted) {
            setCorrectAnswer(foundCorrect.guess);
            setLoading(false);
          }
          return;
        }

        try {
          const response = await fetch('/api/final-five-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              challengeId: challenge.challengeId,
              language
            })
          });

          if (!response.ok) {
            throw new Error(`Error fetching answer: ${response.status}`);
          }

          const data = await response.json();

          if (isMounted && data.answer) {
            setCorrectAnswer(data.answer);
          }
        } catch (error) {
          console.error('Error fetching correct answer:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchCorrectAnswer();

    return () => {
      isMounted = false;
    };
  }, [isGameOver, finalFiveOptions, correctAnswer, challenge, guesses, language, loading, setLoading, setCorrectAnswer]);

  // Animation complete timing
  useEffect(() => {
    if (isFinalFiveCompleted && correctAnswer) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isFinalFiveCompleted, correctAnswer, setAnimationComplete]);

  // Timer countdown logic
  useEffect(() => {
    if (startTimer && !isFinalFiveCompleted && allCardsFlipped) {
      const interval = setInterval(() => {
        if (finalFiveTimeRemaining <= 1) {
          clearInterval(interval);
          setTimerReachedZero(true);

          useGameStore.setState(state => ({
            ...state,
            finalFiveTimeRemaining: 0
          }));

          setLoading(true);

          const fetchCorrectAnswer = async () => {
            try {
              for (let attempt = 0; attempt < 3; attempt++) {
                try {
                  if (attempt > 0) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                  }

                  const response = await fetch('/api/final-five-answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      challengeId: challenge?.challengeId,
                      language
                    })
                  });

                  if (response.ok) {
                    const data = await response.json();
                    if (data.answer) {
                      setCorrectAnswer(data.answer);

                      useGameStore.getState().trackFailedAttempt();

                      const currentState = useGameStore.getState();
                      const numberOfTries = currentState.gameState.guesses.length;
                      const initialTime = currentState.hardMode ? 55 : 300;
                      const timeSpent = initialTime - currentState.timeRemaining;
                      useGameStore.getState().saveTodayGameData('loss-final-five-time', data.answer, numberOfTries, timeSpent, currentState.gameState.challenge);

                      useGameStore.setState(state => ({
                        ...state,
                        gameState: {
                          ...state.gameState,
                          isGameOver: true
                        },
                        isFinalFiveCompleted: true,
                        gameOutcome: 'loss-final-five-time'
                      }));

                      setAnimationComplete(true);
                      setShowContinueButton(true);
                      setLoading(false);
                      return;
                    }
                  }
                } catch (retryError) {
                  console.error(`Attempt ${attempt + 1} failed:`, retryError);
                  if (attempt === 2) {
                    throw retryError;
                  }
                }
              }

              throw new Error("All retry attempts failed");

            } catch (error) {
              console.error('Error fetching correct answer on time out:', error);

              setLoading(true);
              setVerifyRetryCount(prev => prev + 1);

            }
          };

          fetchCorrectAnswer();

        } else {
          decrementFinalFiveTimer();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTimer, isFinalFiveCompleted, allCardsFlipped, finalFiveTimeRemaining, decrementFinalFiveTimer, correctAnswer, challenge, language, setTimerReachedZero, setLoading, setCorrectAnswer, setAnimationComplete, setShowContinueButton, setVerifyRetryCount]);

  // Show continue button after animation
  useEffect(() => {
    if (animationComplete && isFinalFiveCompleted) {
      const timer = setTimeout(() => {
        setShowContinueButton(true);
        setLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [animationComplete, isFinalFiveCompleted, setShowContinueButton, setLoading]);

  // Loading stage management
  useEffect(() => {
    let determiningTimer: NodeJS.Timeout;
    let slowConnectionTimer: NodeJS.Timeout;

    if (loading) {
      setLoadingStage('verifying');

      determiningTimer = setTimeout(() => {
        if (loading) {
          setLoadingStage('determining');
        }
      }, 2500);

      slowConnectionTimer = setTimeout(() => {
        if (loading) {
          setLoadingStage('slow');
        }
      }, 6000);
    } else {
      setLoadingStage(null);
    }

    return () => {
      clearTimeout(determiningTimer);
      clearTimeout(slowConnectionTimer);
    };
  }, [loading, setLoadingStage]);
}