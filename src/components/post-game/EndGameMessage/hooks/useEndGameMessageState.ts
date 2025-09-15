import { useState } from 'react';
import { GameOutcome } from '@/types/index';

interface UseEndGameMessageStateProps {
  outcome: GameOutcome;
  correctAnswer: string;
}

export const useEndGameMessageState = ({ 
  outcome: _outcome, 
  correctAnswer 
}: UseEndGameMessageStateProps) => {
  const [actualCorrectAnswer, setActualCorrectAnswer] = useState(correctAnswer);
  const [isSearchingCorrectAnswer, setIsSearchingCorrectAnswer] = useState(false);
  const [showTomorrowMessage, setShowTomorrowMessage] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

  return {
    actualCorrectAnswer,
    setActualCorrectAnswer,
    isSearchingCorrectAnswer,
    setIsSearchingCorrectAnswer,
    showTomorrowMessage,
    setShowTomorrowMessage,
    isAnswerModalOpen,
    setIsAnswerModalOpen
  };
};