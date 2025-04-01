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
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const resetTimer = useGameStore(state => state.resetTimer);
  const { colors } = useTheme();
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const finalFiveTransitionReason = useGameStore(state => state.finalFiveTransitionReason);
  const startFinalFive = useGameStore(state => state.startFinalFive);

  // We need just one state to track if we're done with all animations and ready to show the game
  const [loadingComplete, setLoadingComplete] = useState(false);
  // State to track if we're in landscape mode on a small screen
  const [isSmallLandscape, setIsSmallLandscape] = useState(false);

  // Initialize the timer based on hard mode setting on page load (before game starts)
  useEffect(() => {
    if (!isTimerActive && !gameState.isGameOver) {
      // This ensures the timer display reflects hard mode setting on page load
      resetTimer();
    }
  }, [isHardModeEnabled, isTimerActive, gameState.isGameOver, resetTimer]);

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
    // Only create the timer when active and not game over
    if (isTimerActive && !gameState.isGameOver) {
      const timer = setInterval(() => {
        // Get the current timeRemaining directly from the store to avoid stale values
        const currentTimeRemaining = useGameStore.getState().timeRemaining;
        
        if (currentTimeRemaining > 0 && !useGameStore.getState().gameState.isGameOver) {
          decrementTimer();
        } else {
          clearInterval(timer);
        }
      }, 1000);
      
      // Cleanup function always returns a new function
      return () => clearInterval(timer);
    }
  }, [isTimerActive, timeRemaining, decrementTimer, gameState.isGameOver]);

  // Handle window resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowWidth(width);
      
      // Check if we're in landscape on a small screen
      // Consider a device "small" if it's less than 768px wide in portrait
      // In landscape, that means the height would be less than 768px
      const isSmall = height < 768;
      const isLandscape = width > height;
      
      setIsSmallLandscape(isSmall && isLandscape);
    };
    
    // Set the initial values
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
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

  // If in small landscape mode, show a warning overlay
  if (isSmallLandscape) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center p-6 z-50">
        <div className="w-16 h-16 mb-4 animate-pulse">
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
        <h2 className="text-xl font-bold mb-2 dark:text-white" style={{ color: `var(--color-${colors.primary})` }}>Rotate Your Device</h2>
        <p className="text-center mb-4 dark:text-gray-200">
          This game works best in portrait mode on smaller screens.
          Please rotate your device to continue playing.
        </p>
        <div className="w-12 h-12 animate-spin-slow">
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
    <div className="flex flex-col min-h-screen w-full items-center bg-white dark:bg-black text-gray-800 dark:text-gray-100">
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