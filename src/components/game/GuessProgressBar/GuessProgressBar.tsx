'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuessProgressBar } from './hooks';
import styles from './GuessProgressBar.module.css';

/**
 * Displays a progress bar for user guesses with animation effects
 * Shows sparks animation when all guesses are used
 */
export default function GuessProgressBar() {
  const {
    // State
    animatedCount,
    
    // Animation properties
    pulseAnimation,
    
    // Styles
    gradientStyle,
    shadowStyle,
    barClassName,
    
    // Data
    segments
  } = useGuessProgressBar();
  
  return (
    <div className={styles.container}>
      <div className={barClassName}>
        {segments.map(segment => (
          <div 
            key={segment.index}
            className={segment.className}
          >
            {segment.isActive && (
              <AnimatePresence>
                <motion.div 
                  className={styles.filledSegment}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={segment.transitionProps}
                >
                  {/* Premium gradient background */}
                  <div 
                    className={styles.filledSegment} 
                    style={gradientStyle}
                  />
                  
                  {/* Subtle shine effect */}
                  <div className={styles.shineEffect} />
                  
                  {/* Subtle bottom shadow for depth */}
                  <div className={styles.bottomShadow} 
                    style={shadowStyle}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
        
        {/* Final pulse glow effect when the bar is full */}
        <AnimatePresence>
          {animatedCount >= 6 && (
            <motion.div 
              className={styles.pulseEffect} 
              style={gradientStyle}
              {...pulseAnimation}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 