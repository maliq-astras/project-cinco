'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FactCardStackContainer, 
  FactBubbleGrid, 
  GameControls, 
  EndGameMessage, 
  BubbleContextArea, 
  GameInstructionsArea 
} from '@/components';
import DropZoneIndicator from '../../cards/DropZoneIndicator';
import { GameState, GameOutcome } from '@/types';
import type { GameControlsHandle } from '../../game/GameControls';
import { shouldShowContextLine, shouldShowGameInstructions, shouldShowGameControls } from '@/utils/layout';
import styles from './GameContent.module.css';
import { useGameContent } from './hooks';
import { getDropZoneOverlayStyles, getBubbleContextAreaStyles } from './helpers';

interface GameContentProps {
  gameState: GameState;
  gameEntranceComplete: boolean;
  showGameMessage: boolean;
  getGameMessageProps: () => {
    outcome: GameOutcome;
    correctAnswer: string;
    numberOfTries: number;
    timeSpent: number;
  };
  isFinalFiveActive: boolean;
  isAlreadyPlayedScenario: boolean;
  isVictoryAnimationActive: boolean;
  gameControlsRef: React.RefObject<GameControlsHandle | null>;
}

const GameContent: React.FC<GameContentProps> = React.memo(({
  gameState,
  gameEntranceComplete,
  showGameMessage,
  getGameMessageProps,
  isFinalFiveActive,
  isAlreadyPlayedScenario,
  isVictoryAnimationActive,
  gameControlsRef
}) => {
  const {
    isDragging,
    isTutorialOpen,
    dropZoneRef,
    bubbleContextSpacing,
    animations
  } = useGameContent({
    gameState,
    gameEntranceComplete,
    showGameMessage,
    getGameMessageProps,
    isFinalFiveActive,
    isAlreadyPlayedScenario,
    isVictoryAnimationActive,
    gameControlsRef
  });

  return (
    <motion.div
      key="wide-game-content"
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: gameEntranceComplete ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cards Panel - Left side */}
      <div className={styles.cardsPanel}>
        {/* DropZone Indicator - covers entire cards panel when dragging (but not during tutorial) */}
        {isDragging && !isTutorialOpen && (
          <div 
            ref={dropZoneRef}
            className={styles.dropZoneOverlay}
            style={getDropZoneOverlayStyles()}
          >
            <DropZoneIndicator isVisible={true} />
          </div>
        )}
        
        {/* Card Stack Section */}
        {!isAlreadyPlayedScenario && (
          <motion.div 
            className={styles.cardSection}
            {...animations.cardStack}
            animate={gameEntranceComplete ? 
              animations.cardStack.animate : 
              animations.cardStack.initial
            }
          >
            <FactCardStackContainer />
          </motion.div>
        )}
      </div>

      {/* Bubbles Panel - Right side */}
      <div className={styles.bubblesPanel}>
        {/* Fact Bubbles Area */}
        <motion.div 
          className={styles.factBubblesWrapper}
          {...animations.middleSection}
          animate={gameEntranceComplete ? 
            animations.middleSection.animate : 
            animations.middleSection.initial
          }
        >
          <div className={styles.factBubblesContainer}>
            {!isFinalFiveActive && (
              <div className="relative">
                {showGameMessage ? (
                  <EndGameMessage {...getGameMessageProps()} />
                ) : (
                  <>
                    <FactBubbleGrid />
                    {/* Bubble Context Area - moved inside bubble container */}
                    {shouldShowContextLine(isAlreadyPlayedScenario, isVictoryAnimationActive) && (
                      <div 
                        className={styles.bubbleContextArea}
                        style={getBubbleContextAreaStyles(bubbleContextSpacing)}
                      >
                        <BubbleContextArea />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Controls Panel - Bottom spanning full width */}
      <div className={styles.controlsPanel}>
        <motion.div 
          className="w-full"
          {...animations.bottomSection}
          animate={gameEntranceComplete ? 
            animations.bottomSection.animate : 
            animations.bottomSection.initial
          }
        >
          {/* Game instructions - hide for already-played scenarios and during victory animation */}
          {shouldShowGameInstructions(isFinalFiveActive, isAlreadyPlayedScenario, isVictoryAnimationActive) && (
            <div className={styles.instructionsWrapper}>
              <div className={styles.instructionsContainer}>
                <GameInstructionsArea />
              </div>
            </div>
          )}

          {/* Game Controls - maintain space even when hidden to prevent layout shift */}
          <div className={styles.gameControlsWrapper}>
            {shouldShowGameControls(showGameMessage, isFinalFiveActive, isAlreadyPlayedScenario, isVictoryAnimationActive) ? (
              <GameControls ref={gameControlsRef} />
            ) : (
              <div style={{ height: 'var(--game-controls-height, 200px)', visibility: 'hidden' }}>
                <GameControls ref={gameControlsRef} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

GameContent.displayName = 'GameContent';

export default GameContent;