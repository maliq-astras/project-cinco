import { useTimerState } from './useTimerState';
import { useTimerLogic } from './useTimerLogic';

interface UseTimerProps {
  seconds: number;
  isGameOver?: boolean;
  hasWon?: boolean;
  isSquare?: boolean;
  finalFive?: boolean;
  className?: string;
}

export const useTimer = ({
  seconds,
  isGameOver = false,
  hasWon = false,
  isSquare = false,
  finalFive = false,
  className = ''
}: UseTimerProps) => {
  const { isVictoryAnimationActive, timerRef } = useTimerState();
  
  const { formattedTime, timerClasses, timerStyle, timerAnimation } = useTimerLogic({
    seconds,
    isGameOver,
    hasWon,
    isSquare,
    finalFive,
    className
  });

  return {
    formattedTime,
    timerClasses,
    timerStyle,
    timerAnimation,
    isVictoryAnimationActive,
    timerRef
  };
};