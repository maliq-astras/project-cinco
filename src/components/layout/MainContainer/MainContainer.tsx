'use client';

import React, { CSSProperties, useMemo, useCallback } from 'react';
import { useMainContainer } from './useMainContainer';
import styles from './MainContainer.module.css';
import { 
  FactCard, 
  LoadingAnimation, 
  WrongAnswerOverlay,
  LanguageSwitchLoader
} from '@/components';
import GameContentRenderer from '../GameContentRenderer';
import { getHeaderComponent, getResponsiveLayoutClass, getSmartScalingStyle } from './helpers';
import { useGameStore } from '@/store/gameStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWrongAnswerOverlay } from '../../ui/WrongAnswerOverlay/useWrongAnswerOverlay';
import { useScreenSizeValidation } from '@/hooks/ui/useScreenSizeValidation';
import ScreenSizeWarning from '../../ui/ScreenSizeWarning';
import { ANIMATIONS } from '@/constants/animations';

export default function MainContainer() {
  // Animation objects
  const fadeInAnimation = useMemo(() => ANIMATIONS.FADE_IN, []);
  const {
    gameState,
    viewingFact,
    loadingComplete,
    headerEntranceComplete,
    gameEntranceComplete,
    isTabletLandscape,
    responsiveLayoutMode,
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
    isNarrow
  } = useMainContainer();
  
  // Get responsive layout mode from the store
  const scaleFactor = useGameStore(state => state.scaleFactor); // Keep for backward compatibility
  
  // Language switching state
  const { isLanguageSwitching } = useLanguage();
  
  // Wrong answer overlay hook
  const wrongAnswerOverlay = useWrongAnswerOverlay({ maxGuesses: 5 });
  
  // Screen size validation hook
  const { isScreenTooSmall, isActualMobileDevice } = useScreenSizeValidation(isNarrow);
  
  // Layout determination
  const needsMobileLayout = isNarrow;
  
  // Early return for screen size warning
  if (isScreenTooSmall) {
    return <ScreenSizeWarning isMobile={isActualMobileDevice} />;
  }

  // Memoized layout utilities
  const responsiveLayoutClass = useMemo(() => 
    getResponsiveLayoutClass(isTabletLandscape, responsiveLayoutMode),
    [isTabletLandscape, responsiveLayoutMode]
  );

  const smartScalingStyle = useMemo(() =>
    getSmartScalingStyle(isTabletLandscape, scaleFactor),
    [isTabletLandscape, scaleFactor]
  );

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