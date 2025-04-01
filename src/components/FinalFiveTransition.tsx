import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTheme } from '../context/ThemeContext';
import { useGameStore } from '../store/gameStore';
import Timer from './Timer';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface FinalFiveTransitionProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
}

export default function FinalFiveTransition({ reason, onStart }: FinalFiveTransitionProps) {
  const { colors } = useTheme();
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  const hardMode = useGameStore(state => state.hardMode);
  const [autoStartTimer, setAutoStartTimer] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handles fetching options and transitioning to Final Five
  const handleStart = async () => {
    // Don't allow multiple transitions
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    try {
      // Get options first (can take some time)
      await triggerFinalFive();
      // Then transition to Final Five with no delay
      onStart();
    } catch (error) {
      console.error("Error transitioning to Final Five:", error);
      setIsTransitioning(false);
    }
  };
  
  // Start auto-start timer after 15 seconds of inactivity
  useEffect(() => {
    const INACTIVITY_DELAY = 15000; // 15 seconds before showing countdown
    
    const timer = setTimeout(() => {
      // Don't show countdown if already transitioning
      if (!isTransitioning) {
        setShowCountdown(true);
        setAutoStartTimer(5);
      }
    }, INACTIVITY_DELAY);
    
    return () => clearTimeout(timer);
  }, [isTransitioning]);
  
  // Handle the 5-second countdown
  useEffect(() => {
    if (showCountdown && autoStartTimer !== null) {
      if (autoStartTimer <= 0) {
        // Hide countdown immediately to avoid animation conflicts
        setShowCountdown(false);
        
        // Brief delay before starting Final Five
        setTimeout(() => {
          // Start transition immediately instead of with a delay
          handleStart();
        }, 500);
        return;
      }
      
      const countdownTimer = setTimeout(() => {
        setAutoStartTimer(prevTime => prevTime !== null ? prevTime - 1 : null);
      }, 1000);
      
      return () => clearTimeout(countdownTimer);
    }
  }, [showCountdown, autoStartTimer]);
  
  // When user manually clicks button, hide the countdown if showing
  useEffect(() => {
    if (isTransitioning && showCountdown) {
      setShowCountdown(false);
    }
  }, [isTransitioning, showCountdown]);
  
  const getMessage = () => {
    const timeLimit = hardMode ? "5" : "55";
    
    if (reason === 'time') {
      return (
        <>
          Time's up! But here's your chance at glory in the <span style={{ color: `var(--color-${colors.primary})` }} className={righteous.className}>FINAL 5</span>! Choose the correct answer from 5 options in an intense {timeLimit}-second showdown{hardMode ? " (Hard Mode)" : ""}. Ready to become a champion?
        </>
      );
    }
    return (
      <>
        5 guesses down, but victory awaits in the <span style={{ color: `var(--color-${colors.primary})` }} className={righteous.className}>FINAL 5</span>! You'll have {timeLimit} seconds to pick the right answer from 5 carefully selected options{hardMode ? " (Hard Mode)" : ""}. This is your moment to shine!
      </>
    );
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start gap-16 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p 
        className="text-xl sm:text-2xl text-left font-display leading-relaxed max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {getMessage()}
      </motion.p>

      <div className="flex flex-col items-center relative">
        <motion.button
          className="px-8 py-4 rounded-full font-display text-white font-bold shadow-lg transition-transform hover:scale-105 text-lg"
          style={{ 
            backgroundColor: `var(--color-${colors.primary})`,
            opacity: isTransitioning ? 0.7 : 1,
            pointerEvents: isTransitioning ? 'none' : 'auto'
          }}
          onClick={handleStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTransitioning ? 0.7 : 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={!isTransitioning ? { scale: 1.05 } : {}}
          whileTap={!isTransitioning ? { scale: 0.95 } : {}}
        >
          Start Final 5
        </motion.button>
        
        {/* Auto-start countdown using the app's Timer component */}
        {/* Positioned absolutely to prevent layout shifts */}
        <AnimatePresence mode="wait">
          {showCountdown && autoStartTimer !== null && (
            <motion.div
              key="countdown-timer"
              className="absolute top-full mt-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <Timer 
                seconds={autoStartTimer} 
                isCompact={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 