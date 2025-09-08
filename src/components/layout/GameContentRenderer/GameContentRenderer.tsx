import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FinalFiveModal, FinalFiveIntro } from '@/components';
import GameContent from '../GameContent';
import MobileGameContent from '../MobileGameContent';
import { GameState, GameOutcome } from '@/types';
import type { GameControlsHandle } from '../../game/GameControls';
import styles from './GameContentRenderer.module.css';
import { useGameContentRenderer } from './hooks';

interface GameContentRendererProps {
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
  showFinalFiveTransition: boolean;
  finalFiveTransitionReason: 'time' | 'guesses' | null;
  startFinalFive: () => void;
  needsMobileLayout: boolean;
  isTabletLandscape: boolean;
  fadeInAnimation: {
    initial: { opacity: number };
    animate: { opacity: number };
    transition: { duration: number; delay: number };
  };
}

/**
 * GameContentRenderer - Handles all game content rendering logic
 * 
 * Manages:
 * - Final Five transition overlay with animations
 * - Conditional desktop vs mobile layout rendering
 * - Final Five modal display
 * - Complex prop coordination between game components
 */
const GameContentRenderer: React.FC<GameContentRendererProps> = React.memo(({
  gameState,
  gameEntranceComplete,
  showGameMessage,
  getGameMessageProps,
  isFinalFiveActive,
  isAlreadyPlayedScenario,
  isVictoryAnimationActive,
  gameControlsRef,
  showFinalFiveTransition,
  finalFiveTransitionReason,
  startFinalFive,
  needsMobileLayout,
  isTabletLandscape,
  fadeInAnimation
}) => {
  const {
    shouldRender
  } = useGameContentRenderer({
    gameState,
    gameEntranceComplete,
    showGameMessage,
    getGameMessageProps,
    isFinalFiveActive,
    isAlreadyPlayedScenario,
    isVictoryAnimationActive,
    gameControlsRef,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    startFinalFive,
    needsMobileLayout,
    isTabletLandscape,
    fadeInAnimation
  });

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {/* Final Five Transition Container - Absolute overlay */}
      <AnimatePresence>
        {showFinalFiveTransition && (
          <motion.div
            key="final-five-transition"
            className={styles.finalFiveTransition}
            {...fadeInAnimation}
          >
            <FinalFiveIntro 
              reason={finalFiveTransitionReason || 'guesses'} 
              onStart={startFinalFive}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main game content - conditional layout */}
      <AnimatePresence>
        {!showFinalFiveTransition && (
          <>
            {!needsMobileLayout ? (
              // Desktop layout
              <GameContent
                gameState={gameState}
                gameEntranceComplete={gameEntranceComplete}
                showGameMessage={showGameMessage}
                getGameMessageProps={getGameMessageProps}
                isFinalFiveActive={isFinalFiveActive}
                isAlreadyPlayedScenario={isAlreadyPlayedScenario}
                isVictoryAnimationActive={isVictoryAnimationActive}
                gameControlsRef={gameControlsRef}
              />
            ) : (
              // Mobile layout
              <MobileGameContent
                gameState={gameState}
                gameEntranceComplete={gameEntranceComplete}
                showGameMessage={showGameMessage}
                getGameMessageProps={getGameMessageProps}
                isFinalFiveActive={isFinalFiveActive}
                isAlreadyPlayedScenario={isAlreadyPlayedScenario}
                isVictoryAnimationActive={isVictoryAnimationActive}
                isTabletLandscape={isTabletLandscape}
                gameControlsRef={gameControlsRef}
              />
            )}
          </>
        )}
      </AnimatePresence>
      
      {/* Final Five Modal */}
      {isFinalFiveActive && <FinalFiveModal />}
    </>
  );
});

GameContentRenderer.displayName = 'GameContentRenderer';

export default GameContentRenderer;