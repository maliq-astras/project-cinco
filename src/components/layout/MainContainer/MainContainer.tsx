'use client';

import React, { CSSProperties } from 'react';
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
import { useGameStore } from '@/store/gameStore';
import { useLanguage } from '@/contexts/LanguageContext';
import LandscapeWarning from '../../layout/LandscapeWarning';
import { useWrongAnswerOverlay } from '../../ui/WrongAnswerOverlay/useWrongAnswerOverlay';

export default function MainContainer() {
  const {
    gameState,
    viewingFact,
    loadingComplete,
    headerEntranceComplete,
    gameEntranceComplete,
    isSmallLandscape,
    isTabletLandscape,
    responsiveLayoutMode,
    isFinalFiveActive,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    colors,
    showGameMessage,
    isAlreadyPlayedScenario,
    gameControlsRef,
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive
  } = useMainContainer();
  
  // Get responsive layout mode from the store
  const scaleFactor = useGameStore(state => state.scaleFactor); // Keep for backward compatibility
  
  // Language switching state
  const { isLanguageSwitching } = useLanguage();
  
  // Wrong answer overlay hook
  const wrongAnswerOverlay = useWrongAnswerOverlay({ maxGuesses: 5 });
  
  // If in small landscape mode (phone), show a warning overlay
  if (isSmallLandscape) {
    return <LandscapeWarning context="game" />;
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
          <Navigation headerEntranceComplete={headerEntranceComplete} />
          <Header headerEntranceComplete={headerEntranceComplete} />

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

                {/* Main game content */}
                <AnimatePresence>
                  {!showFinalFiveTransition && (
                    <motion.div
                      key="game-content"
                      className={`${mainContainerStyles.gameContent} ${isTabletLandscape ? 'py-0 gap-0' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: gameEntranceComplete ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Top section - hide for already-played scenarios */}
                      {!isAlreadyPlayedScenario && (
                        <motion.div 
                          className={mainContainerStyles.topSection}
                          {...mainContainerStyles.gameEntranceAnimation.cardStack}
                          animate={gameEntranceComplete ? mainContainerStyles.gameEntranceAnimation.cardStack.animate : mainContainerStyles.gameEntranceAnimation.cardStack.initial}
                        >
                          <FactCardStackContainer />
                        </motion.div>
                      )}
                      
                      {/* Middle section */}
                      <div className={`${mainContainerStyles.middleSection} ${isTabletLandscape ? 'py-0' : ''}`} style={mainContainerStyles.sectionGap}>
                        {/* Context line - hide for already-played scenarios */}
                        {!isAlreadyPlayedScenario && (
                          <motion.div 
                            className={mainContainerStyles.contextLine}
                            {...mainContainerStyles.gameEntranceAnimation.topSection}
                            animate={gameEntranceComplete ? mainContainerStyles.gameEntranceAnimation.topSection.animate : mainContainerStyles.gameEntranceAnimation.topSection.initial}
                          >
                            <div style={mainContainerStyles.contextLineBackground(colors.primary)} className="absolute inset-x-0 h-1"></div>
                            <div className={mainContainerStyles.contextWrapper}>
                              <div className={mainContainerStyles.contextContainer}>
                                <BubbleContextArea />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Fact Bubbles Area */}
                        <motion.div 
                          className={mainContainerStyles.factBubblesWrapper}
                          {...mainContainerStyles.gameEntranceAnimation.middleSection}
                          animate={gameEntranceComplete ? mainContainerStyles.gameEntranceAnimation.middleSection.animate : mainContainerStyles.gameEntranceAnimation.middleSection.initial}
                        >
                          <div className={mainContainerStyles.factBubblesContainer}>
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
                        className={`${mainContainerStyles.bottomSection} ${isTabletLandscape ? 'mt-8' : ''}`}
                        {...mainContainerStyles.gameEntranceAnimation.bottomSection}
                        animate={gameEntranceComplete ? mainContainerStyles.gameEntranceAnimation.bottomSection.animate : mainContainerStyles.gameEntranceAnimation.bottomSection.initial}
                      >
                        {/* Game instructions - hide for already-played scenarios */}
                        {!isFinalFiveActive && !isAlreadyPlayedScenario && (
                          <div className={mainContainerStyles.instructionsWrapper}>
                            <div className={mainContainerStyles.instructionsContainer}>
                              <div className={mainContainerStyles.instructionsInner}>
                                <GameInstructionsArea />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Game Controls - hide for already-played scenarios */}
                        {!showGameMessage && !isFinalFiveActive && !isAlreadyPlayedScenario && (
                          <div className={`${mainContainerStyles.controlsWrapper} ${isTabletLandscape ? 'mb-12' : ''}`}>
                            <GameControls ref={gameControlsRef} />
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
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