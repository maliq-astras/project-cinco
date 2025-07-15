import { useTheme } from '../../contexts/ThemeContext';
import { useGameStore } from '../../store/gameStore';
import { timerStyles } from './Timer.styles';

interface UseTimerProps {
  seconds: number;
  isGameOver?: boolean;
  hasWon?: boolean;
  isCompact?: boolean;
  isSquare?: boolean;
  finalFive?: boolean;
  className?: string;
}

export const useTimer = ({
  seconds,
  isGameOver = false,
  hasWon = false,
  isCompact = false,
  isSquare = false,
  finalFive = false,
  className = ''
}: UseTimerProps) => {
  const { colors } = useTheme();
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);

  // Format the timer as M:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
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
    formattedTime: formatTime(seconds),
    timerClasses,
    timerStyle,
    timerAnimation,
    isVictoryAnimationActive,
    outerContainerClass: timerStyles.outerContainer(isVictoryAnimationActive)
  };
}; 