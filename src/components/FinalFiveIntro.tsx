import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveIntro } from '../hooks/components/finalFiveIntro';
import { finalFiveIntroStyles } from '../styles/finalFiveIntroStyles';
import { useTranslation } from 'react-i18next';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface FinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
  onBackgroundAnimationComplete?: () => void;
}

export default function FinalFiveIntro({ reason, onStart, onBackgroundAnimationComplete }: FinalFiveIntroProps) {
  const {
    handleStart,
    isTransitioning,
    showCountdown,
    autoStartTimer,
    message,
    colors,
    hardMode,
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
        <AnimatePresence>
          {showStartButton && !isLoading && (
            <motion.button
              className={finalFiveIntroStyles.button}
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
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center mb-2">
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
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {isSlowConnection 
                    ? t('game.finalFive.slowConnection') 
                    : t('game.finalFive.loading')}
                </p>
                {retryCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
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