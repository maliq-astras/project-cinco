import { GameOutcome } from '@/types/index';

export interface MessageData {
  type: 'standard-win' | 'final-five-win' | 'loss-final-five-wrong' | 'loss-final-five-time' | 'loss-time';
  displayAnswer: string;
  numberOfTries?: number;
}

export const getMessageData = (
  outcome: GameOutcome,
  actualCorrectAnswer: string,
  correctAnswer: string,
  numberOfTries?: number
): MessageData => {
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
    case 'loss-final-five-wrong':
      return {
        type: 'loss-final-five-wrong',
        displayAnswer
      };
    case 'loss-final-five-time':
      return {
        type: 'loss-final-five-time',
        displayAnswer
      };
    case 'loss-time':
      return {
        type: 'loss-time',
        displayAnswer
      };
  }
};

export const formatTimeSpent = (timeSpent: number, t: (key: string, options?: any) => string): string => {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  return t('game.endGame.timeSpent', { minutes, seconds });
};

export const shouldShowTime = (outcome: GameOutcome): boolean => {
  return outcome === 'standard-win';
};

export const shouldShowConfetti = (outcome: GameOutcome): boolean => {
  return outcome === 'standard-win' || outcome === 'final-five-win';
};

export type { GameOutcome };