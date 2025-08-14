import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameButtons } from './useGameButtons';
import { gameButtonsStyles } from './GameButtons.styles';

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
    // Animation configurations
    buttonAnimation,
    disabledButtonAnimation,
    tooltipAnimation
  } = useGameButtons();

  return (
    <div id="game-controls-right" className={gameButtonsStyles.container}>
      {/* Info button */}
      <motion.button 
        className={gameButtonsStyles.controlButton}
        {...buttonAnimation}
        style={{ color: `var(--color-${colors.primary})` }}
        aria-label={t('ui.buttons.info')}
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>
      
      <div 
        className={gameButtonsStyles.divider} 
        style={{ backgroundColor: `var(--color-${colors.primary}40)` }} 
      />
      
      {/* Skip button */}
      <div className="relative">
        <motion.button 
          className={gameButtonsStyles.controlButton}
          {...(isSkipDisabled() ? disabledButtonAnimation : buttonAnimation)}
          style={gameButtonsStyles.getButtonStyle(colors.primary, isSkipDisabled(), isSkipConfirmActive)}
          onClick={handleSkip}
          disabled={isSkipDisabled()}
          aria-label={isSkipConfirmActive ? t('ui.buttons.confirm_skip') : t('ui.buttons.skip')}
        >
          {isSkipConfirmActive ? (
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7M16 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </motion.button>
      </div>
      {isSkipConfirmActive && (
        <motion.div
          {...tooltipAnimation}
          className={gameButtonsStyles.skipTooltip}
          style={gameButtonsStyles.getTooltipStyle(colors.primary)}
        >
          {isTouchDevice ? t('ui.buttons.confirm_skip_mobile') : t('ui.buttons.confirm_skip')}
          <div 
            className={gameButtonsStyles.skipTooltipCaret}
            style={gameButtonsStyles.getTooltipStyle(colors.primary)}
          />
        </motion.div>
      )}
    </div>
  );
}
