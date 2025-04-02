import { CSSProperties } from 'react';

export const timerStyles = {
  // Container styles
  outerContainer: (isVictoryAnimationActive: boolean): string => 
    `flex items-center justify-center h-[66px] sm:h-[76px] min-w-[70px] sm:min-w-[80px] ${isVictoryAnimationActive ? 'opacity-0' : ''}`,
  
  // Base styles shared by all timer variants
  baseClasses: "font-iceberg flex items-center justify-center",
  
  // Timer variant classes
  getTimerClasses: (
    bgClass: string, 
    className: string = '', 
    isSquare: boolean = false, 
    finalFive: boolean = false
  ): string => {
    if (finalFive) {
      // Final Five timer - square with border and semi-transparent background
      return `${timerStyles.baseClasses} ${bgClass} ${className} aspect-square w-full h-full text-3xl rounded-lg border-2`;
    } else if (isSquare) {
      // Square timer with border - used in other places
      return `${timerStyles.baseClasses} ${bgClass} ${className} aspect-square w-full h-full max-w-[150px] max-h-[150px] text-3xl rounded-lg border-2`;
    } else {
      // Default timer used in GameControls
      return `${timerStyles.baseClasses} ${bgClass} ${className} text-xl rounded-lg h-[66px] sm:h-[76px] min-w-[70px] sm:min-w-[80px] border-2`;
    }
  },
  
  // Inline styles for color theming
  timerStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    color: `var(--color-${primaryColor})`
  }),
  
  // Animation based on timer state
  getTimerAnimation: (seconds: number, isGameOver: boolean, hasWon: boolean) => {
    if (seconds <= 10 && !isGameOver) {
      return {
        scale: [1, 1.1, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
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
  },
  
  // Shadow animation for low time
  getShadowAnimation: (seconds: number, isGameOver: boolean, primaryColor: string) => {
    return {
      boxShadow: seconds <= 10 && !isGameOver
        ? `0 0 15px rgba(var(--color-${primaryColor}-rgb), 0.4)`
        : 'none'
    };
  },
  
  // Background class generator based on primary color
  getBgClass: (primaryColor: string): string => {
    switch (primaryColor) {
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
  }
} as const; 