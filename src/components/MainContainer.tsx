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

export default function MainContainer() {
  // Use individual selectors instead to avoid type issues
  const gameState = useGameStore(state => state.gameState);
  const viewingFact = useGameStore(state => state.viewingFact);
  const fetchChallenge = useGameStore(state => state.fetchChallenge);
  const decrementTimer = useGameStore(state => state.decrementTimer);
  const setWindowWidth = useGameStore(state => state.setWindowWidth);

  // State to control the loading animation
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  const [hasLoadedChallenge, setHasLoadedChallenge] = useState(false);

  // Fetch challenge on mount
  useEffect(() => {
    const loadChallenge = async () => {
      await fetchChallenge();
      setHasLoadedChallenge(true);
    };
    loadChallenge();
  }, [fetchChallenge]);

  // Handle timer countdown
  useEffect(() => {
    if (showLoadingAnimation) return; // Don't start timer during animation

    const timer = setInterval(() => {
      if (!gameState.loading && !gameState.error && !gameState.isGameOver) {
        decrementTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.loading, gameState.error, gameState.isGameOver, decrementTimer, showLoadingAnimation]);

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

  // Handle loading animation completion
  const handleLoadingComplete = () => {
    setShowLoadingAnimation(false);
  };

  // Show loading animation if we're still loading or haven't finished the animation
  if (showLoadingAnimation && hasLoadedChallenge && gameState.challenge) {
    return (
      <LoadingAnimation 
        finalCategory={gameState.challenge.category} 
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-between px-4 pt-4 pb-8 min-h-screen max-w-6xl mx-auto"
    >
      {/* Loading and error handling */}
      {gameState.loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-blue-600 text-2xl font-display mb-4">Loading challenge...</div>
            <div className="animate-pulse">Please wait</div>
          </div>
        </div>
      ) : gameState.error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-2xl font-display mb-4">Error</div>
            <div className="mb-4">{gameState.error}</div>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() => fetchChallenge()}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header />

          <main className="w-full flex-1 flex flex-col items-center justify-between py-6">
            {gameState.challenge && (
              <>
                <FactsArea />
                <ContextArea />
                
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mb-4">
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