import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFinalFiveOptions, useVerifyGuess } from '../../../hooks/api';
import { UserGuess } from '../../../types';

// Use the GameOutcome type from the store
type GameOutcome = 'standard-win' | 'final-five-win' | 'loss';

/**
 * Hook for managing Final Five modal logic
 */
export function useFinalFiveModal() {
  // Access state and actions from the store
  const {
    gameState: { finalFiveOptions, isGameOver, guesses, challenge },
    finalFiveTimeRemaining,
    isFinalFiveActive,
    gameOutcome,
    decrementFinalFiveTimer,
    selectFinalFiveOption,
    closeFinalFive,
    hardMode,
    isFetchingFinalFiveOptions
  } = useGameStore();
  
  const { colors, darkMode } = useTheme();
  const { t } = useTranslation();
  
  // Local state
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timerReachedZero, setTimerReachedZero] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Setup React Query mutation for verifying guesses
  const verifyGuessMutation = useVerifyGuess();
  
  // Get current language from localStorage
  const language = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';
  
  // Use React Query to fetch Final Five options if needed
  const { data: fetchedOptions, isLoading: optionsLoading } = useFinalFiveOptions({
    challengeId: challenge?.challengeId || '',
    previousGuesses: guesses
      .filter((g: UserGuess) => !g.isCorrect && g.guess !== "___SKIPPED___")
      .map((g: UserGuess) => g.guess),
    language,
    // Only enable if we need options and no existing fetch is in progress
    enabled: isFinalFiveActive && !finalFiveOptions && !!challenge && !isFetchingFinalFiveOptions
  });
  
  // If we fetch options via React Query, update the store
  useEffect(() => {
    if (fetchedOptions && !finalFiveOptions && challenge && !isFetchingFinalFiveOptions) {
      // Update the store with the fetched options
      useGameStore.setState(state => ({
        gameState: {
          ...state.gameState,
          finalFiveOptions: fetchedOptions
        }
      }));
    }
  }, [fetchedOptions, finalFiveOptions, challenge, isFetchingFinalFiveOptions]);
  
  // Get up to 5 options only
  const options = finalFiveOptions?.slice(0, 5) || [];
  
  // Theme color for borders
  const themeColor = `var(--color-${colors.primary})`;
  
  // Sequentially flip cards animation
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
        
        // Flip the next card
        flipCardSequentially(index + 1);
      }, 500); // Slower flip animation (was 300ms)
    };
    
    // Start the flip sequence
    if (isFinalFiveActive && !allCardsFlipped && options.length === 5) {
      flipCardSequentially(0);
    }
  }, [isFinalFiveActive, allCardsFlipped, options.length]);
  
  // Fetch the correct answer when the game is over
  useEffect(() => {
    let isMounted = true;
    
    const fetchCorrectAnswer = async () => {
      if (isGameOver && finalFiveOptions && finalFiveOptions.length > 0 && !correctAnswer && challenge) {
        if (loading) return; // Don't start if already loading
        
        setLoading(true);
        
        // First check if we already have a correct guess
        const foundCorrect = guesses.find(g => g.isCorrect);
        if (foundCorrect) {
          if (isMounted) {
            setCorrectAnswer(foundCorrect.guess);
            setLoading(false);
          }
          return;
        }
        
        // Use the dedicated endpoint to fetch the correct answer
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
  
  // Start animation sequence after finding correct answer
  useEffect(() => {
    if (isGameOver && correctAnswer) {
      // First delay to allow the correct answer styling to be visible
      const timer = setTimeout(() => {
        // Fade out non-relevant cards
        setAnimationComplete(true);
        
        // Only after everything has faded, show the continue button
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameOver, correctAnswer]);
  
  // Use timer to track game state
  useEffect(() => {
    console.log("Timer effect triggered. startTimer:", startTimer, "isGameOver:", isGameOver, "allCardsFlipped:", allCardsFlipped, "timeRemaining:", finalFiveTimeRemaining);
    
    if (startTimer && !isGameOver && allCardsFlipped) {
      console.log("Starting Final Five timer interval");
      const interval = setInterval(() => {
        console.log("Timer tick, current time:", finalFiveTimeRemaining);
        
        if (finalFiveTimeRemaining <= 1) {
          console.log("FINAL FIVE: Time reached zero, ending game");
          clearInterval(interval);
          setTimerReachedZero(true);
          
          // First update the game state to time's up, but don't set isGameOver yet
          // This will show the loading state while we fetch the correct answer
          useGameStore.setState(state => ({
            ...state,
            finalFiveTimeRemaining: 0
          }));
          
          // Set loading state to show spinner
          setLoading(true);
          
          // Fetch the correct answer - MUST complete before continuing
          const fetchCorrectAnswer = async () => {
            try {
              console.log("Fetching correct answer after time expired");
              
              // Try up to 3 times (with increasing delays) to fetch the answer
              for (let attempt = 0; attempt < 3; attempt++) {
                try {
                  // Add a small delay between retries
                  if (attempt > 0) {
                    console.log(`Retry attempt ${attempt + 1} for correct answer`);
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
                      console.log("Got correct answer:", data.answer);
                      setCorrectAnswer(data.answer);
                      
                      // NOW we can set the game to over and show continue button
                      useGameStore.setState(state => ({
                        ...state,
                        gameState: {
                          ...state.gameState,
                          isGameOver: true
                        },
                        gameOutcome: 'loss'
                      }));
                      
                      // Complete the animation sequence and show the continue button
                      setAnimationComplete(true);
                      setShowContinueButton(true);
                      setLoading(false);
                      return; // Exit once we have the answer
                    }
                  }
                } catch (retryError) {
                  console.error(`Attempt ${attempt + 1} failed:`, retryError);
                  // We'll retry unless we're on the last attempt
                  if (attempt === 2) {
                    throw retryError; // Re-throw on final attempt
                  }
                }
              }
              
              // If we get here, all retries failed
              throw new Error("All retry attempts failed");
              
            } catch (error) {
              console.error('Error fetching correct answer on time out:', error);
              
              // FALLBACK: If we absolutely cannot get the answer after all retries,
              // we have to set a fallback value and let the user continue
              setCorrectAnswer("Unknown");
              
              // Set game over state
              useGameStore.setState(state => ({
                ...state,
                gameState: {
                  ...state.gameState,
                  isGameOver: true
                },
                gameOutcome: 'loss'
              }));
              
              // Complete the sequence
              setAnimationComplete(true);
              setShowContinueButton(true);
              setLoading(false);
            }
          };
          
          // Start the fetch process
          fetchCorrectAnswer();
          
        } else {
          // Only decrement if we haven't reached zero
          decrementFinalFiveTimer();
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTimer, isGameOver, allCardsFlipped, finalFiveTimeRemaining, decrementFinalFiveTimer, correctAnswer, challenge, language]);
  
  // Show continue button after animations
  useEffect(() => {
    if (animationComplete && isGameOver) {
      // Delay showing the continue button until after fade animations
      const timer = setTimeout(() => {
        setShowContinueButton(true);
        // Ensure loading state is cleared in case it got stuck
        setLoading(false);
      }, 600); // Wait for fade animations to complete
      
      return () => clearTimeout(timer);
    }
  }, [animationComplete, isGameOver]);
  
  // Helper to check if an option is correct
  const isCorrectOption = useCallback((option: string): boolean => {
    if (!isGameOver) return false;
    // Only highlight the correct option if this was the user's selection
    return option === correctAnswer && option === selectedOption;
  }, [isGameOver, correctAnswer, selectedOption]);
  
  // Helper to check if user guessed an option incorrectly
  const isIncorrectGuess = useCallback((option: string): boolean => {
    // Only mark as incorrect if this was the selected option and it's wrong
    return selectedOption === option && isGameOver && selectedOption !== correctAnswer;
  }, [guesses, selectedOption, isGameOver, correctAnswer]);
  
  // Helper to get the message to display
  const getMessage = useCallback(() => {
    if (!allCardsFlipped) {
      return t('game.finalFive.revealingCards');
    }
    
    if (loading || isFetchingFinalFiveOptions || optionsLoading) {
      return t('game.finalFive.checkingAnswer');
    }
    
    if (!isGameOver) {
      return hardMode 
        ? t('game.finalFive.selectAnswerHard')
        : t('game.finalFive.selectAnswer');
    }
    
    const hasWon = gameOutcome === 'final-five-win';
    
    if (hasWon) {
      return t('game.finalFive.correctAnswer');
    } else if (correctAnswer) {
      // Check if time ran out (no selected option but game is over)
      if (!selectedOption && timerReachedZero) {
        return `${t('game.finalFive.theCorrectAnswerWas')} ${correctAnswer}`;
      }
      // Return the regular correct answer message
      return `${t('game.finalFive.theCorrectAnswerWas')} ${correctAnswer}`;
    } else if (timerReachedZero) {
      // Time ran out but we don't have the answer yet - show loading message
      return t('game.finalFive.loadingAnswer');
    } else {
      return t('game.finalFive.incorrectAnswer');
    }
  }, [allCardsFlipped, loading, isGameOver, hardMode, gameOutcome, t, isFetchingFinalFiveOptions, optionsLoading, correctAnswer, selectedOption, timerReachedZero]);
  
  // Handle clicking an option - avoid double calls
  const handleOptionClick = useCallback(async (option: string) => {
    if (isGameOver || loading || !challenge || selectedOption) return;
    
    // Immediately set the selected option to trigger UI updates
    setSelectedOption(option);
    setLoading(true);
    
    try {
      // This function also updates global game state
      await selectFinalFiveOption(option);
      
      // The selectFinalFiveOption already verifies the guess, so we don't need to do it again
      // Just check if this option is now marked as correct in the guesses
      const isCorrect = useGameStore.getState().gameState.guesses.some(
        g => g.isCorrect && g.guess.toLowerCase() === option.toLowerCase()
      );
      
      if (isCorrect) {
        setCorrectAnswer(option);
      } else {
        // If incorrect, we need to fetch the correct answer
        // This could be moved to an effect that runs when isGameOver changes
        // but for now we'll keep it here for simplicity
        try {
          const response = await fetch('/api/final-five-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              challengeId: challenge.challengeId,
              language
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.answer) {
              setCorrectAnswer(data.answer);
            }
          }
        } catch (error) {
          console.error('Error fetching correct answer:', error);
        }
      }
    } catch (error) {
      console.error('Error selecting option:', error);
    } finally {
      setLoading(false);
    }
  }, [isGameOver, loading, challenge, selectFinalFiveOption, language, selectedOption]);
  
  return {
    // State
    options,
    flippedCards,
    allCardsFlipped,
    showContinueButton,
    isFinalFiveActive,
    isGameOver,
    finalFiveTimeRemaining,
    gameOutcome,
    animationComplete,
    loading: loading || isFetchingFinalFiveOptions || optionsLoading,
    selectedOption,
    timerReachedZero,
    correctAnswer,
    
    // Styles and helpers
    themeColor,
    getMessage,
    getCardStyles: useCallback((option: string) => {
      // Front of card (with number 5)
      const frontBg = `var(--color-${colors.primary})`;
      
      // Back of card background based on game state - using rgba with the color's RGB values
      let backBg = `rgba(var(--color-${colors.primary}-rgb), 0.15)`; // 15% opacity
      if (isGameOver && isCorrectOption(option)) backBg = frontBg; // Full color for correct answer
      
      // Text color based on game state and dark mode
      let textColor = darkMode ? "white" : "black";
      if (isGameOver && isCorrectOption(option)) textColor = "white";
      
      return {
        frontBg,
        backBg,
        textColor
      };
    }, [colors.primary, darkMode, isGameOver, isCorrectOption]),
    isCorrectOption,
    isIncorrectGuess,
    
    // Actions
    handleOptionClick,
    closeFinalFive
  };
} 