import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import Timer from './Timer';
import { useFinalFiveIntro } from '../hooks/components/finalFiveIntro';
import { finalFiveIntroStyles } from '../styles/finalFiveIntroStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface FinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
}

export default function FinalFiveIntro({ reason, onStart }: FinalFiveIntroProps) {
  const {
    handleStart,
    isTransitioning,
    showCountdown,
    autoStartTimer,
    message,
    colors,
    hardMode
  } = useFinalFiveIntro({ reason, onStart });

  // Transform the message into JSX by wrapping "FINAL 5" in a styled span
  const messageJSX = message.split('FINAL 5').map((part, i, arr) => (
    <React.Fragment key={i}>
      {part}
      {i < arr.length - 1 && (
        <span style={{ color: `var(--color-${colors.primary})` }} className={righteous.className}>
          FINAL 5
        </span>
      )}
    </React.Fragment>
  ));

  return (
    <motion.div
      className={finalFiveIntroStyles.container}
      {...finalFiveIntroStyles.containerAnimation}
    >
      <motion.p 
        className={finalFiveIntroStyles.message}
        {...finalFiveIntroStyles.messageAnimation}
      >
        {messageJSX}
      </motion.p>

      <div className={finalFiveIntroStyles.buttonContainer}>
        <motion.button
          className={finalFiveIntroStyles.button}
          style={{ 
            backgroundColor: `var(--color-${colors.primary})`,
            opacity: isTransitioning ? 0.7 : 1,
            pointerEvents: isTransitioning ? 'none' : 'auto'
          }}
          onClick={handleStart}
          {...finalFiveIntroStyles.buttonAnimation}
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
              className={finalFiveIntroStyles.countdownContainer}
              {...finalFiveIntroStyles.countdownAnimation}
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