import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import Timer from '../../ui/Timer';
import InputBar from '../InputBar';
import GameButtons from '../GameButtons';
import ToastMessages from '../../ui/ToastMessages';
import { useGameControls, GameControlsHandle } from './hooks';
import { getWrapperAnimationProps, getResponsiveContainerStyle } from './helpers';
import styles from './GameControls.module.css';
import { useGameStore } from '@/store/gameStore';

const GameControls = forwardRef<GameControlsHandle>((_, ref) => {
  const {
    inputBarRef,
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
    isTouchDevice,
    duplicateErrorRef,
    skipMessageRef,
    responsiveValues,
  } = useGameControls(ref);

  const gameState = useGameStore(state => state.gameState);
  const isAutocompleteEnabled = useGameStore(state => state.isAutocompleteEnabled);
  const setHasUserInput = useGameStore(state => state.setHasUserInput);
  const [hasSuggestionSelected, setHasSuggestionSelected] = useState(false);

  return (
    <div id="game-controls" className={styles.container} style={getResponsiveContainerStyle(responsiveValues)}>
      <motion.div
        className={styles.wrapper}
        {...getWrapperAnimationProps(isVictoryAnimationActive)}
      >
        <div className="relative">
          <ToastMessages 
            duplicateErrorRef={duplicateErrorRef}
            skipMessageRef={skipMessageRef}
          />
          
          <div className={styles.controlsArea}>
            <div id="facts-area" className={styles.factsArea}>
              <div className="relative">
                <Timer seconds={timeRemaining} />
              </div>

              <InputBar
                ref={inputBarRef}
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSubmit={handleSubmit}
                isInputDisabled={isInputDisabled}
                colors={colors}
                hasSuggestionSelected={hasSuggestionSelected}
                setHasSuggestionSelected={setHasSuggestionSelected}
                gameState={gameState}
                isAutocompleteEnabled={isAutocompleteEnabled}
                setHasUserInput={setHasUserInput}
              />

              <GameButtons
                colors={colors}
                isSkipDisabled={isSkipDisabled}
                handleSkip={handleSkip}
                isSkipConfirmActive={isSkipConfirmActive}
                isTouchDevice={isTouchDevice}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls; 