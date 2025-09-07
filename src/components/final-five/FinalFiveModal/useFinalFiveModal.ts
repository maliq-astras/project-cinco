import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFinalFiveOptions } from '@/hooks/api';
import { UserGuess } from '@/types';
import { useResponsive } from '@/hooks/responsive';

export function useFinalFiveModal() {
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

  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [verifyRetryCount, setVerifyRetryCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timerReachedZero, setTimerReachedZero] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
  }, [isFinalFiveActive, allCardsFlipped, options.length]);

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
  }, [isGameOver, finalFiveOptions, correctAnswer, challenge, guesses, language, loading]);

  useEffect(() => {
    if (isFinalFiveCompleted && correctAnswer) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);

      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isFinalFiveCompleted, correctAnswer]);

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
              setIsSlowConnection(true);
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
  }, [startTimer, isFinalFiveCompleted, allCardsFlipped, finalFiveTimeRemaining, decrementFinalFiveTimer, correctAnswer, challenge, language]);

  useEffect(() => {
    if (animationComplete && isFinalFiveCompleted) {
      const timer = setTimeout(() => {
        setShowContinueButton(true);
        setLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [animationComplete, isFinalFiveCompleted]);

  useEffect(() => {
    let slowConnectionTimer: NodeJS.Timeout;

    if (loading) {
      slowConnectionTimer = setTimeout(() => {
        setIsSlowConnection(true);
      }, 5000);
    } else {
      setIsSlowConnection(false);
    }

    return () => {
      if (slowConnectionTimer) clearTimeout(slowConnectionTimer);
    };
  }, [loading]);


  const [loadingStage, setLoadingStage] = useState<'verifying' | 'determining' | 'slow' | null>(null);

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
  }, [loading]);

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
  }, [isGameOver, loading, challenge, selectFinalFiveOption, language, selectedOption, maxRetries]);

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
    getCardStyles: useCallback((option: string) => {

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
    }, [colors.primary, darkMode, isFinalFiveCompleted, isCorrectOption]),
    isCorrectOption,
    isIncorrectGuess,
    handleOptionClick,
    closeFinalFive
  };
} 