import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveIntro } from './hooks';
import styles from './FinalFiveIntro.module.css';
import { useTranslation } from 'react-i18next';
import { 
  getContainerAnimations,
  getMessageAnimations,
  getButtonAnimations,
  getLoadingAnimations,
  getButtonHoverProps,
  parseMessageWithFinalFive,
  getButtonStyle,
  getSpinnerStyle
} from './helpers';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface FinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
  onBackgroundAnimationComplete?: () => void;
}

const FinalFiveIntro = React.memo<FinalFiveIntroProps>(({ reason, onBackgroundAnimationComplete }) => {
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

  const messageJSX = parseMessageWithFinalFive(message, colors, righteous);
  const containerAnimations = getContainerAnimations();
  const messageAnimations = getMessageAnimations();

  return (
    <motion.div
      className={styles.container}
      {...containerAnimations}
    >
      <motion.p 
        className={styles.message}
        {...messageAnimations}
      >
        {messageJSX}
      </motion.p>

      <div className={styles.buttonContainer}>
        <AnimatePresence>
          {showStartButton && !isLoading && (
            <motion.button
              className={styles.button}
              style={getButtonStyle(colors.primary, isTransitioning)}
              onClick={handleStart}
              {...getButtonAnimations()}
              {...getButtonHoverProps(isTransitioning)}
            >
              {t('game.finalFive.startButton')}
            </motion.button>
          )}
          
          {isLoading && (
            <motion.div
              className={styles.loadingContainer}
              {...getLoadingAnimations()}
            >
              <div className={styles.loadingSpinnerContainer}>
                <svg 
                  className={`animate-spin ${styles.loadingSpinnerIcon}`}
                  style={getSpinnerStyle(colors.primary)}
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
});

FinalFiveIntro.displayName = 'FinalFiveIntro';

export default FinalFiveIntro; 