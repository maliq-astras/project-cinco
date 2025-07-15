import React, { forwardRef} from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GuessProgressBar from '../GuessProgressBar';
import Timer from '../Timer';
import { useGameControls, GameControlsHandle } from './useGameControls';
import { gameControlsStyles } from './GameControls.styles';

const GameControls = forwardRef<GameControlsHandle, {}>((props, ref) => {
  const { t } = useTranslation();
  const {
    inputRef,
    timeRemaining,
    isVictoryAnimationActive,
    colors,
    handleSubmit,
    handleSkip,
    isInputDisabled,
    isSkipDisabled,
    inputValue,
    setInputValue,
    isSkipConfirmActive,
    isTouchDevice
  } = useGameControls(ref);

  return (
    <div id="game-controls" className={gameControlsStyles.container}>
      <motion.div
        className={gameControlsStyles.wrapper}
        {...gameControlsStyles.wrapperAnimation}
        animate={gameControlsStyles.wrapperAnimation.animate(isVictoryAnimationActive)}
      >
        <div className="relative">
          {/* Toast messages container - Keep duplicate and skip toasts */}
          <div className={gameControlsStyles.toastContainer}>
            {/* Duplicate guess toast */}
            <div id="duplicate-error" className={gameControlsStyles.duplicateToast}>
              {t('game.status.duplicate')}
            </div>

            {/* Skip message toast */}
            <div id="skip-message" className={gameControlsStyles.skipToast}>
              {t('game.status.skipped')}
            </div>
          </div>
          
          <div className={gameControlsStyles.controlsArea}>
            <div id="facts-area" className={gameControlsStyles.factsArea}>
              <div className="relative">
                <Timer seconds={timeRemaining} />
              </div>

              <div className={gameControlsStyles.inputContainer}>
                <div className="relative">
                  <form onSubmit={handleSubmit} className="relative">
                    <input
                      id="game-input"
                      ref={inputRef}
                      className={gameControlsStyles.input(isInputDisabled())}
                      style={gameControlsStyles.inputWithTheme(colors.primary)}
                      disabled={isInputDisabled()}
                      autoComplete="off"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                      type="submit"
                      className={gameControlsStyles.submitButton}
                      style={{
                        color: `var(--color-${colors.primary})`,
                        backgroundColor: `var(--color-${colors.primary}10)`,
                        opacity: isInputDisabled() || !inputValue.trim() ? 0.5 : 1
                      }}
                      disabled={isInputDisabled() || !inputValue.trim()}
                    >
                      ENTER
                    </button>
                  </form>
                </div>
                
                <div className={gameControlsStyles.progressContainer}>
                  <div id="game-progress">
                    <GuessProgressBar />
                  </div>
                </div>
              </div>

              <div id="game-controls-right" className={gameControlsStyles.controlsRight}>
                {/* Info button */}
                <motion.button 
                  className={gameControlsStyles.controlButton}
                  {...gameControlsStyles.buttonAnimation}
                  style={{ color: `var(--color-${colors.primary})` }}
                  aria-label={t('ui.buttons.info')}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>
                
                <div 
                  className={gameControlsStyles.divider} 
                  style={{ backgroundColor: `var(--color-${colors.primary}40)` }} 
                />
                
                {/* Skip button */}
                <div className="relative">
                  <motion.button 
                    className={gameControlsStyles.controlButton}
                    {...(isSkipDisabled() ? gameControlsStyles.disabledButtonAnimation : gameControlsStyles.buttonAnimation)}
                    style={gameControlsStyles.getButtonStyle(colors.primary, isSkipDisabled(), isSkipConfirmActive)}
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
                    {...gameControlsStyles.tooltipAnimation}
                    className={gameControlsStyles.skipTooltip}
                    style={gameControlsStyles.getTooltipStyle(colors.primary)}
                  >
                    {isTouchDevice ? t('ui.buttons.confirm_skip_mobile') : t('ui.buttons.confirm_skip')}
                    <div 
                      className={gameControlsStyles.skipTooltipCaret}
                      style={gameControlsStyles.getTooltipStyle(colors.primary)}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default GameControls; 