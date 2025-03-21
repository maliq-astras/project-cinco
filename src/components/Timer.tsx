'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface TimerProps {
  seconds: number;
  isGameOver?: boolean;
  hasWon?: boolean;
  isCompact?: boolean;
  isSquare?: boolean; // Square timer used in FinalFiveOptions
  className?: string;
}

/**
 * A reusable timer component that displays time in M:SS format
 * with consistent styling throughout the app
 */
export default function Timer({ 
  seconds, 
  isGameOver = false, 
  hasWon = false,
  isCompact = false,
  isSquare = false,
  className = ''
}: TimerProps) {
  const { colors } = useTheme();

  // Format the timer as M:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Get animation for the timer
  const getTimerAnimation = () => {
    if (seconds <= 10 && !isGameOver) {
      return {
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse' as const
        }
      };
    }
    
    if (isGameOver) {
      // Game over timer animation - only animate scale, not color
      return hasWon 
        ? { scale: 1.1 }
        : { scale: 1 };
    }
    
    return {};
  };

  // Generate the appropriate background class based on the theme color
  // Using opacity-15 for the semi-transparent effect (15%)
  const getBgClass = () => {
    switch (colors.primary) {
      case 'blue-600': return 'bg-blue-600/15';
      case 'emerald-600': return 'bg-emerald-600/15';
      case 'violet-600': return 'bg-violet-600/15';
      case 'orange-600': return 'bg-orange-600/15';
      case 'fuchsia-600': return 'bg-fuchsia-600/15';
      case 'red-600': return 'bg-red-600/15';
      case 'amber-500': return 'bg-amber-500/15';
      case 'teal-500': return 'bg-teal-500/15';
      case 'indigo-500': return 'bg-indigo-500/15';
      default: return 'bg-blue-600/15'; // Default to blue
    }
  };
  
  const bgClass = getBgClass();
  
  // Base classes needed for layout
  const baseClasses = `font-iceberg flex items-center justify-center`;
  
  // Different styling for square vs regular timer
  let timerClasses;
  
  if (isSquare) {
    // Square timer with border - used in FinalFiveOptions
    timerClasses = `${baseClasses} ${bgClass} ${className} aspect-square w-full h-full max-w-[150px] max-h-[150px] text-3xl rounded-lg border-2`;
  } else {
    // Timer used in GameControls
    timerClasses = `${baseClasses} ${bgClass} ${className} text-xl rounded-lg h-[66px] sm:h-[76px] min-w-[70px] sm:min-w-[80px] border-2`;
  }
  
  // Use inline style for the border color and text color to ensure consistent theme color
  const timerStyle = {
    borderColor: `var(--color-${colors.primary})`,
    color: `var(--color-${colors.primary})`
  };
  
  return (
    <motion.div 
      className={timerClasses}
      style={timerStyle}
      animate={{
        ...getTimerAnimation(),
        boxShadow: seconds <= 10 && !isGameOver
          ? `0 0 15px rgba(var(--color-${colors.primary}-rgb), 0.4)`
          : 'none'
      }}
    >
      {formatTime(seconds)}
    </motion.div>
  );
} 