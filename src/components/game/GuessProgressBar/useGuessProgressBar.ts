import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useGuessProgress } from './useGuessProgress';
import { useSparkAnimation } from '@/hooks/animation/useSparkAnimation';
import { getGradientBackground, getBottomShadowStyle } from '@/helpers/guessProgressBarHelpers';
import { progressAnimations, segmentTransition, guessProgressBarStyles } from './GuessProgressBar.styles';

interface UseGuessProgressBarProps {
  maxGuesses?: number;
}

/**
 * Comprehensive hook for the GuessProgressBar component that encapsulates all logic
 */
export function useGuessProgressBar({
  maxGuesses = 5
}: UseGuessProgressBarProps = {}) {
  // Access state from the store
  const guesses = useGameStore(state => state.gameState.guesses);
  const { colors } = useTheme();
  
  // Use custom hooks for progress and animations
  const { 
    wrongGuessCount,
    animatedCount,
    isShaking,
    showSparks
  } = useGuessProgress({
    guesses,
    maxGuesses
  });
  
  // Get spark animations
  const { 
    sparks,
    containerAnimation,
    pulseAnimation
  } = useSparkAnimation({
    primaryColor: `var(--color-${colors.primary})`,
    secondaryColor: `var(--color-${colors.secondary})`
  });
  
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
    return `${guessProgressBarStyles.progressBar} ${isShaking ? progressAnimations.shake : ''}`;
  }, [isShaking]);
  
  // Create array for segments
  const segments = useMemo(() => {
    return Array.from({ length: maxGuesses }).map((_, index) => ({
      index,
      isActive: index < animatedCount,
      className: `${guessProgressBarStyles.progressSegment} ${index > 0 ? guessProgressBarStyles.progressSegmentBorder : ''}`,
      transitionProps: {
        duration: segmentTransition.duration,
        ease: segmentTransition.ease,
        delay: index * segmentTransition.staggerDelay
      }
    }));
  }, [maxGuesses, animatedCount]);
  
  return {
    // State
    wrongGuessCount,
    animatedCount,
    isShaking,
    showSparks,
    maxGuesses,
    
    // Animation properties
    sparks,
    containerAnimation,
    pulseAnimation,
    
    // Styles
    gradientStyle,
    shadowStyle,
    barClassName,
    
    // Data
    segments,
    
    // Style constants
    guessProgressBarStyles,
    segmentTransition
  };
} 