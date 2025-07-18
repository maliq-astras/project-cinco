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
  WrongAnswerOverlay
} from '@/components';
import { useGameStore } from '@/store/gameStore';
import LandscapeWarning from '../../ui/LandscapeWarning';
import { useWrongAnswerOverlay } from '../../ui/WrongAnswerOverlay/useWrongAnswerOverlay';

export default function MainContainer() {
  const {
    gameState,
    viewingFact,
    loadingComplete,
    isSmallLandscape,
    isTabletLandscape,
    isCompactHeader,
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
  
  // Get scale factor from the store
  const scaleFactor = useGameStore(state => state.scaleFactor);
  
  // Wrong answer overlay hook
  const wrongAnswerOverlay = useWrongAnswerOverlay({ maxGuesses: 5 });
  
  // If in small landscape mode (phone), show a warning overlay
  if (isSmallLandscape) {
    return <LandscapeWarning context="game" />;
  }

  // Create scaling style for tablet landscape mode
  const scaleStyle: CSSProperties = isTabletLandscape ? {
    transform: `scale(${scaleFactor})`,
    transformOrigin: 'center top',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    overflow: 'visible',
    // Add specific padding adjustments for Surface Pro 7
    paddingBottom: isCompactHeader ? 
      (window.innerWidth >= 1350 && window.innerWidth <= 1380 && window.innerHeight >= 900 && window.innerHeight <= 930 ? '100px' : '150px') :
      (window.innerWidth >= 1350 && window.innerWidth <= 1380 && window.innerHeight >= 900 && window.innerHeight <= 930 ? '80px' : '120px')
  } : {};

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
          <Navigation />
          <Header />

          <main className={isTabletLandscape ? mainContainerStyles.tabletLandscapeMain : mainContainerStyles.main} style={scaleStyle}>
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
                      {...mainContainerStyles.fadeOut}
                    >
                      {/* Top section - hide for already-played scenarios */}
                      {!isAlreadyPlayedScenario && (
                        <div className={mainContainerStyles.topSection}>
                          <FactCardStackContainer />
                        </div>
                      )}
                      
                      {/* Middle section */}
                      <div className={`${mainContainerStyles.middleSection} ${isTabletLandscape ? 'py-0' : ''}`} style={mainContainerStyles.sectionGap}>
                        {/* Context line - hide for already-played scenarios */}
                        {!isAlreadyPlayedScenario && (
                          <motion.div 
                            className={mainContainerStyles.contextLine}
                            {...mainContainerStyles.staggeredFade(0)}
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
                          {...mainContainerStyles.staggeredFade(0.3)}
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
                      <div className={`${mainContainerStyles.bottomSection} ${isTabletLandscape ? 'mt-8' : ''}`}>
                        {/* Game instructions - hide for already-played scenarios */}
                        {!isFinalFiveActive && !isAlreadyPlayedScenario && (
                          <motion.div 
                            className={mainContainerStyles.instructionsWrapper}
                            {...mainContainerStyles.staggeredFade(0.6)}
                          >
                            <div className={mainContainerStyles.instructionsContainer}>
                              <div className={mainContainerStyles.instructionsInner}>
                                <GameInstructionsArea />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Game Controls - hide for already-played scenarios */}
                        {!showGameMessage && !isFinalFiveActive && !isAlreadyPlayedScenario && (
                          <motion.div
                            className={`${mainContainerStyles.controlsWrapper} ${isTabletLandscape ? 'mb-12' : ''}`}
                            {...mainContainerStyles.staggeredFade(0.9)}
                          >
                            <GameControls ref={gameControlsRef} />
                          </motion.div>
                        )}
                      </div>
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
        </>
      )}
    </div>
  );
} 