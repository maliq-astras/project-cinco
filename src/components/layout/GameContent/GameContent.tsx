'use client';

import React, { useRef, useEffect } from 'react';
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
import { useDragState } from '@/hooks/ui/useDragState';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { GameState, GameOutcome } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import styles from './GameContent.module.css';
import { ANIMATIONS } from '@/constants/animations';
import { shouldShowContextLine, shouldShowGameInstructions, shouldShowGameControls } from '@/utils/layout';

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
  const { colors } = useTheme();
  const isDragging = useDragState(state => state.isDragging);
  const isTutorialOpen = useGameStore(state => state.isTutorialOpen);
  const { registerElement, unregisterElement } = useDOMRefs();
  const { responsiveValues } = useResponsive();
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic spacing for bubble context area based on bubble size
  const bubbleContextSpacing = responsiveValues.bubbleSize * 0.5; // 50% of bubble size for appropriate spacing
  
  // Animation configurations
  const animations = {
    cardStack: ANIMATIONS.CARD_STACK,
    middleSection: ANIMATIONS.MIDDLE_SECTION,
    bottomSection: ANIMATIONS.BOTTOM_SECTION
  };
  
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
                        style={{
                          bottom: `-${bubbleContextSpacing}px`
                        }}
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

          {/* Game Controls - hide for already-played scenarios and during victory animation */}
          {shouldShowGameControls(showGameMessage, isFinalFiveActive, isAlreadyPlayedScenario, isVictoryAnimationActive) && (
            <div className={styles.gameControlsWrapper}>
              <GameControls ref={gameControlsRef} />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

GameContent.displayName = 'GameContent';

export default GameContent;