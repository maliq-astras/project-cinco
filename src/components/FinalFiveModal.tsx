'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveModal } from '../hooks';
import Timer from './Timer';
import FinalFiveCard from './FinalFiveCard';
import { finalFiveStyles } from '../styles/finalFiveStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

/**
 * Modal component that shows the Final Five options
 */
export default function FinalFiveModal() {
  const {
    // State
    options,
    flippedCards,
    allCardsFlipped,
    showContinueButton,
    isFinalFiveActive,
    isGameOver,
    finalFiveTimeRemaining,
    gameOutcome,
    animationComplete,
    
    // Styles and helpers
    themeColor,
    getMessage,
    getCardStyles,
    isCorrectOption,
    isIncorrectGuess,
    
    // Actions
    handleOptionClick,
    closeFinalFive
  } = useFinalFiveModal();
  
  // Don't render if not active or no options
  if (!options.length || !isFinalFiveActive) {
    return null;
  }
  
  return (
    <div className={finalFiveStyles.modalContainer}>
      <motion.div 
        className={finalFiveStyles.modalContent}
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
        <div className={finalFiveStyles.mobileHandle}></div>
        
        {/* Header */}
        <h2 
          className={`${finalFiveStyles.header} ${righteous.className}`}
          style={{ color: themeColor }}
        >
          FINAL 5
        </h2>
        
        {/* Message */}
        <p className={finalFiveStyles.message}>
          {getMessage()}
        </p>
        
        {/* Grid of cards - 3-2 layout with timer in the bottom center */}
        <div className={finalFiveStyles.cardGrid}>
          {options.map((option, index) => {
            const { frontBg, backBg, textColor } = getCardStyles(option);
            
            return (
              <FinalFiveCard
                key={`option-${index}`}
                option={option}
                index={index}
                isFlipped={flippedCards[index]}
                isGameOver={isGameOver}
                animationComplete={animationComplete}
                frontBg={frontBg}
                backBg={backBg}
                textColor={textColor}
                isCorrect={isCorrectOption(option)}
                isIncorrectGuess={isIncorrectGuess(option)}
                onCardClick={handleOptionClick}
              />
            );
          })}
          
          {/* Timer - as part of the grid */}
          {allCardsFlipped && (
            <motion.div 
              className={finalFiveStyles.timerContainer}
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
              <div className={finalFiveStyles.timerWrapper}>
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
        <div className={finalFiveStyles.buttonContainer}>
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
                  className={finalFiveStyles.continueButton}
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