import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import Timer from '../../ui/Timer';
import InputBar, { InputBarHandle } from '../InputBar';
import GameButtons from '../GameButtons';
import ToastMessages from '../../ui/ToastMessages';
import { useGameControls, GameControlsHandle } from './useGameControls';
import { gameControlsStyles } from './GameControls.styles';
import { useGameStore } from '@/store/gameStore';

const GameControls = forwardRef<GameControlsHandle, {}>((props, ref) => {
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
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait
  } = useGameControls(ref);

  const gameState = useGameStore(state => state.gameState);
  const isAutocompleteEnabled = useGameStore(state => state.isAutocompleteEnabled);
  const setHasUserInput = useGameStore(state => state.setHasUserInput);
  const [hasSuggestionSelected, setHasSuggestionSelected] = useState(false);

  // Create responsive container style
  const responsiveContainerStyle = {
    padding: `0 ${responsiveValues.spacing}px`,
    paddingTop: `${responsiveValues.spacing}px`,
    paddingBottom: `${responsiveValues.spacing}px`
  };

  return (
    <div id="game-controls" className={gameControlsStyles.container} style={responsiveContainerStyle}>
      <motion.div
        className={gameControlsStyles.wrapper}
        {...gameControlsStyles.wrapperAnimation}
        animate={gameControlsStyles.wrapperAnimation.animate(isVictoryAnimationActive)}
      >
        <div className="relative">
          {/* Toast messages */}
          <ToastMessages 
            duplicateErrorRef={duplicateErrorRef}
            skipMessageRef={skipMessageRef}
          />
          
          <div className={gameControlsStyles.controlsArea}>
            <div id="facts-area" className={gameControlsStyles.factsArea}>
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

export default GameControls; 