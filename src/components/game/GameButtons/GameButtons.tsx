import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameButtons } from './useGameButtons';
import styles from './GameButtons.module.css';

interface GameButtonsProps {
  colors: { primary: string };
  isSkipDisabled: () => boolean;
  handleSkip: () => void;
  isSkipConfirmActive: boolean;
  isTouchDevice: boolean;
}

/**
 * Game action buttons component (info and skip buttons)
 */
export default function GameButtons({
  colors,
  isSkipDisabled,
  handleSkip,
  isSkipConfirmActive,
  isTouchDevice
}: GameButtonsProps) {
  const { t } = useTranslation();
  const {
    controlsRef,
    // Animation configurations
    buttonAnimation,
    disabledButtonAnimation,
    tooltipAnimation
  } = useGameButtons();

  return (
    <div 
      ref={controlsRef}
      id="game-controls-right" 
      className={styles.container}
      style={{
        '--button-color': `var(--color-${colors.primary})`,
        '--button-active-bg': `var(--color-${colors.primary}20)`,
        '--divider-color': `var(--color-${colors.primary}40)`,
        '--tooltip-color': `var(--color-${colors.primary})`
      } as React.CSSProperties}
    >
      {/* Info button */}
      <motion.button 
        className={styles.controlButton}
        {...buttonAnimation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('ui.buttons.info')}
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>
      
      <div className={styles.divider} />
      
      {/* Skip button */}
      <div className="relative">
        <motion.button 
          className={`${styles.controlButton} ${isSkipConfirmActive ? styles.active : ''}`}
          {...(isSkipDisabled() ? disabledButtonAnimation : buttonAnimation)}
          whileHover={isSkipDisabled() ? {} : { scale: 1.05 }}
          whileTap={isSkipDisabled() ? {} : { scale: 0.95 }}
          onClick={handleSkip}
          disabled={isSkipDisabled()}
          aria-label={isSkipConfirmActive ? t('ui.buttons.confirm_skip') : t('ui.buttons.skip')}
        >
          {isSkipConfirmActive ? (
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7M16 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </motion.button>
      </div>
      {isSkipConfirmActive && (
        <motion.div
          {...tooltipAnimation}
          className={styles.skipTooltip}
        >
          {isTouchDevice ? t('ui.buttons.confirm_skip_mobile') : t('ui.buttons.confirm_skip')}
          <div className={styles.skipTooltipCaret} />
        </motion.div>
      )}
    </div>
  );
}
