'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import Timer from './Timer';
import { UserGuess } from '../types';
import { verifyGuess } from '../helpers/gameLogic';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

export default function FinalFiveOptions() {
  const {
    gameState: { finalFiveOptions, isGameOver, guesses, challenge },
    finalFiveTimeRemaining,
    isFinalFiveActive,
    gameOutcome,
    decrementFinalFiveTimer,
    selectFinalFiveOption,
    closeFinalFive
  } = useGameStore();
  
  const { colors } = useTheme();
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  
  // Sequentially flip each card when component loads
  useEffect(() => {
    const flipCardSequentially = (index: number) => {
      if (index >= 5) {
        // All cards have been flipped
        setAllCardsFlipped(true);
        // Start the timer after all cards have flipped
        setTimeout(() => {
          setStartTimer(true);
        }, 500);
        return;
      }
      
      setTimeout(() => {
        setFlippedCards(prev => {
          const newFlipped = [...prev];
          newFlipped[index] = true;
          return newFlipped;
        });
        
        // Flip the next card
        flipCardSequentially(index + 1);
      }, 500); // Slower flip animation (was 300ms)
    };
    
    // Start the flip sequence
    if (isFinalFiveActive && !allCardsFlipped) {
      flipCardSequentially(0);
    }
  }, [isFinalFiveActive, allCardsFlipped]);
  
  // Check all options against the API when game is over
  useEffect(() => {
    const verifyAllOptions = async () => {
      if (isGameOver && finalFiveOptions && finalFiveOptions.length > 0 && !correctAnswer && challenge) {
        setLoading(true);
        
        console.log("Checking all options with API to find the correct answer");
        
        // Check each option that hasn't been guessed yet
        for (const option of finalFiveOptions) {
          // Skip options we've already verified
          const alreadyGuessed = guesses.some(g => g.guess === option);
          if (alreadyGuessed) continue;
          
          try {
            const result = await verifyGuess(challenge.challengeId, option);
            console.log(`API verification for ${option}:`, result);
            
            if (result.isCorrect) {
              console.log(`Found correct answer via API: ${option}`);
              setCorrectAnswer(option);
              break; // Stop once we find the correct answer
            }
          } catch (error) {
            console.error(`Error verifying option ${option}:`, error);
          }
        }
        
        setLoading(false);
      }
    };
    
    verifyAllOptions();
  }, [isGameOver, finalFiveOptions, correctAnswer, challenge, guesses]);
  
  // Also try to find the correct answer from existing guesses
  useEffect(() => {
    if (isGameOver && !correctAnswer) {
      const found = guesses.find((g: UserGuess) => g.isCorrect);
      if (found) {
        console.log(`Found correct answer in guesses: ${found.guess}`);
        setCorrectAnswer(found.guess);
      }
    }
  }, [isGameOver, guesses, correctAnswer]);
  
  // Start the animation sequence after we've found the correct answer
  useEffect(() => {
    if (isGameOver && correctAnswer) {
      // First delay to allow the correct answer styling to be visible
      const timer = setTimeout(() => {
        // Fade out non-relevant cards
        setAnimationComplete(true);
        
        // Only after everything has faded, show the continue button
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameOver, correctAnswer]);
  
  // Timer logic - only start when all cards are flipped and startTimer is true
  useEffect(() => {
    if (isFinalFiveActive && finalFiveTimeRemaining > 0 && !isGameOver && startTimer) {
      const timer = setInterval(() => {
        decrementFinalFiveTimer();
        
        if (finalFiveTimeRemaining <= 1) {
          useGameStore.setState(state => ({
            gameState: {
              ...state.gameState,
              isGameOver: true
            },
            finalFiveTimeRemaining: 0,
            gameOutcome: 'loss'
          }));
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isFinalFiveActive, finalFiveTimeRemaining, isGameOver, decrementFinalFiveTimer, startTimer]);
  
  // State for controlling the Continue button visibility
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  // Show continue button after animations complete
  useEffect(() => {
    if (animationComplete && isGameOver) {
      // Delay showing the continue button until after fade animations
      const timer = setTimeout(() => {
        setShowContinueButton(true);
      }, 600); // Wait for fade animations to complete
      
      return () => clearTimeout(timer);
    }
  }, [animationComplete, isGameOver]);
  
  // Don't render if not active or no options
  if (!finalFiveOptions?.length || !isFinalFiveActive) {
    return null;
  }
  
  // Only show up to 5 options
  const options = finalFiveOptions.slice(0, 5);
  
  // Simple function to check if this option is the correct answer
  const isCorrectOption = (option: string): boolean => {
    if (!isGameOver) return false;
    return option === correctAnswer;
  };
  
  // Simple function to check if user guessed this option incorrectly
  const isIncorrectGuess = (option: string): boolean => {
    return guesses.some((g: UserGuess) => !g.isCorrect && g.guess === option);
  };
  
  // Function to determine if an option should be visible after game over
  const shouldShowOption = (option: string): boolean => {
    if (!isGameOver || !animationComplete) return true;
    return isCorrectOption(option) || isIncorrectGuess(option);
  };
  
  // Message shown to user
  const getMessage = () => {
    if (!allCardsFlipped) {
      return "Cards are being revealed...";
    }
    
    if (loading) {
      return "Determining the correct answer...";
    }
    
    if (!isGameOver) {
      return "Select the correct answer";
    }
    
    const hasWon = gameOutcome === 'final-five-win';
    return hasWon 
      ? "Correct! You found the answer!"
      : "Incorrect. The correct answer is highlighted.";
  };
  
  // Theme color for borders
  const themeColor = `var(--color-${colors.primary})`;
  
  return (
    <div className="fixed inset-0 z-40 flex md:items-center justify-center bg-black/75 backdrop-blur-sm">
      <motion.div 
        className="w-full max-w-[580px] bg-white md:rounded-xl rounded-t-xl shadow-2xl p-4 mx-0 md:mx-4 md:p-6 absolute md:relative bottom-0 md:bottom-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ 
          type: "tween", 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
          willChange: "transform"
        }}
        style={{ 
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)" 
        }}
      >
        {/* Small handle for mobile - only visible on small screens */}
        <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>
        
        {/* Header */}
        <h2 
          className={`text-4xl font-bold text-center mb-6 ${righteous.className}`}
          style={{ color: themeColor }}
        >
          FINAL 5
        </h2>
        
        {/* Message */}
        <p className="text-left mb-6 text-gray-700 font-display">
          {getMessage()}
        </p>
        
        {/* Grid of cards - 3-2 layout with timer in the bottom center */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mx-auto max-w-[500px]">
          {options.map((option, index) => {
            const isFlipped = flippedCards[index];
            
            // Front/back styling
            let frontBg = `var(--color-${colors.primary})`;
            let backBg = isGameOver && isCorrectOption(option) ? frontBg : "white";
            let textColor = isGameOver && isCorrectOption(option) ? "white" : "black";
            
            return (
              <motion.div 
                key={`option-${index}`} 
                className="relative aspect-square w-full perspective-1000"
                animate={{ 
                  opacity: isGameOver && animationComplete && !isCorrectOption(option) && !isIncorrectGuess(option) 
                    ? 0 
                    : isGameOver && animationComplete && isIncorrectGuess(option)
                    ? 0.75
                    : 1
                }}
                transition={{ duration: 0.5 }}
                style={{ 
                  perspective: "1000px",
                  minHeight: "100px",
                  maxWidth: "160px", 
                  margin: "0 auto",
                  pointerEvents: !isFlipped || isGameOver ? "none" : "auto"
                }}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    type: "spring", 
                    stiffness: 200, // Less stiff for slower animation
                    damping: 25,   // More damping for slower animation
                    duration: 0.8   // Longer duration
                  }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d"
                  }}
                >
                  {/* Front of card - Number 5 */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden shadow-md ${righteous.className}`}
                    style={{ 
                      backgroundColor: frontBg,
                      color: "white",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      fontSize: "3.5rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                    }}
                  >
                    5
                  </div>
                  
                  {/* Back of card - Option text */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden shadow-md font-display border-2"
                    style={{ 
                      backgroundColor: backBg,
                      color: textColor,
                      borderColor: themeColor,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      WebkitTransform: "rotateY(180deg)",
                      boxShadow: isGameOver && isCorrectOption(option) 
                        ? `0 0 15px var(--color-${colors.primary}80)`
                        : "0 4px 8px rgba(0,0,0,0.1)",
                      padding: "0.5rem"
                    }}
                    onClick={() => !isGameOver && selectFinalFiveOption(option)}
                  >
                    <span className="text-lg md:text-xl text-center">
                      {option}
                    </span>
                    
                    {/* X overlay for incorrect guesses */}
                    {isGameOver && isIncorrectGuess(option) && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        aria-hidden="true"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 0.9, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          style={{ 
                            width: "70%",
                            height: "70%",
                            maxWidth: "60px",
                            maxHeight: "60px"
                          }}
                        >
                          <svg 
                            viewBox="0 0 100 100" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              width: "100%",
                              height: "100%"
                            }}
                          >
                            <g stroke={themeColor} strokeWidth="12" strokeLinecap="round">
                              <path d="M25,25 L75,75" />
                              <path d="M75,25 L25,75" />
                            </g>
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
          
          {/* Timer - as part of the grid */}
          {allCardsFlipped && (
            <motion.div 
              className="relative aspect-square w-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isGameOver && animationComplete ? 0 : 1,
                scale: 1 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              style={{ 
                minHeight: "100px",
                maxWidth: "160px",
                margin: "0 auto"
              }}
            >
              <div 
                className="w-full h-full rounded-xl flex items-center justify-center shadow-md"
              >
                <Timer 
                  seconds={finalFiveTimeRemaining} 
                  isGameOver={isGameOver} 
                  hasWon={gameOutcome === 'final-five-win'}
                  finalFive={true}
                />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Fixed-height container for the continue button to prevent layout shift */}
        <div className="h-14 relative">
          {/* Continue button - only visible after animations complete */}
          <AnimatePresence>
            {isGameOver && showContinueButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-x-0 flex justify-center"
              >
                <button
                  className="px-8 py-3 rounded-full font-display font-bold text-white transition-all"
                  style={{ 
                    backgroundColor: themeColor,
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`
                  }}
                  onClick={closeFinalFive}
                >
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
} 