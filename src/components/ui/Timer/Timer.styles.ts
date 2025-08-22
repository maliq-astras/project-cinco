import { CSSProperties } from 'react';
import styles from './Timer.module.css';

export const timerStyles = {
  // Static styles from CSS module
  outerContainer: (isVictoryAnimationActive: boolean): string => 
    `${styles.outerContainer} ${isVictoryAnimationActive ? styles.outerContainerHidden : ''}`,
  
  // Timer variant classes
  getTimerClasses: (
    className: string = '', 
    isSquare: boolean = false, 
    finalFive: boolean = false
  ): string => {
    const baseClass = `${styles.baseClasses} ${className}`;
    
    if (finalFive) {
      // Final Five timer - square with border and semi-transparent background
      return `${baseClass} ${styles.finalFiveTimer}`;
    } else if (isSquare) {
      // Square timer with border - used in other places
      return `${baseClass} ${styles.squareTimer}`;
    } else {
      // Default timer used in GameControls
      return `${baseClass} ${styles.defaultTimer}`;
    }
  },
  
  // Inline styles for color theming
  timerStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    color: `var(--color-${primaryColor})`,
    backgroundColor: `rgba(var(--color-${primaryColor}-rgb), 0.15)` // 15% opacity background
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
  }
} as const; 