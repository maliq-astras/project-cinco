import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { GameOutcome } from '@/types/index';
import { 
  getMessageData, 
  formatTimeSpent, 
  shouldShowTime, 
  shouldShowConfetti,
  generateConfettiPieces 
} from '../helpers';

interface UseEndGameMessageLogicProps {
  outcome: GameOutcome;
  correctAnswer: string;
  numberOfTries?: number;
  timeSpent: number;
  actualCorrectAnswer: string;
  setActualCorrectAnswer: React.Dispatch<React.SetStateAction<string>>;
  isSearchingCorrectAnswer: boolean;
  setIsSearchingCorrectAnswer: React.Dispatch<React.SetStateAction<boolean>>;
  showTomorrowMessage: boolean;
  setShowTomorrowMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useEndGameMessageLogic = ({
  outcome,
  correctAnswer,
  numberOfTries = 0,
  timeSpent,
  actualCorrectAnswer,
  setActualCorrectAnswer,
  isSearchingCorrectAnswer,
  setIsSearchingCorrectAnswer,
  showTomorrowMessage,
  setShowTomorrowMessage
}: UseEndGameMessageLogicProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const gameState = useGameStore(state => state.gameState);

  // Helper function to find the correct answer from the final five options
  const findCorrectAnswer = useCallback(async () => {
    if (!gameState.challenge) {
      return;
    }
    
    setIsSearchingCorrectAnswer(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      
      let response: Response | undefined;
      
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          if (attempt > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          }
          
          response = await fetch('/api/final-five-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              challengeId: gameState.challenge.challengeId,
              language: localStorage.getItem('language') || 'en'
            }),
            signal: controller.signal
          });
          
          if (response.ok) break;
        } catch (e) {
          if (attempt === 2) throw e;
        }
      }
      
      clearTimeout(timeoutId);
      
      if (!response || !response.ok) {
        throw new Error(`Failed to fetch correct answer: ${response?.status || 'No response'}`);
      }
      
      const data = await response.json();
      setActualCorrectAnswer(data.answer);
    } catch (error) {
      console.error('Error fetching correct answer:', error);
    } finally {
      setIsSearchingCorrectAnswer(false);
    }
  }, [gameState.challenge, setActualCorrectAnswer, setIsSearchingCorrectAnswer]);
  
  // Effect to find correct answer for loss scenarios
  useEffect(() => {
    if ((outcome === 'loss-final-five-wrong' || outcome === 'loss-final-five-time' || outcome === 'loss-time') && 
        (!correctAnswer || correctAnswer.trim() === '')) {
      const correctGuess = gameState.guesses.find(g => g.isCorrect);
      if (correctGuess) {
        setActualCorrectAnswer(correctGuess.guess);
      } else if (gameState.finalFiveOptions && gameState.finalFiveOptions.length > 0) {
        findCorrectAnswer();
      }
    }
  }, [outcome, correctAnswer, gameState.guesses, gameState.finalFiveOptions, findCorrectAnswer, setActualCorrectAnswer]);
  
  // Effect to show "Come back tomorrow" message after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTomorrowMessage(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setShowTomorrowMessage]);

  // Computed values
  const showConfetti = shouldShowConfetti(outcome);
  const confettiPieces = showConfetti ? generateConfettiPieces(colors.primary, colors.accent) : [];
  const timeFormatted = formatTimeSpent(timeSpent, t);
  const shouldShowTimeDisplay = shouldShowTime(outcome);
  const messageData = getMessageData(outcome, actualCorrectAnswer, correctAnswer, numberOfTries);

  return {
    showConfetti,
    confettiPieces,
    timeFormatted,
    shouldShowTimeDisplay,
    messageData,
    colors,
    t
  };
};