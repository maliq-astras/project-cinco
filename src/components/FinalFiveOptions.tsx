'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
      <div className="w-full max-w-[580px] bg-white rounded-xl shadow-2xl p-4 mx-4 md:p-6">
        {/* Header */}
        <h2 
          className={`text-4xl font-bold text-center mb-6 ${righteous.className}`}
          style={{ color: themeColor }}
        >
          FINAL 5
        </h2>
        
        {/* Message */}
        <p className="text-center mb-6 text-gray-700 font-display">
          {getMessage()}
        </p>
        
        {/* Grid of options - switches to vertical stack on mobile */}
        <div className="flex flex-col md:grid md:grid-cols-3 md:grid-rows-2 gap-3 mb-4">
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
                backgroundColor = themeColor;
                textColor = "white";
                borderWidth = "3px";
                scale = 1.05; // Reduced scale for better proportions
                opacity = 1;
                console.log(`Styling ${option} as correct answer`);
              } else if (isIncorrectGuess(option)) {
                backgroundColor = "#f1f1f1";
                textColor = "#888888";
                opacity = animationComplete ? 0.75 : 1;
                console.log(`Styling ${option} as wrong guess`);
              } else {
                backgroundColor = "#f8f8f8";
                textColor = "#aaaaaa";
                opacity = animationComplete ? 0 : 0.6;
              }
            }
            
            return (
              <motion.button
                key={`option-${index}`}
                className="flex items-center justify-center p-4 rounded-lg text-center relative md:aspect-square font-display"
                style={{
                  backgroundColor,
                  color: textColor,
                  borderColor: themeColor,
                  borderWidth,
                  borderStyle: "solid",
                  minHeight: "80px",
                  boxShadow: isGameOver && isCorrectOption(option) 
                    ? `0 0 15px var(--color-${colors.primary}80)`
                    : "none",
                  pointerEvents: isGameOver ? 'none' : 'auto'
                }}
                animate={{ 
                  scale: isGameOver && isCorrectOption(option) ? scale : 1,
                  opacity: opacity,
                  y: isGameOver && isCorrectOption(option) ? -5 : 0 // Reduced lift
                }}
                transition={{ 
                  duration: 0.4,
                  scale: { type: "spring", stiffness: 400, damping: 15 }
                }}
                onClick={() => !isGameOver && selectFinalFiveOption(option)}
                whileHover={!isGameOver ? { scale: 1.02 } : {}}
                whileTap={!isGameOver ? { scale: 0.98 } : {}}
              >
                <span className="text-lg md:text-xl">{option}</span>
                
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
                        width: "70%", // Slightly smaller X
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
              </motion.button>
            );
          })}
          
          {/* Timer */}
          <motion.div 
            className="flex items-center justify-center bg-gray-50 rounded-lg md:aspect-square"
            style={{
              minHeight: "80px" // Match option height on mobile
            }}
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