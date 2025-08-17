import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveIntro } from './useFinalFiveIntro';
import styles from './FinalFiveIntro.module.css';
import { useTranslation } from 'react-i18next';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface FinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
  onBackgroundAnimationComplete?: () => void;
}

export default function FinalFiveIntro({ reason, onBackgroundAnimationComplete }: FinalFiveIntroProps) {
  const {
    handleStart,
    isTransitioning,
    message,
    colors,
    isLoading,
    showStartButton,
    isSlowConnection,
    retryCount
  } = useFinalFiveIntro({
    reason,
    onStart: () => {
      if (onBackgroundAnimationComplete) {
        onBackgroundAnimationComplete();
      }
    }
  });

  const { t } = useTranslation();

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
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p 
        className={styles.message}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {messageJSX}
      </motion.p>

      <div className={styles.buttonContainer}>
        <AnimatePresence>
          {showStartButton && !isLoading && (
            <motion.button
              className={styles.button}
              style={{ 
                backgroundColor: `var(--color-${colors.primary})`,
                opacity: isTransitioning ? 0.7 : 1,
                pointerEvents: isTransitioning ? 'none' : 'auto'
              }}
              onClick={handleStart}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
              whileHover={!isTransitioning ? { scale: 1.05 } : {}}
              whileTap={!isTransitioning ? { scale: 0.95 } : {}}
            >
              {t('game.finalFive.startButton')}
            </motion.button>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              className={styles.loadingContainer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.loadingSpinnerContainer}>
                <svg 
                  className="animate-spin h-10 w-10"
                  style={{ color: `var(--color-${colors.primary})` }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className={styles.loadingTextContainer}>
                <p className={styles.loadingMessage}>
                  {isSlowConnection 
                    ? t('game.finalFive.slowConnection') 
                    : t('game.finalFive.loading')}
                </p>
                {retryCount > 0 && (
                  <p className={styles.retryMessage}>
                    Retrying... ({retryCount}/3)
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 