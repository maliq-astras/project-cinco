import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { verifyGuess } from '../../../helpers/gameLogic';
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
    hardMode
  } = useGameStore();
  
  const { colors, darkMode } = useTheme();
  
  // Local state
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timerReachedZero, setTimerReachedZero] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  
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
    if (isFinalFiveActive && !allCardsFlipped) {
      flipCardSequentially(0);
    }
  }, [isFinalFiveActive, allCardsFlipped]);
  
  // Check all options against the API when game is over
  useEffect(() => {
    const verifyAllOptions = async () => {
      if (isGameOver && finalFiveOptions && finalFiveOptions.length > 0 && !correctAnswer && challenge) {
        setLoading(true);
        
        // Check each option that hasn't been guessed yet
        for (const option of finalFiveOptions) {
          try {
            const result = await verifyGuess(challenge.challengeId, option);
            
            if (result.isCorrect) {
              setCorrectAnswer(option);
              break; // Stop once we find the correct answer
            }
          } catch (error) {
            console.error(`Error verifying option ${option}:`, error);
          }
        }
        
        setLoading(false);
      }
    };
    
    verifyAllOptions();
  }, [isGameOver, finalFiveOptions, correctAnswer, challenge, guesses]);
  
  // Try to find the correct answer from existing guesses
  useEffect(() => {
    if (isGameOver && !correctAnswer) {
      const found = guesses.find((g: UserGuess) => g.isCorrect);
      if (found) {
        setCorrectAnswer(found.guess);
      }
    }
  }, [isGameOver, guesses, correctAnswer]);
  
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
    return guesses.some((g: UserGuess) => !g.isCorrect && g.guess === option);
  }, [guesses]);
  
  // Helper to determine if an option should be visible after game over
  const shouldShowOption = useCallback((option: string): boolean => {
    if (!isGameOver || !animationComplete) return true;
    return isCorrectOption(option) || isIncorrectGuess(option);
  }, [isGameOver, animationComplete, isCorrectOption, isIncorrectGuess]);
  
  // Helper to get the message to display
  const getMessage = useCallback(() => {
    if (!allCardsFlipped) {
      return "Cards are being revealed...";
    }
    
    if (loading) {
      return "Determining the correct answer...";
    }
    
    if (!isGameOver) {
      return `Select the correct answer${hardMode ? " (Hard Mode: 5 seconds)" : ""}`;
    }
    
    const hasWon = gameOutcome === 'final-five-win';
    return hasWon 
      ? "Correct! You found the answer!"
      : "Incorrect. The correct answer is highlighted.";
  }, [allCardsFlipped, loading, isGameOver, hardMode, gameOutcome]);
  
  // Helper to get card styles
  const getCardStyles = useCallback((option: string) => {
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
  }, [colors.primary, darkMode, isGameOver, isCorrectOption]);
  
  // Handle clicking an option
  const handleOptionClick = useCallback(async (option: string) => {
    if (isGameOver || loading || !challenge) return;
    
    setLoading(true);
    
    try {
      // This function also updates global game state
      await selectFinalFiveOption(option);
      
      // Locally set the correct answer if this was correct
      const wasCorrect = await verifyGuess(challenge.challengeId, option);
      if (wasCorrect.isCorrect) {
        setCorrectAnswer(option);
      }
    } catch (error) {
      console.error("Error selecting option:", error);
    } finally {
      setLoading(false);
    }
  }, [isGameOver, loading, challenge, selectFinalFiveOption]);
  
  return {
    // State
    options,
    correctAnswer,
    loading,
    animationComplete,
    flippedCards,
    allCardsFlipped,
    showContinueButton,
    isFinalFiveActive,
    isGameOver,
    finalFiveTimeRemaining,
    gameOutcome,
    
    // Styles
    themeColor,
    
    // Helpers
    getMessage,
    getCardStyles,
    isCorrectOption,
    isIncorrectGuess,
    shouldShowOption,
    
    // Actions
    handleOptionClick,
    closeFinalFive
  };
} 