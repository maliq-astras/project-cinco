import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import GuessProgressBar from './GuessProgressBar';
import Timer from './Timer';
import { useGameControls, GameControlsHandle } from '../hooks/components/gameControls';
import { gameControlsStyles } from '../styles/gameControlsStyles';

const GameControls = forwardRef<GameControlsHandle, {}>((props, ref) => {
  const {
    inputRef,
    timeRemaining,
    isVictoryAnimationActive,
    colors,
    handleSubmit,
    handleSkip,
    getInputPlaceholder,
    isInputDisabled,
    isSkipDisabled
  } = useGameControls(ref);

  return (
    <div id="game-controls" className={gameControlsStyles.container}>
      <motion.div
        className={gameControlsStyles.wrapper}
        {...gameControlsStyles.wrapperAnimation}
        animate={gameControlsStyles.wrapperAnimation.animate(isVictoryAnimationActive)}
      >
        <div className="relative">
          {/* Toast messages container */}
          <div className={gameControlsStyles.toastContainer}>
            {/* Duplicate guess toast */}
            <div id="duplicate-error" className={gameControlsStyles.duplicateToast}>
              You've already tried that guess. Try something else!
            </div>

            {/* Wrong guess toast */}
            <div id="wrong-guess-toast" className={gameControlsStyles.wrongGuessToast}>
              Wrong answer! Try again.
            </div>

            {/* Skip message toast */}
            <div id="skip-message" className={gameControlsStyles.skipToast}>
              Skipped! Reveal another clue.
            </div>
          </div>
          
          <div className={gameControlsStyles.controlsArea}>
            <div id="facts-area" className={gameControlsStyles.factsArea}>
              <div className="relative">
                <Timer seconds={timeRemaining} />
              </div>

              <div className={gameControlsStyles.inputContainer}>
                <div className="relative">
                  <form onSubmit={handleSubmit}>
                    <input
                      id="game-input"
                      ref={inputRef}
                      placeholder={getInputPlaceholder()}
                      className={gameControlsStyles.input(isInputDisabled())}
                      style={{
                        "--theme-color": `var(--color-${colors.primary})`
                      } as React.CSSProperties}
                      disabled={isInputDisabled()}
                      autoComplete="off"
                    />
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
                <motion.button 
                  className={gameControlsStyles.controlButton}
                  {...(isSkipDisabled() ? gameControlsStyles.disabledButtonAnimation : gameControlsStyles.buttonAnimation)}
                  style={{ 
                    color: `var(--color-${colors.primary})`,
                    opacity: isSkipDisabled() ? 0.5 : 1,
                    cursor: isSkipDisabled() ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleSkip}
                  disabled={isSkipDisabled()}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default GameControls; 