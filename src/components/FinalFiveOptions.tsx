'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';
import Timer from './Timer';
import { UserGuess } from '../types';
import { verifyGuess } from '../helpers/gameLogic';

export default function FinalFiveOptions() {
  const {
    gameState: { finalFiveOptions, isGameOver, guesses, challenge },
    finalFiveTimeRemaining,
    isFinalFiveActive,
    decrementFinalFiveTimer,
    selectFinalFiveOption
  } = useGameStore();
  
  const { colors } = useTheme();
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
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
      // Delay to allow the correct answer styling to be visible before fading out others
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameOver, correctAnswer]);
  
  // Timer logic
  useEffect(() => {
    if (isFinalFiveActive && finalFiveTimeRemaining > 0 && !isGameOver) {
      const timer = setInterval(() => {
        decrementFinalFiveTimer();
        
        if (finalFiveTimeRemaining <= 1) {
          useGameStore.setState(state => ({
            gameState: {
              ...state.gameState,
              isGameOver: true
            },
            finalFiveTimeRemaining: 0
          }));
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isFinalFiveActive, finalFiveTimeRemaining, isGameOver, decrementFinalFiveTimer]);
  
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
    if (loading) {
      return "Determining the correct answer...";
    }
    
    if (!isGameOver) {
      return "Select the correct answer";
    }
    
    const hasWon = guesses.some((g: UserGuess) => g.isCorrect);
    return hasWon 
      ? "Correct! You found the answer!"
      : "Incorrect. The correct answer is highlighted.";
  };
  
  // Theme color for borders
  const themeColor = `var(--color-${colors.primary})`;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-[580px] bg-white rounded-xl shadow-2xl p-4 mx-4">
        {/* Header */}
        <h2 
          className="text-2xl font-bold text-center mb-4" 
          style={{ color: themeColor }}
        >
          FINAL 5
        </h2>
        
        {/* Message */}
        <p className="text-center mb-6 text-gray-700">
          {getMessage()}
        </p>
        
        {/* Grid of options */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-4">
          {options.map((option, index) => {
            // Style variables
            let backgroundColor = "white";
            let textColor = "black";
            let borderWidth = "2px";
            let scale = 1;
            let opacity = 1;
            
            // Set styles based on state
            if (isGameOver) {
              if (isCorrectOption(option)) {
                // Correct answer
                backgroundColor = themeColor;
                textColor = "white";
                borderWidth = "3px";
                scale = 1.10; // Make it stand out more
                opacity = 1; // Always fully visible
                console.log(`Styling ${option} as correct answer`);
              } else if (isIncorrectGuess(option)) {
                // User's wrong guess
                backgroundColor = "#f1f1f1";
                textColor = "#888888";
                opacity = animationComplete ? 0.75 : 1; // Slightly faded
                console.log(`Styling ${option} as wrong guess`);
              } else {
                // Other options
                backgroundColor = "#f8f8f8";
                textColor = "#aaaaaa";
                opacity = animationComplete ? 0 : 0.6; // Fade out completely after animation
              }
            }
            
            return (
              <motion.button
                key={`option-${index}`}
                className="aspect-square flex items-center justify-center p-4 rounded-lg text-center relative"
                style={{
                  backgroundColor,
                  color: textColor,
                  borderColor: themeColor,
                  borderWidth,
                  borderStyle: "solid",
                  boxShadow: isGameOver && isCorrectOption(option) 
                    ? `0 0 20px var(--color-${colors.primary}80)`
                    : "none",
                  pointerEvents: isGameOver ? 'none' : 'auto' // Disable clicks after game over
                }}
                animate={{ 
                  scale: isGameOver && isCorrectOption(option) ? scale : 1,
                  opacity: opacity,
                  y: isGameOver && isCorrectOption(option) ? -10 : 0 // Slight lift for correct answer
                }}
                transition={{ 
                  duration: 0.5,
                  scale: { type: "spring", stiffness: 400, damping: 10 }
                }}
                onClick={() => !isGameOver && selectFinalFiveOption(option)}
                whileHover={!isGameOver ? { scale: 1.03 } : {}}
                whileTap={!isGameOver ? { scale: 0.98 } : {}}
              >
                {option}
                
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
                        width: "80%",
                        height: "80%",
                        maxWidth: "80px",
                        maxHeight: "80px"
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
              </motion.button>
            );
          })}
          
          {/* Timer in the last slot */}
          <motion.div 
            className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg"
            style={{}}
            animate={{ opacity: animationComplete ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Timer 
              seconds={finalFiveTimeRemaining} 
              isGameOver={isGameOver} 
              hasWon={guesses.some((g: UserGuess) => g.isCorrect)}
              isSquare={true} 
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
} 