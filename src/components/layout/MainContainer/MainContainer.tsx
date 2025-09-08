'use client';

import React from 'react';
import { useMainContainer } from './hooks';
import styles from './MainContainer.module.css';
import { 
  FactCard, 
  LoadingAnimation, 
  WrongAnswerOverlay,
  LanguageSwitchLoader
} from '@/components';
import GameContentRenderer from '../GameContentRenderer';
import { getHeaderComponent } from './helpers';
import { useGameStore } from '@/store/gameStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWrongAnswerOverlay } from '../../ui/WrongAnswerOverlay/useWrongAnswerOverlay';
import { useScreenSizeValidation } from '@/hooks/ui/useScreenSizeValidation';
import ScreenSizeWarning from '../../ui/ScreenSizeWarning';

export default function MainContainer() {
  const {
    gameState,
    viewingFact,
    loadingComplete,
    headerEntranceComplete,
    gameEntranceComplete,
    isTabletLandscape,
    isFinalFiveActive,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    showGameMessage,
    isVictoryAnimationActive,
    isAlreadyPlayedScenario,
    gameControlsRef,
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive,
    breakpoint,
    isNarrow,
    fadeInAnimation,
    responsiveLayoutClass,
    smartScalingStyle,
    needsMobileLayout
  } = useMainContainer();
  
  const { isLanguageSwitching } = useLanguage();
  const wrongAnswerOverlay = useWrongAnswerOverlay({ maxGuesses: 5 });
  const { isScreenTooSmall, isActualMobileDevice } = useScreenSizeValidation(isNarrow);
  
  // CONDITIONAL RENDERING WITH EARLY RETURN (AFTER ALL HOOKS)
  if (isScreenTooSmall) {
    return <ScreenSizeWarning isMobile={isActualMobileDevice} />;
  }

  return (
    <div className={isTabletLandscape ? styles.tabletLandscapeContainer : styles.container}>
      {!loadingComplete ? (
        <div className={styles.loadingWrapper}>
          <LoadingAnimation 
            finalCategory={gameState.challenge?.category || "Please wait..."} 
            onComplete={handleLoadingComplete}
            isChallengeFetched={!!gameState.challenge}
          />
        </div>
      ) : (
        <>
          {getHeaderComponent({
            breakpoint,
            headerEntranceComplete
          })}

          <main 
            className={`${isTabletLandscape ? styles.tabletLandscapeMain : styles.main} ${responsiveLayoutClass}`}
            style={smartScalingStyle}
          >
            <GameContentRenderer
              gameState={gameState}
              gameEntranceComplete={gameEntranceComplete}
              showGameMessage={showGameMessage}
              getGameMessageProps={getGameMessageProps}
              isFinalFiveActive={isFinalFiveActive}
              isAlreadyPlayedScenario={isAlreadyPlayedScenario}
              isVictoryAnimationActive={isVictoryAnimationActive}
              gameControlsRef={gameControlsRef}
              showFinalFiveTransition={showFinalFiveTransition}
              finalFiveTransitionReason={finalFiveTransitionReason}
              startFinalFive={startFinalFive}
              needsMobileLayout={needsMobileLayout}
              isTabletLandscape={isTabletLandscape}
              fadeInAnimation={fadeInAnimation}
            />
          </main>
          
          {/* Viewing card from the stack */}
          {viewingFact !== null && gameState.challenge && (
            <>
              <FactCard
                fact={gameState.challenge.facts[viewingFact]}
                visibleStackCount={gameState.revealedFacts.length}
              />
            </>
          )}
          
          {/* Wrong Answer Overlay */}
          <WrongAnswerOverlay
            isVisible={wrongAnswerOverlay.isVisible}
            wrongGuessCount={wrongAnswerOverlay.wrongGuessCount}
            maxGuesses={wrongAnswerOverlay.maxGuesses}
            onAnimationComplete={wrongAnswerOverlay.onAnimationComplete}
          />
          
          {/* Language Switch Loader */}
          <LanguageSwitchLoader isVisible={isLanguageSwitching} />
        </>
      )}
    </div>
  );
} 