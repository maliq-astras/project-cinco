'use client';

import React, { CSSProperties, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMainContainer } from './useMainContainer';
import { mainContainerStyles } from './MainContainer.styles';
import { 
  FactCard, 
  FinalFiveModal, 
  Header, 
  FactCardStackContainer, 
  FactBubbleGrid, 
  GameControls, 
  LoadingAnimation, 
  EndGameMessage, 
  BubbleContextArea, 
  GameInstructionsArea, 
  Navigation, 
  FinalFiveIntro,
  WrongAnswerOverlay,
  LanguageSwitchLoader
} from '@/components';
import CompactHeader from '../CompactHeader';
import GameContent from '../GameContent';
import MobileGameContent from '../MobileGameContent';
import { useGameStore } from '@/store/gameStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWrongAnswerOverlay } from '../../ui/WrongAnswerOverlay/useWrongAnswerOverlay';
import ScreenSizeWarning from '../../ui/ScreenSizeWarning';
import { isMobileDevice, isScreenTooSmall } from '@/helpers/deviceDetection';

export default function MainContainer() {
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
    colors,
    showGameMessage,
    isVictoryAnimationActive,
    isAlreadyPlayedScenario,
    gameControlsRef,
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive,
    breakpoint,
    layoutMode,
    isNarrow,
    isLandscape
  } = useMainContainer();
  
  // Get responsive layout mode from the store
  const scaleFactor = useGameStore(state => state.scaleFactor); // Keep for backward compatibility
  
  // Language switching state
  const { isLanguageSwitching } = useLanguage();
  
  // Wrong answer overlay hook
  const wrongAnswerOverlay = useWrongAnswerOverlay({ maxGuesses: 5 });
  
  // Get current screen dimensions for size checks
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Determine actual device type and layout needs
  const isActualMobileDevice = isMobileDevice();
  const needsMobileLayout = isNarrow;
  
  // Check if screen is too small (only after dimensions are initialized)
  const screenTooSmall = screenDimensions.width > 0 && screenDimensions.height > 0 && 
    isScreenTooSmall(screenDimensions.width, screenDimensions.height, isActualMobileDevice, needsMobileLayout);
  
  // Screen size warning takes priority
  if (screenTooSmall) {
    return <ScreenSizeWarning isMobile={isActualMobileDevice} />;
  }

  // Create responsive layout classes and smart scaling for no-scroll experience
  const getResponsiveLayoutClasses = () => {
    if (!isTabletLandscape) return '';
    
    switch (responsiveLayoutMode) {
      case 'compact':
        return 'layout-compact';
      case 'spacious':
        return 'layout-spacious';
      default:
        return 'layout-normal';
    }
  };

  // Create smart scaling style only when needed for no-scroll experience
  const getSmartScalingStyle = (): CSSProperties => {
    if (!isTabletLandscape || scaleFactor >= 0.99) {
      return {}; // No scaling needed
    }
    
    return {
      transform: `scale(${scaleFactor})`,
      transformOrigin: 'center top',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      overflow: 'visible'
    };
  };

  return (
    <div className={isTabletLandscape ? mainContainerStyles.tabletLandscapeContainer : mainContainerStyles.container}>
      {!loadingComplete ? (
        <div className={mainContainerStyles.loadingWrapper}>
          <LoadingAnimation 
            finalCategory={gameState.challenge?.category || "Please wait..."} 
            onComplete={handleLoadingComplete}
            isChallengeFetched={!!gameState.challenge}
          />
        </div>
      ) : (
        <>
          {/* Use CompactHeader for limited vertical space, regular Header+Navigation otherwise */}
          {breakpoint === 'xs' || breakpoint === 'sm' || (breakpoint === 'md' && isLandscape) || (screenDimensions.width < 900 && screenDimensions.height < 1051) ? (
            <CompactHeader headerEntranceComplete={headerEntranceComplete} />
          ) : (
            <>
              <Navigation headerEntranceComplete={headerEntranceComplete} />
              <Header headerEntranceComplete={headerEntranceComplete} />
            </>
          )}

          <main 
            className={`${isTabletLandscape ? mainContainerStyles.tabletLandscapeMain : mainContainerStyles.main} ${getResponsiveLayoutClasses()}`}
            style={getSmartScalingStyle()}
          >
            {gameState.challenge && (
              <>
                {/* Final Five Transition Container - Absolute overlay */}
                <AnimatePresence>
                  {showFinalFiveTransition && (
                    <motion.div
                      key="final-five-transition"
                      className="absolute inset-0 flex items-center justify-center z-10"
                      {...mainContainerStyles.fadeIn}
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
            )}
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