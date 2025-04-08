import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { verifyGuess } from '../../../helpers/gameLogic';

export type GameOutcome = 'standard-win' | 'final-five-win' | 'loss';

interface UseEndGameMessageProps {
  outcome: GameOutcome;
  correctAnswer: string;
  numberOfTries?: number;
  timeSpent: number;
}

interface MessageData {
  type: 'standard-win' | 'final-five-win' | 'loss-final-five-wrong' | 'loss-final-five-time' | 'loss-time';
  displayAnswer: string;
  numberOfTries?: number;
}

interface UseEndGameMessageReturn {
  actualCorrectAnswer: string;
  showConfetti: boolean;
  confettiPieces: Array<{
    id: number;
    size: number;
    color: string;
    angle: number;
    delay: number;
  }>;
  showTomorrowMessage: boolean;
  timeFormatted: string;
  shouldShowTime: boolean;
  messageData: MessageData;
  colors: { primary: string; accent: string };
}

export const useEndGameMessage = ({
  outcome,
  correctAnswer,
  numberOfTries = 0,
  timeSpent
}: UseEndGameMessageProps): UseEndGameMessageReturn => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const finalFiveTimeRemaining = useGameStore(state => state.finalFiveTimeRemaining);
  const gameState = useGameStore(state => state.gameState);
  const [showTomorrowMessage, setShowTomorrowMessage] = useState(false);
  
  // Get the most recent guess to determine if user ran out of time or picked wrong
  const latestGuess = gameState.guesses.length > 0 
    ? gameState.guesses[gameState.guesses.length - 1] 
    : null;
  const pickedWrongAnswer = latestGuess && !latestGuess.isCorrect && latestGuess.isFinalFiveGuess;
  
  // Find correct answer from guesses if possible
  const [actualCorrectAnswer, setActualCorrectAnswer] = useState(correctAnswer);
  const [isSearchingCorrectAnswer, setIsSearchingCorrectAnswer] = useState(false);
  
  // Helper function to find the correct answer from the final five options
  const findCorrectAnswer = useCallback(async () => {
    if (!gameState.challenge || !gameState.finalFiveOptions || gameState.finalFiveOptions.length === 0) {
      return;
    }
    
    setIsSearchingCorrectAnswer(true);
    
    for (const option of gameState.finalFiveOptions) {
      try {
        const result = await verifyGuess(gameState.challenge.challengeId, option);
        if (result.isCorrect) {
          setActualCorrectAnswer(option);
          break;
        }
      } catch (error) {
        console.error(`Error verifying option ${option}:`, error);
      }
    }
    
    setIsSearchingCorrectAnswer(false);
  }, [gameState.challenge, gameState.finalFiveOptions]);
  
  useEffect(() => {
    if (outcome === 'loss' && (!correctAnswer || correctAnswer.trim() === '')) {
      // Try to find correct answer from guesses
      const correctGuess = gameState.guesses.find(g => g.isCorrect);
      if (correctGuess) {
        setActualCorrectAnswer(correctGuess.guess);
      } else if (gameState.finalFiveOptions && gameState.finalFiveOptions.length > 0) {
        // If no correct guess found, we need to find the actual correct answer in the options
        findCorrectAnswer();
      }
    }
  }, [outcome, correctAnswer, gameState.guesses, gameState.finalFiveOptions, findCorrectAnswer]);
  
  // Confetti pieces configuration - only for win scenarios
  const showConfetti = outcome === 'standard-win' || outcome === 'final-five-win';
  const confettiPieces = showConfetti ? Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    color: i % 2 === 0 ? `var(--color-${colors.primary})` : `var(--color-${colors.accent})`,
    angle: (i * 18) % 360,
    delay: i * 0.05
  })) : [];

  // Format time spent
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const timeFormatted = t('game.endGame.timeSpent', { minutes, seconds });
  
  // Determine if we should show time (only for standard wins)
  const shouldShowTime = outcome === 'standard-win';
  
  // Effect to show "Come back tomorrow" message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTomorrowMessage(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get message data based on outcome
  const messageData: MessageData = (() => {
    const displayAnswer = actualCorrectAnswer || correctAnswer;
    
    switch(outcome) {
      case 'standard-win':
        return {
          type: 'standard-win',
          displayAnswer,
          numberOfTries
        };
      case 'final-five-win':
        return {
          type: 'final-five-win',
          displayAnswer
        };
      case 'loss':
        // Check if any guesses were made in Final Five
        const hasFinalFiveGuesses = gameState.guesses.some(g => g.isFinalFiveGuess);
        
        // Check specifically for wrong guesses in Final Five
        if (hasFinalFiveGuesses) {
          return {
            type: 'loss-final-five-wrong',
            displayAnswer
          };
        } 
        
        // Final five time ran out (check specifically for final five)
        if (gameState.finalFiveOptions && gameState.finalFiveOptions.length > 0 && finalFiveTimeRemaining === 0) {
          return {
            type: 'loss-final-five-time',
            displayAnswer
          };
        }
        
        // Regular time ran out (not in final five)
        return {
          type: 'loss-time',
          displayAnswer
        };
    }
  })();

  return {
    actualCorrectAnswer,
    showConfetti,
    confettiPieces,
    showTomorrowMessage,
    timeFormatted,
    shouldShowTime,
    messageData,
    colors
  };
}; 