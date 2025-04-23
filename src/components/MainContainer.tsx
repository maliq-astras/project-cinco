'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMainContainer } from '../hooks/components/mainContainer';
import { mainContainerStyles } from '../styles/mainContainerStyles';
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
  FinalFiveIntro 
} from './';

export default function MainContainer() {
  const {
    gameState,
    viewingFact,
    loadingComplete,
    isSmallLandscape,
    isFinalFiveActive,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    colors,
    showGameMessage,
    gameControlsRef,
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive
  } = useMainContainer();
  
  // If in small landscape mode, show a warning overlay
  if (isSmallLandscape) {
    return (
      <div className={mainContainerStyles.warningOverlay}>
        <div className={mainContainerStyles.warningIcon}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.162 4H7.838C6.823 4 6 4.823 6 5.838V18.162C6 19.177 6.823 20 7.838 20H16.162C17.177 20 18 19.177 18 18.162V5.838C18 4.823 17.177 4 16.162 4Z" 
                  stroke={`var(--color-${colors.primary})`} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            <path d="M10 17L14 17" 
                  stroke={`var(--color-${colors.primary})`} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ color: `var(--color-${colors.primary})` }}>Rotate Your Device</h2>
        <p className={mainContainerStyles.warningText}>
          This game works best in portrait mode on smaller screens.
          Please rotate your device to continue playing.
        </p>
        <div className={mainContainerStyles.spinIcon}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C13.6569 18 15.1569 17.3284 16.2426 16.2426" 
                  stroke={`var(--color-${colors.primary})`} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            <path d="M17 14L16.2427 16.2426L14 15.4853" 
                  stroke={`var(--color-${colors.primary})`} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C10.3431 6 8.84315 6.67157 7.75736 7.75736" 
                  stroke={`var(--color-${colors.primary})`} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            <path d="M7 10L7.75736 7.75736L10 8.51472" 
                  stroke={`var(--color-${colors.primary})`} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={mainContainerStyles.container}>
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

          <main className={mainContainerStyles.main}>
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
                      className={mainContainerStyles.gameContent}
                      {...mainContainerStyles.fadeOut}
                    >
                      {/* Top section */}
                      <div className={mainContainerStyles.topSection}>
                        <FactCardStackContainer />
                      </div>
                      
                      {/* Middle section */}
                      <div className={mainContainerStyles.middleSection} style={mainContainerStyles.sectionGap}>
                        {/* Context line */}
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
                      <div className={mainContainerStyles.bottomSection}>
                        {/* Game instructions */}
                        {!isFinalFiveActive && (
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

                        {/* Game Controls */}
                        {!showGameMessage && !isFinalFiveActive && (
                          <motion.div
                            className={mainContainerStyles.controlsWrapper}
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
        </>
      )}
    </div>
  );
} 