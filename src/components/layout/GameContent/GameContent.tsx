'use client';

import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FactCardStackContainer, 
  FactBubbleGrid, 
  GameControls, 
  EndGameMessage, 
  BubbleContextArea, 
  GameInstructionsArea 
} from '@/components';
import DropZoneIndicator from '../../cards/DropZoneIndicator';
import { useDragState } from '@/hooks/ui/useDragState';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { GameState, GameOutcome } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import styles from './GameContent.module.css';
import { gameContentStyles } from './GameContent.styles';

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
  gameControlsRef: React.RefObject<any>;
}

const GameContent: React.FC<GameContentProps> = ({
  gameState,
  gameEntranceComplete,
  showGameMessage,
  getGameMessageProps,
  isFinalFiveActive,
  isAlreadyPlayedScenario,
  isVictoryAnimationActive,
  gameControlsRef
}) => {
  const { colors } = useTheme();
  const isDragging = useDragState(state => state.isDragging);
  const isTutorialOpen = useGameStore(state => state.isTutorialOpen);
  const { registerElement, unregisterElement } = useDOMRefs();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Register the drop zone as the drop target when dragging (but not during tutorial)
  useEffect(() => {
    if (isDragging && !isTutorialOpen && dropZoneRef.current) {
      registerElement('fact-card-stack-container', dropZoneRef.current);
    }
    return () => {
      if (isDragging && !isTutorialOpen) {
        unregisterElement('fact-card-stack-container');
      }
    };
  }, [isDragging, isTutorialOpen, registerElement, unregisterElement]);

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
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DropZoneIndicator isVisible={true} />
          </div>
        )}
        
        {/* Card Stack Section */}
        {!isAlreadyPlayedScenario && (
          <motion.div 
            className={styles.cardSection}
            {...gameContentStyles.gameEntranceAnimation.cardStack}
            animate={gameEntranceComplete ? 
              gameContentStyles.gameEntranceAnimation.cardStack.animate : 
              gameContentStyles.gameEntranceAnimation.cardStack.initial
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
          {...gameContentStyles.gameEntranceAnimation.middleSection}
          animate={gameEntranceComplete ? 
            gameContentStyles.gameEntranceAnimation.middleSection.animate : 
            gameContentStyles.gameEntranceAnimation.middleSection.initial
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
                    {!isAlreadyPlayedScenario && !isVictoryAnimationActive && (
                      <div className={styles.bubbleContextArea}>
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
          {...gameContentStyles.gameEntranceAnimation.bottomSection}
          animate={gameEntranceComplete ? 
            gameContentStyles.gameEntranceAnimation.bottomSection.animate : 
            gameContentStyles.gameEntranceAnimation.bottomSection.initial
          }
        >
          {/* Game instructions - hide for already-played scenarios and during victory animation */}
          {!isFinalFiveActive && !isAlreadyPlayedScenario && !isVictoryAnimationActive && (
            <div className={styles.instructionsWrapper}>
              <div className={styles.instructionsContainer}>
                <GameInstructionsArea />
              </div>
            </div>
          )}

          {/* Game Controls - hide for already-played scenarios and during victory animation */}
          {!showGameMessage && !isFinalFiveActive && !isAlreadyPlayedScenario && !isVictoryAnimationActive && (
            <div className={styles.gameControlsWrapper}>
              <GameControls ref={gameControlsRef} />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameContent;