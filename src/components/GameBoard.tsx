'use client';

import React, { useState, useEffect } from 'react';
import { Challenge, UserGuess } from '../types';
import FactCard from './FactCard';
import FactBubble from './FactBubble';
import FactCardStack from './FactCardStack';
import GuessInput from './GuessInput';
import GuessProgressBar from './GuessProgressBar';
import FinalFiveOptions from './FinalFiveOptions';
import { Question } from "phosphor-react";
import { AnimatePresence, motion } from 'framer-motion';

interface GameState {
  loading: boolean;
  error: string | null;
  challenge: Challenge | null;
  revealedFacts: number[];
  guesses: UserGuess[];
  isGameOver: boolean;
  finalFiveOptions: string[] | null;
}

// Constants
const MAX_WRONG_GUESSES = 5;

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    loading: true,
    error: null,
    challenge: null,
    revealedFacts: [],
    guesses: [],
    isGameOver: false,
    finalFiveOptions: null
  });
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [hoveredFact, setHoveredFact] = useState<number | null>(null);
  const [viewingFact, setViewingFact] = useState<number | null>(null);
  const [cardSourcePosition, setCardSourcePosition] = useState<{ x: number, y: number } | null>(null);
  const [isDrawingFromStack, setIsDrawingFromStack] = useState(false);
  const [isReturningToStack, setIsReturningToStack] = useState(false);
  const [isCardAnimatingOut, setIsCardAnimatingOut] = useState(false);
  const [pendingCardToAdd, setPendingCardToAdd] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Track which facts are currently visible in the stack (all revealed facts except the one being viewed)
  const visibleStackFacts = gameState.revealedFacts.filter(factIndex => 
    // Only show the card in the stack if it's not being viewed OR if it's returning AND the animation out is complete
    factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
  );

  // Fetch challenge on component mount
  useEffect(() => {
    fetchChallenge();
  }, []);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.loading || gameState.isGameOver) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalFive();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.loading, gameState.isGameOver]);

  const fetchChallenge = async () => {
    try {
      const response = await fetch('/api/daily-challenge');
      if (!response.ok) {
        throw new Error('Failed to fetch challenge');
      }
      const data = await response.json();
      setGameState(prev => ({
        ...prev,
        loading: false,
        challenge: data
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  const handleFactReveal = (factIndex: number) => {
    if (gameState.revealedFacts.includes(factIndex)) {
      // If revealing from the stack, get the position of the fact bubble
      const factBubble = document.querySelector(`[data-fact-index="${factIndex}"]`);
      if (factBubble) {
        const rect = factBubble.getBoundingClientRect();
        setCardSourcePosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        setCardSourcePosition(null);
      }
      
      setViewingFact(factIndex);
      setIsDrawingFromStack(false); // Not drawing from stack in this case
      setIsReturningToStack(false);
    } else {
      // Only reveal if not already revealed
      if (!gameState.revealedFacts.includes(factIndex)) {
        // Get the position of the fact bubble
        const factBubble = document.querySelector(`[data-fact-index="${factIndex}"]`);
        if (factBubble) {
          const rect = factBubble.getBoundingClientRect();
          setCardSourcePosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
        } else {
          setCardSourcePosition(null);
        }
        
        // First set the viewing fact to show the animation
        setViewingFact(factIndex);
        setIsDrawingFromStack(false);
        setIsReturningToStack(false);
        
        // Then update the revealed facts list after a delay
        setTimeout(() => {
          setGameState(prev => {
            // Limit to maximum 5 cards
            let newRevealedFacts;
            if (prev.revealedFacts.length >= 5) {
              // Remove the oldest card and add the new one
              newRevealedFacts = [...prev.revealedFacts.slice(1), factIndex];
            } else {
              // Add the new fact to the revealed facts
              newRevealedFacts = [...prev.revealedFacts, factIndex];
            }
            
            return {
              ...prev,
              revealedFacts: newRevealedFacts
            };
          });
        }, 1000); // Delay to allow the flip animation to complete
      }
    }
  };

  const handleCardClick = (factIndex: number, sourcePosition: { x: number, y: number }) => {
    // Only set the source position if the fact isn't already being viewed
    if (viewingFact !== factIndex) {
      setCardSourcePosition(sourcePosition);
      setIsDrawingFromStack(true);
      setViewingFact(factIndex);
    }
  };

  const handleCloseFactCard = () => {
    const currentViewingFact = viewingFact;
    
    // Set animation flags
    setIsCardAnimatingOut(true);
    setIsReturningToStack(true);
  };

  const handleCardAnimationComplete = () => {
    const currentViewingFact = viewingFact;
    
    // Wait a short delay before updating the state to prevent the card from appearing twice
    setTimeout(() => {
      // First clear the viewing state
      setViewingFact(null);
      setCardSourcePosition(null);
      setIsDrawingFromStack(false);
      
      // If we were viewing a fact from the stack, move it to the end of the revealed facts array
      if (currentViewingFact !== null && gameState.revealedFacts.includes(currentViewingFact)) {
        // Create a new array without the current fact, then add it to the end
        const newRevealedFacts = gameState.revealedFacts.filter(index => index !== currentViewingFact);
        
        // Update the state with the reordered facts
        setGameState(prev => ({
          ...prev,
          revealedFacts: [...newRevealedFacts, currentViewingFact]
        }));
      }
      
      // Reset the animation flags after a short delay
      setTimeout(() => {
        setIsCardAnimatingOut(false);
        
        // Reset the returning to stack flag after the animation completes
        setTimeout(() => {
          setIsReturningToStack(false);
        }, 600); // Increased to match the longer animation duration
      }, 150);
    }, 300); // Increased delay to match the longer animation duration
  };

  const handleGuessSubmit = async (guess: string) => {
    if (!gameState.challenge) return;
    
    try {
      const response = await fetch('/api/verify-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: gameState.challenge.challengeId,
          guess
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify guess');
      }
      
      const data = await response.json();
      
      const newGuess: UserGuess = {
        guess,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      setGameState(prev => {
        const newState = {
          ...prev,
          guesses: [...prev.guesses, newGuess]
        };
        
        // Check if the guess is correct
        if (data.isCorrect) {
          newState.isGameOver = true;
        } 
        // Check if we've reached the maximum number of wrong guesses
        else {
          const wrongGuesses = [...prev.guesses, newGuess].filter(g => !g.isCorrect);
          if (wrongGuesses.length >= MAX_WRONG_GUESSES) {
            handleFinalFive();
          }
        }
        
        return newState;
      });
    } catch (error) {
      console.error('Error verifying guess:', error);
    }
  };

  const handleFinalFive = async () => {
    if (!gameState.challenge) return;
    
    try {
      const response = await fetch(`/api/final-five?id=${gameState.challenge.challengeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch final five options');
      }
      
      const data = await response.json();
      setGameState(prev => ({
        ...prev,
        finalFiveOptions: data.options
      }));
    } catch (error) {
      console.error('Error fetching final five options:', error);
    }
  };

  const handleFinalFiveSelect = async (option: string) => {
    if (!gameState.challenge) return;
    
    try {
      const response = await fetch('/api/verify-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: gameState.challenge.challengeId,
          guess: option
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify guess');
      }
      
      const data = await response.json();
      
      const newGuess: UserGuess = {
        guess: option,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      setGameState(prev => ({
        ...prev,
        guesses: [...prev.guesses, newGuess],
        isGameOver: true,
        finalFiveOptions: null
      }));
    } catch (error) {
      console.error('Error verifying final guess:', error);
    }
  };

  if (gameState.loading) {
    return <div className="text-center py-12">Loading challenge...</div>;
  }

  if (gameState.error) {
    return <div className="text-center py-12 text-red-500">Error: {gameState.error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* TOP SECTION - Logo and Question Mark */}
      <div className="flex flex-col items-center py-6 sm:py-8">
        {/* Header */}
        <header className="flex justify-center items-center w-full max-w-4xl relative">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide font-game">FACT 5</h1>
          <div className="absolute right-4 flex gap-4">
            <button className="hover:bg-gray-100 p-2 rounded-full transition-colors" aria-label="Help">
              <Question size={24} weight="bold" />
            </button>
          </div>
        </header>
      </div>
      
      {/* MIDDLE SECTION - Cards, Fact Type Info, Bubbles */}
      <div className="flex-grow flex flex-col items-center justify-center py-4 sm:py-6">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center">
          {/* Category Display - Moved to middle section */}
          <div className="text-center mb-6">
            <h3 className="inline-flex items-center justify-center gap-2 bg-blue-50 py-3 px-6 rounded-lg text-xl font-medium text-blue-800 font-display">
              CATEGORY: {gameState.challenge?.category.toUpperCase()}
              <button className="text-blue-600 hover:text-blue-800 ml-1" aria-label="Information">ⓘ</button>
            </h3>
          </div>
          
          {/* Facts Display Area */}
          <div className="h-[220px] w-full max-w-4xl rounded-lg p-4 mb-6 bg-white flex items-center justify-center relative">
            {gameState.challenge && (
              <>
                {/* Placeholder that fades out when cards appear */}
                <AnimatePresence>
                  {gameState.revealedFacts.length === 0 && (
                    <motion.div 
                      className="border-2 border-dashed border-gray-200 rounded-lg w-[350px] h-[180px] bg-gray-50 flex items-center justify-center absolute"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-gray-400 font-display">Revealed facts will appear here</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Card stack that's always present but initially invisible */}
                <div className={`w-full ${gameState.revealedFacts.length === 0 ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
                  <FactCardStack 
                    revealedFacts={visibleStackFacts} 
                    facts={gameState.challenge.facts}
                    onCardClick={(factIndex, sourcePosition) => handleCardClick(factIndex, sourcePosition)}
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Context Area - Fixed height with invisible placeholder */}
          <div className="h-[40px] w-full max-w-4xl rounded-lg p-3 mb-6 bg-white text-center flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Invisible placeholder text to maintain space */}
              <span className="invisible" aria-hidden="true">
                Geographic Features & Border Info Fact
              </span>
              
              {/* Actual text that appears on hover */}
              <span 
                className={`absolute inset-0 flex items-center justify-center text-blue-600 font-medium font-display transition-opacity duration-200 ${
                  hoveredFact !== null && !gameState.revealedFacts.includes(hoveredFact) 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`}
              >
                {hoveredFact !== null && !gameState.revealedFacts.includes(hoveredFact)
                  ? `${gameState.challenge?.facts[hoveredFact].factType} Fact`
                  : ''
                }
              </span>
            </div>
          </div>

          {/* Fact Bubbles */}
          <div className="w-full max-w-4xl flex justify-center">
            {gameState.finalFiveOptions ? (
              <FinalFiveOptions 
                options={gameState.finalFiveOptions} 
                onSelect={handleFinalFiveSelect} 
              />
            ) : (
              <div className="flex justify-center items-center">
                {(() => {
                  // Always use a fixed 4x2 grid layout
                  const cols = 4;
                  const rows = 2;
                  const totalSlots = cols * rows;
                  
                  // Calculate container width based on screen size
                  const containerWidth = windowWidth < 640 
                    ? Math.min(windowWidth - 32, cols * 80) // Mobile: account for padding and bubble size
                    : Math.min(480, cols * 100); // Desktop: max width or based on columns
                  
                  // Create a fixed grid with placeholders for revealed facts
                  return (
                    <div 
                      className="grid gap-4 md:gap-6 justify-items-center"
                      style={{ 
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        width: containerWidth + 'px',
                        height: `${rows * (windowWidth < 640 ? 80 : 100)}px` // Fixed height based on rows
                      }}
                    >
                      {/* Map through all 8 positions in the grid */}
                      {Array.from({ length: totalSlots }).map((_, slotIndex) => {
                        // Find the fact that should be in this position
                        const factIndex = gameState.challenge?.facts.findIndex((_, factIndex) => 
                          !gameState.revealedFacts.includes(factIndex) && 
                          gameState.challenge?.facts
                            .filter((_, i) => !gameState.revealedFacts.includes(i))
                            .indexOf(gameState.challenge?.facts[factIndex]) === slotIndex
                        );
                        
                        // If no fact should be in this position, render an empty slot
                        if (factIndex === undefined || factIndex === -1) {
                          return (
                            <div 
                              key={`empty-${slotIndex}`} 
                              className="w-[65px] md:w-[80px] aspect-square opacity-0"
                            />
                          );
                        }
                        
                        // Otherwise, render the fact bubble
                        const fact = gameState.challenge?.facts[factIndex];
                        if (!fact) return null;
                        
                        return (
                          <AnimatePresence mode="popLayout" key={`slot-${slotIndex}`}>
                            <motion.div
                              key={`fact-${factIndex}`}
                              layout
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 25,
                                duration: 0.4
                              }}
                              className="flex items-center justify-center"
                            >
                              <FactBubble
                                factType={fact.factType}
                                isRevealed={false}
                                onClick={() => handleFactReveal(factIndex)}
                                onMouseEnter={() => setHoveredFact(factIndex)}
                                onMouseLeave={() => setHoveredFact(null)}
                                data-fact-index={factIndex}
                                className="w-[65px] md:w-[80px]" // Smaller on mobile
                              />
                            </motion.div>
                          </AnimatePresence>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - Input, Progress, Timer */}
      <div className="py-6 sm:py-8">
        {!gameState.isGameOver && !gameState.finalFiveOptions && (
          <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 border-t border-gray-200 p-3 sm:p-0 sm:static sm:border-0 sm:flex sm:flex-col sm:items-center z-10">
            <div className="flex w-full max-w-md gap-2 mx-auto">
              <div className="flex-1 flex flex-col">
                <div className="relative">
                  {/* Toast container above input */}
                  <div className="absolute -top-12 left-0 right-0 flex justify-center">
                    {/* Duplicate guess toast */}
                    <div id="duplicate-error" className="hidden bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-fadeIn">
                      You've already tried that guess. Try something else!
                    </div>

                    {/* Wrong guess toast */}
                    <div id="wrong-guess-toast" className="hidden bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium border border-red-200 shadow-md animate-fadeIn">
                      Wrong answer! Try again.
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const inputEl = (e.currentTarget.elements[0] as HTMLInputElement);
                    const guess = inputEl.value.trim();
                    
                    if (!guess) return;
                    
                    // Check if this guess has been made before
                    const isDuplicate = gameState.guesses.some(
                      prevGuess => prevGuess.guess.toLowerCase() === guess.toLowerCase()
                    );
                    
                    if (isDuplicate) {
                      // Show duplicate error message
                      const errorDiv = document.getElementById('duplicate-error');
                      if (errorDiv) {
                        errorDiv.classList.remove('hidden');
                        setTimeout(() => {
                          errorDiv.classList.add('animate-fadeOut');
                          setTimeout(() => {
                            errorDiv.classList.remove('animate-fadeIn', 'animate-fadeOut');
                            errorDiv.classList.add('hidden');
                          }, 300);
                        }, 2000);
                      }
                      
                      // Playful animation for fact bubbles
                      const factBubbles = document.querySelectorAll('[data-fact-index]');
                      factBubbles.forEach((bubble, index) => {
                        // Remove any existing animations first
                        bubble.classList.remove('animate-shake', 'animate-wiggle', 'animate-bounce', 'animate-pulse');
                        
                        // Apply a different animation based on the index
                        switch (index % 4) {
                          case 0:
                            bubble.classList.add('animate-shake');
                            break;
                          case 1:
                            bubble.classList.add('animate-wiggle');
                            break;
                          case 2:
                            bubble.classList.add('animate-bounce');
                            break;
                          case 3:
                            bubble.classList.add('animate-pulse');
                            break;
                        }
                        
                        // Remove the animation class after it completes
                        setTimeout(() => {
                          bubble.classList.remove('animate-shake', 'animate-wiggle', 'animate-bounce', 'animate-pulse');
                        }, 1000);
                      });
                      
                      return;
                    }
                    
                    handleGuessSubmit(guess);
                    inputEl.value = '';
                  }}>
                    <input
                      type="text"
                      placeholder="Enter your guess..."
                      className="w-full p-3 border border-gray-200 rounded-full
                        bg-white text-gray-900 font-display
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </form>
                </div>
                
                <div className="mt-2">
                  <GuessProgressBar 
                    guesses={gameState.guesses} 
                    maxGuesses={MAX_WRONG_GUESSES} 
                  />
                </div>
              </div>
              
              <div className="text-xl bg-blue-50 rounded-lg text-black flex items-center justify-center h-[76px] px-4 min-w-[80px] font-iceberg">
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Fact Card Modal */}
      {viewingFact !== null && gameState.challenge && (
        <FactCard 
          fact={gameState.challenge.facts[viewingFact]} 
          onClose={handleCloseFactCard}
          sourcePosition={cardSourcePosition}
          visibleStackCount={visibleStackFacts.length}
          onAnimationComplete={handleCardAnimationComplete}
        />
      )}
    </div>
  );
} 