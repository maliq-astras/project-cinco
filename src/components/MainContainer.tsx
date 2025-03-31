'use client';

import React, { useEffect, useState, useRef } from 'react';
import FactCard from './FactCard';
import FinalFiveOptions from './FinalFiveOptions';
import Header from './Header';
import FactsArea from './FactsArea';
import ContextArea, { BubbleContextArea, GameInstructionsArea } from './ContextArea';
import FactBubbleGrid from './FactBubbleGrid';
import GameControls, { GameControlsHandle } from './GameControls';
import LoadingAnimation from './LoadingAnimation';
import GameMessage from './GameMessage';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import { AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import FinalFiveTransition from './FinalFiveTransition';
import { motion } from 'framer-motion';

export default function MainContainer() {
  // Use individual selectors instead to avoid type issues
  const gameState = useGameStore(state => state.gameState);
  const viewingFact = useGameStore(state => state.viewingFact);
  const fetchChallenge = useGameStore(state => state.fetchChallenge);
  const decrementTimer = useGameStore(state => state.decrementTimer);
  const setWindowWidth = useGameStore(state => state.setWindowWidth);
  const isTimerActive = useGameStore(state => state.isTimerActive);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const gameOutcome = useGameStore(state => state.gameOutcome);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const { colors } = useTheme();
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const finalFiveTransitionReason = useGameStore(state => state.finalFiveTransitionReason);
  const startFinalFive = useGameStore(state => state.startFinalFive);

  // We need just one state to track if we're done with all animations and ready to show the game
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Create a ref for the GameControls component
  const gameControlsRef = useRef<GameControlsHandle>(null);

  // Fetch challenge on mount
  useEffect(() => {
    const loadChallenge = async () => {
      await fetchChallenge();
    };
    loadChallenge();
  }, [fetchChallenge]);

  // Handle the timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0 && !gameState.isGameOver) {
      timer = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, timeRemaining, decrementTimer, gameState.isGameOver]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set the initial width
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWindowWidth]);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  // Prepare data for game message if we're showing it
  const showGameMessage = (victoryAnimationStep === 'summary' && gameOutcome) || gameOutcome === 'loss';
  const getGameMessageProps = () => {
    // Find correct answer if it exists
    const correctGuess = gameState.guesses.find(g => g.isCorrect);
    // If no correct guess is found but we have a loss, find the correct option from finalFiveOptions
    let correctAnswer = correctGuess?.guess || '';
    
    // For standard win, calculate number of tries
    const numberOfTries = correctGuess ? gameState.guesses.indexOf(correctGuess) + 1 : 0;
    
    // Calculate time spent (300 - timeRemaining for normal game)
    const timeSpent = 300 - timeRemaining;
    
    return {
      outcome: gameOutcome || 'loss', // Default to 'loss' if gameOutcome is null
      correctAnswer,
      numberOfTries,
      timeSpent,
    };
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-white text-gray-800">
      {!loadingComplete ? (
        <div className="flex-1 flex items-center justify-center w-full">
          <LoadingAnimation 
            finalCategory={gameState.challenge?.category || "Travel"} 
            onComplete={handleLoadingComplete}
            isChallengeFetched={!!gameState.challenge}
          />
        </div>
      ) : (
        <>
          <Navigation />
          <Header />

          <main className="w-full flex-1 flex flex-col items-center justify-between">
            {gameState.challenge && (
              <>
                {/* Final Five Transition Container - Absolute overlay */}
                <AnimatePresence>
                  {showFinalFiveTransition && (
                    <motion.div
                      key="final-five-transition"
                      className="absolute inset-0 flex items-center justify-center z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 2.4 }}
                    >
                      <FinalFiveTransition 
                        reason={finalFiveTransitionReason || 'guesses'} 
                        onStart={startFinalFive}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main game content - Full structure with correct spacing */}
                <AnimatePresence>
                  {!showFinalFiveTransition && (
                    <motion.div
                      key="game-content"
                      className="w-full flex-1 flex flex-col items-center pt-1 pb-2 sm:py-2 gap-1"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Top section */}
                      <div className="w-full flex justify-center">
                        <FactsArea />
                      </div>
                      
                      {/* Middle section - center of the screen */}
                      <div className="flex-1 flex flex-col justify-center w-full" style={{ gap: "1rem" }}>
                        {/* Center line with category context - fade out first */}
                        <motion.div 
                          className="w-full relative flex-shrink-0 mb-2"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="absolute inset-x-0 h-1" style={{ backgroundColor: `var(--color-${colors.primary}30)` }}></div>
                          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center">
                            <div className="px-4 py-1 rounded-lg relative z-10">
                              <BubbleContextArea />
                            </div>
                          </div>
                        </motion.div>

                        {/* Fact Bubbles Area - fade out second */}
                        <motion.div 
                          className="w-full flex justify-center mb-2"
                          style={{ marginTop: "0.75rem" }}
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          <div className="w-full max-w-lg mb-0 py-0 sm:pt-1">
                            {!isFinalFiveActive && (
                              <div className="relative">
                                {showGameMessage ? (
                                  <GameMessage {...getGameMessageProps()} />
                                ) : (
                                  <FactBubbleGrid />
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Bottom section - at the bottom of the screen */}
                      <div className="w-full mt-auto">
                        {/* Game instructions - fade out third */}
                        {!isFinalFiveActive && (
                          <motion.div 
                            className="w-full relative my-1 flex-shrink-0"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <div className="flex justify-center">
                              <div className="px-4 py-1 rounded-lg">
                                <GameInstructionsArea />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Game Controls - fade out last */}
                        {!showGameMessage && !isFinalFiveActive && (
                          <motion.div
                            className="w-full flex justify-center mb-2"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                          >
                            <GameControls ref={gameControlsRef} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Render FinalFiveOptions when active */}
                {isFinalFiveActive && <FinalFiveOptions />}
              </>
            )}
          </main>
          
          {/* Viewing card from the stack */}
          {viewingFact !== null && gameState.challenge && (
            <FactCard
              fact={gameState.challenge.facts[viewingFact]}
              visibleStackCount={gameState.revealedFacts.length}
            />
          )}
        </>
      )}
    </div>
  );
} 