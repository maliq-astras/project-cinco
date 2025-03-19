'use client';

import React, { useEffect, useState } from 'react';
import FactCard from './FactCard';
import FinalFiveOptions from './FinalFiveOptions';
import Header from './Header';
import FactsArea from './FactsArea';
import ContextArea from './ContextArea';
import FactBubbleGrid from './FactBubbleGrid';
import GameControls from './GameControls';
import LoadingAnimation from './LoadingAnimation';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function MainContainer() {
  // Use individual selectors instead to avoid type issues
  const gameState = useGameStore(state => state.gameState);
  const viewingFact = useGameStore(state => state.viewingFact);
  const fetchChallenge = useGameStore(state => state.fetchChallenge);
  const decrementTimer = useGameStore(state => state.decrementTimer);
  const setWindowWidth = useGameStore(state => state.setWindowWidth);
  const isTimerActive = useGameStore(state => state.isTimerActive);
  const { colors } = useTheme();

  // We need just one state to track if we're done with all animations and ready to show the game
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Fetch challenge on mount
  useEffect(() => {
    const loadChallenge = async () => {
      await fetchChallenge();
    };
    loadChallenge();
  }, [fetchChallenge]);

  // Handle timer countdown - only start once loading is complete and timer is active
  useEffect(() => {
    if (!loadingComplete) return;
    if (!isTimerActive) return;
    
    const timer = setInterval(() => {
      if (!gameState.loading && !gameState.error && !gameState.isGameOver) {
        decrementTimer();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.loading, gameState.error, gameState.isGameOver, decrementTimer, loadingComplete, isTimerActive]);

  // Handle loading animation completion
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Call once on mount to set initial width
      handleResize();
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [setWindowWidth]);

  // Always show loading animation until we're ready to show the game
  if (!loadingComplete) {
    return (
      <LoadingAnimation 
        finalCategory={gameState.challenge?.category || "CATEGORIES"} 
        onComplete={handleLoadingComplete}
        isChallengeFetched={gameState.challenge !== null}
      />
    );
  }

  // STEP 3: Show the main game after animations are complete
  return (
    <div 
      className="flex flex-col items-center justify-between min-h-screen max-w-6xl mx-auto px-4 pt-4 pb-0 sm:pb-8"
    >
      {/* Loading and error handling */}
      {gameState.loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-${colors.primary} text-2xl font-display mb-4`}>Loading challenge...</div>
            <div className="animate-pulse">Please wait</div>
          </div>
        </div>
      ) : gameState.error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-2xl font-display mb-4">Error</div>
            <div className="mb-4">{gameState.error}</div>
            <button 
              className={`px-4 py-2 bg-${colors.primary} text-white rounded-lg hover:bg-${colors.accent} transition duration-200`}
              onClick={() => fetchChallenge()}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header />

          <main className="w-full flex-1 flex flex-col items-center justify-between py-4 sm:py-6">
            {gameState.challenge && (
              <>
                <FactsArea />
                
                {/* Center line with true full width */}
                <div className="w-full relative my-2 sm:my-4 flex-shrink-0">
                  {/* Line is full width of the container */}
                  <div className="absolute inset-x-0 h-1" style={{ backgroundColor: `var(--color-${colors.primary}30)` }}></div>
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center">
                    <div className="px-6 py-1 rounded-lg relative z-10">
                      <ContextArea />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center w-full max-w-lg mb-2 sm:mb-4 py-2">
                  {!gameState.finalFiveOptions && (
                    <FactBubbleGrid />
                  )}
                  
                  {gameState.finalFiveOptions && (
                    <FinalFiveOptions />
                  )}
                </div>
                
                <GameControls />
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