'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from './useTimer';
import { timerStyles } from './Timer.styles';

interface TimerProps {
  seconds: number;
  isGameOver?: boolean;
  hasWon?: boolean;
  isCompact?: boolean;
  isSquare?: boolean; // Square timer used in FinalFiveOptions
  finalFive?: boolean; // Special styling for Final Five screen
  className?: string;
}

/**
 * A reusable timer component that displays time in M:SS format
 * with consistent styling throughout the app
 */
const Timer: React.FC<TimerProps> = ({ 
  seconds, 
  isGameOver = false, 
  hasWon = false,
  isCompact = false,
  isSquare = false,
  finalFive = false,
  className = ''
}) => {
  const {
    formattedTime,
    timerClasses,
    timerStyle,
    timerAnimation,
    isVictoryAnimationActive,
    outerContainerClass,
    timerRef
  } = useTimer({
    seconds,
    isGameOver,
    hasWon, 
    isCompact,
    isSquare,
    finalFive,
    className
  });
  
  // For Final Five, we need to adjust the styling while keeping the border
  if (finalFive) {
    return (
      <div className={timerClasses} style={timerStyle}>
        {formattedTime}
      </div>
    );
  }
  
  return (
    <div 
      ref={timerRef}
      id="game-timer"
      className={timerStyles.outerContainer(isVictoryAnimationActive)}
    >
      <motion.div 
        className={timerClasses}
        style={timerStyle}
        animate={timerAnimation}
      >
        {formattedTime}
      </motion.div>
    </div>
  );
};

export default Timer; 