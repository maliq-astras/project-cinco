'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import { useGuessProgress } from '../hooks/useGuessProgress';
import { useSparkAnimation } from '../hooks/useSparkAnimation';
import Spark from './Spark';
import { guessProgressBarStyles, progressAnimations, segmentTransition } from '../styles/guessProgressBarStyles';
import { getGradientBackground, getBottomShadowStyle } from '../helpers/guessProgressBarHelpers';

export default function GuessProgressBar() {
  // Access state from the store
  const guesses = useGameStore(state => state.gameState.guesses);
  const maxGuesses = 5; // Set a constant value or use one from config if available
  const { colors } = useTheme();
  
  // Use custom hooks for progress and animations
  const { 
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
  
  return (
    <div className={guessProgressBarStyles.container}>
      <div 
        className={`${guessProgressBarStyles.progressBar} ${isShaking ? progressAnimations.shake : ''}`}
      >
        {Array.from({ length: maxGuesses }).map((_, index) => (
          <div 
            key={index}
            className={`${guessProgressBarStyles.progressSegment} ${index > 0 ? guessProgressBarStyles.progressSegmentBorder : ''}`}
          >
            {index < animatedCount && (
              <AnimatePresence>
                <motion.div 
                  className={guessProgressBarStyles.filledSegment}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: segmentTransition.duration,
                    ease: segmentTransition.ease,
                    delay: index * segmentTransition.staggerDelay // Stagger the animations
                  }}
                >
                  {/* Premium gradient background */}
                  <div 
                    className={guessProgressBarStyles.filledSegment} 
                    style={gradientStyle}
                  />
                  
                  {/* Subtle shine effect */}
                  <div className={guessProgressBarStyles.shineEffect} />
                  
                  {/* Subtle bottom shadow for depth */}
                  <div className={guessProgressBarStyles.bottomShadow} 
                    style={shadowStyle}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
        
        {/* Sparks animation when the bar is full */}
        <AnimatePresence>
          {showSparks && (
            <motion.div 
              className={guessProgressBarStyles.sparkContainer}
              {...containerAnimation}
            >
              {sparks.map((spark, index) => (
                <Spark 
                  key={index} 
                  {...spark}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 