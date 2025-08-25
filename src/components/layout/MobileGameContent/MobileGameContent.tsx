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
import { GameState, GameOutcome } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useDragState } from '@/hooks/ui/useDragState';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import DropZoneIndicator from '../../cards/DropZoneIndicator';
import styles from './MobileGameContent.module.css';
import { mobileGameContentStyles } from './MobileGameContent.styles';

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
  gameControlsRef: React.RefObject<any>;
}

const MobileGameContent: React.FC<MobileGameContentProps> = ({
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
  const { colors } = useTheme();
  const isDragging = useDragState(state => state.isDragging);
  const { registerElement, unregisterElement } = useDOMRefs();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Register the drop zone as the drop target when dragging in mobile layout
  useEffect(() => {
    if (isDragging && dropZoneRef.current) {
      registerElement('fact-card-stack-container', dropZoneRef.current);
    }
    return () => {
      if (isDragging) {
        unregisterElement('fact-card-stack-container');
      }
    };
  }, [isDragging, registerElement, unregisterElement]);

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
          {...mobileGameContentStyles.gameEntranceAnimation.cardStack}
          animate={gameEntranceComplete ? 
            mobileGameContentStyles.gameEntranceAnimation.cardStack.animate : 
            mobileGameContentStyles.gameEntranceAnimation.cardStack.initial
          }
          style={{ position: 'relative' }}
        >
          {/* Always show the FactCardStackContainer */}
          <FactCardStackContainer />
          
          {/* DropZone Indicator overlay for mobile - constrained to card area only */}
          {isDragging && (
            <div 
              ref={dropZoneRef}
              className={styles.dropZoneOverlay}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '200px', // Fixed height to not overflow into other sections
                maxHeight: '100%', // Don't exceed the top section height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '0.5rem'
              }}
            >
              <DropZoneIndicator isVisible={true} />
            </div>
          )}
        </motion.div>
      )}
      
      {/* Middle section */}
      <div className={`${styles.middleSection} ${isTabletLandscape ? 'py-0' : ''}`} style={mobileGameContentStyles.sectionGap}>
        {/* Context line - hide for already-played scenarios and during victory animation */}
        {!isAlreadyPlayedScenario && !isVictoryAnimationActive && (
          <motion.div 
            className={styles.contextLine}
            {...mobileGameContentStyles.gameEntranceAnimation.topSection}
            animate={gameEntranceComplete ? 
              mobileGameContentStyles.gameEntranceAnimation.topSection.animate : 
              mobileGameContentStyles.gameEntranceAnimation.topSection.initial
            }
          >
            <div 
              style={mobileGameContentStyles.contextLineBackground(colors.primary)} 
              className="absolute inset-x-0 h-1"
            />
            <div className={styles.contextWrapper}>
              <div className={styles.contextContainer}>
                <BubbleContextArea />
              </div>
            </div>
          </motion.div>
        )}

        {/* Fact Bubbles Area */}
        <motion.div 
          className={styles.factBubblesWrapper}
          {...mobileGameContentStyles.gameEntranceAnimation.middleSection}
          animate={gameEntranceComplete ? 
            mobileGameContentStyles.gameEntranceAnimation.middleSection.animate : 
            mobileGameContentStyles.gameEntranceAnimation.middleSection.initial
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
        {...mobileGameContentStyles.gameEntranceAnimation.bottomSection}
        animate={gameEntranceComplete ? 
          mobileGameContentStyles.gameEntranceAnimation.bottomSection.animate : 
          mobileGameContentStyles.gameEntranceAnimation.bottomSection.initial
        }
      >
        {/* Game instructions - hide for already-played scenarios and during victory animation */}
        {!isFinalFiveActive && !isAlreadyPlayedScenario && !isVictoryAnimationActive && (
          <div className={styles.instructionsWrapper}>
            <div className={styles.instructionsContainer}>
              <div className={styles.instructionsInner}>
                <GameInstructionsArea />
              </div>
            </div>
          </div>
        )}

        {/* Game Controls - hide for already-played scenarios and during victory animation */}
        {!showGameMessage && !isFinalFiveActive && !isAlreadyPlayedScenario && !isVictoryAnimationActive && (
          <div className={`${styles.controlsWrapper} ${isTabletLandscape ? 'mb-12' : ''}`}>
            <GameControls ref={gameControlsRef} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MobileGameContent;