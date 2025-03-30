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

          <main className="w-full flex-1 flex flex-col items-center justify-between py-2 sm:py-3">
            {gameState.challenge && (
              <>
                <FactsArea />
                
                {/* Center line with category context */}
                <div className="w-full relative my-1 sm:my-2 flex-shrink-0">
                  {/* Line is full width of the container */}
                  <div className="absolute inset-x-0 h-1" style={{ backgroundColor: `var(--color-${colors.primary}30)` }}></div>
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center">
                    <div className="px-4 py-1 rounded-lg relative z-10">
                      <BubbleContextArea />
                    </div>
                  </div>
                </div>
                
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-lg mb-1 sm:mb-2 py-1 sm:pt-3">
                    {/* Hide FactBubbleGrid in Final Five mode */}
                    {!isFinalFiveActive && (
                      <div className="relative">
                        <AnimatePresence mode="wait">
                          {showGameMessage ? (
                            <GameMessage {...getGameMessageProps()} />
                          ) : (
                            <FactBubbleGrid />
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Game instructions context area */}
                {!isFinalFiveActive && (
                  <div className="w-full relative my-1 flex-shrink-0">
                    <div className="flex justify-center">
                      <div className="px-4 py-1 rounded-lg">
                        <GameInstructionsArea />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Render FinalFiveOptions when active */}
                {isFinalFiveActive && <FinalFiveOptions />}
                
                {/* Only show GameControls when the game is not in a summary or loss state */}
                {!(showGameMessage) && (
                  <GameControls ref={gameControlsRef} />
                )}
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