import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFinalFiveOptions, useVerifyGuess } from '../../../hooks/api';
import { UserGuess } from '../../../types';

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
  
  // Timer logic
  useEffect(() => {
    if (isFinalFiveActive && finalFiveTimeRemaining > 0 && !isGameOver && startTimer) {
      const timer = setInterval(() => {
        // Don't decrement if game is over (redundant check for safety)
        if (isGameOver) {
          clearInterval(timer);
          return;
        }
        
        decrementFinalFiveTimer();
        
        // Access the latest state directly from the store instead of using the stale closure value
        const currentTimeRemaining = useGameStore.getState().finalFiveTimeRemaining;
        if (currentTimeRemaining <= 1) {
          clearInterval(timer);
          setTimerReachedZero(true);
          // End game due to time out
          setTimeout(() => {
            useGameStore.setState(state => ({
              gameState: {
                ...state.gameState,
                isGameOver: true
              },
              finalFiveTimeRemaining: 0,
              gameOutcome: 'loss'
            }));
          }, 1000);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isFinalFiveActive, finalFiveTimeRemaining, isGameOver, decrementFinalFiveTimer, startTimer, hardMode]);
  
  // Show continue button after animations
  useEffect(() => {
    if (animationComplete && isGameOver) {
      // Delay showing the continue button until after fade animations
      const timer = setTimeout(() => {
        setShowContinueButton(true);
      }, 600); // Wait for fade animations to complete
      
      return () => clearTimeout(timer);
    }
  }, [animationComplete, isGameOver]);
  
  // Helper to check if an option is correct
  const isCorrectOption = useCallback((option: string): boolean => {
    if (!isGameOver) return false;
    return option === correctAnswer;
  }, [isGameOver, correctAnswer]);
  
  // Helper to check if user guessed an option incorrectly
  const isIncorrectGuess = useCallback((option: string): boolean => {
    // Only mark as incorrect if the guess was made during Final Five
    return guesses.some((g: UserGuess) => 
      !g.isCorrect && 
      g.isFinalFiveGuess && 
      g.guess.toLowerCase() === option.toLowerCase()
    );
  }, [guesses]);
  
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
    return hasWon 
      ? t('game.finalFive.correctAnswer')
      : t('game.finalFive.incorrectAnswer');
  }, [allCardsFlipped, loading, isGameOver, hardMode, gameOutcome, t, isFetchingFinalFiveOptions, optionsLoading]);
  
  // Handle clicking an option - avoid double calls
  const handleOptionClick = useCallback(async (option: string) => {
    if (isGameOver || loading || !challenge) return;
    
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
      }
    } catch (error) {
      console.error('Error selecting option:', error);
    } finally {
      setLoading(false);
    }
  }, [isGameOver, loading, challenge, selectFinalFiveOption]);
  
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