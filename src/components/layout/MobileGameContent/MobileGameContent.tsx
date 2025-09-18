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
import { GameState, GameOutcome } from '@/types';
import DropZoneIndicator from '@/components/cards/DropZoneIndicator';
import styles from './MobileGameContent.module.css';
import { shouldShowContextLine, shouldShowGameInstructions, shouldShowGameControls } from '@/utils/layout';
import { useMobileGameContent } from './hooks';
import { GameControlsHandle } from '@/components/game/GameControls/hooks';

interface MobileGameContentProps {
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
  isTabletLandscape: boolean;
  gameControlsRef: React.RefObject<GameControlsHandle | null>;
}

const MobileGameContent: React.FC<MobileGameContentProps> = React.memo(({
  gameState,
  gameEntranceComplete,
  showGameMessage,
  getGameMessageProps,
  isFinalFiveActive,
  isAlreadyPlayedScenario,
  isVictoryAnimationActive,
  isTabletLandscape,
  gameControlsRef
}) => {
  const {
    isDragging,
    dropZoneRef,
    animations,
    contextLineBackgroundStyle,
    dropZoneOverlayStyles
  } = useMobileGameContent({
    gameState,
    gameEntranceComplete,
    showGameMessage,
    getGameMessageProps,
    isFinalFiveActive,
    isAlreadyPlayedScenario,
    isVictoryAnimationActive,
    isTabletLandscape,
    gameControlsRef
  });

  return (
    <motion.div
      key="mobile-game-content"
      className={`${styles.container} ${isTabletLandscape ? 'py-0 gap-0' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: gameEntranceComplete ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top section - hide for already-played scenarios */}
      {!isAlreadyPlayedScenario && (
        <motion.div 
          className={styles.topSection}
          {...animations.cardStack}
          animate={gameEntranceComplete ? 
            animations.cardStack.animate : 
            animations.cardStack.initial
          }
          style={{ position: 'relative' }}
        >
          {/* Always show the FactCardStackContainer */}
          <FactCardStackContainer />
          
          {/* DropZone Indicator overlay for mobile - covers full card area */}
          {isDragging && (
            <div 
              ref={dropZoneRef}
              className={styles.dropZoneOverlay}
              style={dropZoneOverlayStyles}
            >
              <DropZoneIndicator isVisible={true} />
            </div>
          )}
        </motion.div>
      )}
      
      {/* Middle section */}
      <div className={`${styles.middleSection} ${styles.sectionGap} ${isTabletLandscape ? 'py-0' : ''}`}>
        {/* Context line - hide for already-played scenarios and during victory animation */}
        {shouldShowContextLine(isAlreadyPlayedScenario, isVictoryAnimationActive) && (
          <motion.div 
            className={styles.contextLine}
            {...animations.topSection}
            animate={gameEntranceComplete ? 
              animations.topSection.animate : 
              animations.topSection.initial
            }
          >
            <div 
              style={contextLineBackgroundStyle} 
              className="absolute inset-x-0 h-1"
            />
            <div className={styles.contextWrapper}>
              <div className={styles.bubbleContextContainer}>
                <BubbleContextArea />
              </div>
            </div>
          </motion.div>
        )}

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
                  <FactBubbleGrid />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Bottom section */}
      <motion.div 
        className={`${styles.bottomSection} ${isTabletLandscape ? 'mt-8' : ''}`}
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
              <div className={styles.instructionsInner}>
                <GameInstructionsArea />
              </div>
            </div>
          </div>
        )}

        {/* Game Controls - hide for already-played scenarios and during victory animation */}
        {shouldShowGameControls(showGameMessage, isFinalFiveActive, isAlreadyPlayedScenario, isVictoryAnimationActive) && (
          <div className={`${styles.controlsWrapper} ${isTabletLandscape ? 'mb-12' : ''}`}>
            <GameControls ref={gameControlsRef} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

MobileGameContent.displayName = 'MobileGameContent';

export default MobileGameContent;