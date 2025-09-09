import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getGradientBackground, getBottomShadowStyle } from '../helpers';
import styles from '../GuessProgressBar.module.css';

interface UseGuessProgressBarLogicProps {
  maxGuesses: number;
  animatedCount: number;
  isShaking: boolean;
}

export function useGuessProgressBarLogic({
  maxGuesses,
  animatedCount,
  isShaking
}: UseGuessProgressBarLogicProps) {
  const { colors } = useTheme();
  
  // Pulse animation for when bar is full
  const pulseAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 1, 0], 
      scale: [0.8, 1.2, 1] 
    },
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  };
  
  // Memoize gradient style
  const gradientStyle = useMemo(() => 
    getGradientBackground(colors.primary, colors.secondary),
    [colors.primary, colors.secondary]
  );
  
  // Memoize bottom shadow style
  const shadowStyle = useMemo(() => 
    getBottomShadowStyle(colors.dark),
    [colors.dark]
  );
  
  // Memoize bar class
  const barClassName = useMemo(() => {
    return `${styles.progressBar} ${isShaking ? styles.shake : ''}`;
  }, [isShaking]);
  
  const segments = useMemo(() => {
    return Array.from({ length: maxGuesses }).map((_, index) => ({
      index,
      isActive: index < animatedCount,
      className: `${styles.progressSegment} ${index > 0 ? styles.progressSegmentBorder : ''}`,
      transitionProps: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
        delay: index * 0.1 // Delay between segment animations
      }
    }));
  }, [maxGuesses, animatedCount]);
  
  return {
    pulseAnimation,
    gradientStyle,
    shadowStyle,
    barClassName,
    segments
  };
}