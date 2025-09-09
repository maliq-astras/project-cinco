import { useTheme } from '@/contexts/ThemeContext';
import { formatTime, timerStyles } from '../helpers';

interface UseTimerLogicProps {
  seconds: number;
  isGameOver: boolean;
  hasWon: boolean;
  isSquare: boolean;
  finalFive: boolean;
  className: string;
}

export const useTimerLogic = ({
  seconds,
  isGameOver,
  hasWon,
  isSquare,
  finalFive,
  className
}: UseTimerLogicProps) => {
  const { colors } = useTheme();

  // Format the timer as M:SS
  const formattedTime = formatTime(seconds);
  
  // Generate the class for the timer based on props
  const timerClasses = timerStyles.getTimerClasses(
    className,
    isSquare,
    finalFive
  );
  
  // Generate the style object for theming
  const timerStyle = timerStyles.timerStyle(colors.primary);
  
  // Generate animations for the timer
  const timerAnimation = {
    ...timerStyles.getTimerAnimation(seconds, isGameOver, hasWon),
    ...timerStyles.getShadowAnimation(seconds, isGameOver, colors.primary)
  };

  return {
    formattedTime,
    timerClasses,
    timerStyle,
    timerAnimation
  };
};