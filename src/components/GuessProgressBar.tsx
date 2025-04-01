'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spark from './Spark';
import { useGuessProgressBar } from '../hooks';
import { SparkProps } from '../hooks/animation/useSparkAnimation';

/**
 * Displays a progress bar for user guesses with animation effects
 * Shows sparks animation when all guesses are used
 */
export default function GuessProgressBar() {
  // Use comprehensive hook for all logic and state
  const {
    // State
    animatedCount,
    showSparks,
    
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
    guessProgressBarStyles
  } = useGuessProgressBar();
  
  return (
    <div className={guessProgressBarStyles.container}>
      <div className={barClassName}>
        {segments.map(segment => (
          <div 
            key={segment.index}
            className={segment.className}
          >
            {segment.isActive && (
              <AnimatePresence>
                <motion.div 
                  className={guessProgressBarStyles.filledSegment}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={segment.transitionProps}
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
              {sparks.map((spark: SparkProps, index: number) => (
                <Spark 
                  key={index} 
                  {...spark}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final pulse glow effect when the bar is full */}
        <AnimatePresence>
          {showSparks && (
            <motion.div 
              className={guessProgressBarStyles.pulseEffect} 
              style={gradientStyle}
              {...pulseAnimation}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 