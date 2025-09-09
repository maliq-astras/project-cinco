import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameButtons } from './hooks';
import { 
  getButtonAnimationProps,
  getDisabledButtonAnimationProps,
  getTooltipAnimationProps,
  getButtonHoverProps,
  getButtonTapProps,
  getButtonContainerStyle
} from './helpers';
import styles from './GameButtons.module.css';

interface GameButtonsProps {
  colors: { primary: string };
  isSkipDisabled: () => boolean;
  handleSkip: () => void;
  isSkipConfirmActive: boolean;
  isTouchDevice: boolean;
}

const GameButtons = React.memo(function GameButtons({
  colors,
  isSkipDisabled,
  handleSkip,
  isSkipConfirmActive,
  isTouchDevice
}: GameButtonsProps) {
  const { t } = useTranslation();
  const { controlsRef } = useGameButtons();

  return (
    <div 
      ref={controlsRef}
      id="game-controls-right" 
      className={styles.container}
      style={getButtonContainerStyle(colors.primary)}
    >
      <motion.button 
        className={styles.controlButton}
        {...getButtonAnimationProps()}
        whileHover={getButtonHoverProps(false)}
        whileTap={getButtonTapProps(false)}
        aria-label={t('ui.buttons.info')}
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>
      
      <div className={styles.divider} />
      <div className="relative">
        <motion.button 
          className={`${styles.controlButton} ${isSkipConfirmActive ? styles.active : ''}`}
          {...(isSkipDisabled() ? getDisabledButtonAnimationProps() : getButtonAnimationProps())}
          whileHover={getButtonHoverProps(isSkipDisabled())}
          whileTap={getButtonTapProps(isSkipDisabled())}
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
          {...getTooltipAnimationProps()}
          className={styles.skipTooltip}
        >
          {isTouchDevice ? t('ui.buttons.confirm_skip_mobile') : t('ui.buttons.confirm_skip')}
          <div className={styles.skipTooltipCaret} />
        </motion.div>
      )}
    </div>
  );
});

GameButtons.displayName = 'GameButtons';

export default GameButtons;
