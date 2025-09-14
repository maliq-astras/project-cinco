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
  getButtonStyle
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
                <span 
                  className={styles.loadingSpinner}
                  style={{ '--spinner-color': `var(--color-${colors.primary})` } as React.CSSProperties}
                />
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