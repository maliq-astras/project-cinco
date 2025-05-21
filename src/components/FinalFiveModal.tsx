'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveModal } from '../hooks';
import Timer from './Timer';
import FinalFiveCard from './FinalFiveCard';
import { finalFiveStyles } from '../styles/finalFiveStyles';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { capitalizeAnswer } from '../helpers/gameLogic';
import { createPortal } from 'react-dom';

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
    loading,
    selectedOption,
    timerReachedZero,
    correctAnswer,
    
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

  const { t } = useTranslation();
  
  // Get error state from the game store
  const finalFiveError = useGameStore(state => state.finalFiveError);
  const resetFinalFiveError = useGameStore(state => state.resetFinalFiveError);
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  
  // If there's an error, show error state instead of normal content
  if (finalFiveError) {
    const errorModal = (
      <div className={finalFiveStyles.modalContainer}>
        <motion.div 
          className={finalFiveStyles.modalContent}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ 
            type: "tween", 
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <div className={finalFiveStyles.mobileHandle}></div>
          <h2 
            className={`${finalFiveStyles.header} ${righteous.className}`}
            style={{ color: themeColor }}
          >
            {t('game.finalFive.title')}
          </h2>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className={finalFiveStyles.warningIcon.container}>
              <div className={finalFiveStyles.warningIcon.icon}>
                <span className="text-2xl">!</span>
              </div>
              <p>{finalFiveError}</p>
            </div>
            <button
              className={finalFiveStyles.continueButton}
              style={{ backgroundColor: themeColor }}
              onClick={() => {
                resetFinalFiveError();
                triggerFinalFive();
              }}
            >
              {t('ui.buttons.tryAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
    if (typeof window === 'undefined') return null;
    return createPortal(errorModal, document.body);
  }
  
  // Don't render if not active or no options
  if (!options.length || !isFinalFiveActive) {
    return null;
  }
  
  const modal = (
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
          {t('game.finalFive.title')}
        </h2>
        
        {/* Message */}
        <div className={`${finalFiveStyles.message} text-center`}>
          {(() => {
            const message = getMessage();
            
            // Add loading animation for verifying guess or checking answer
            if (typeof message === 'string' && 
                (message === t('game.finalFive.checkingAnswer') || 
                 message === t('game.finalFive.verifyingGuess') ||
                 message === t('game.finalFive.slowConnection') ||
                 message.includes(t('game.finalFive.retrying')) ||
                 (timerReachedZero && loading && !correctAnswer))) {
              
              // Show loading spinner with primary theme color
              return (
                <span className="flex flex-col items-center justify-center">
                  <span className="flex items-center justify-center mb-2">
                    <div 
                      className={finalFiveStyles.loadingSpinnerClass}
                      style={finalFiveStyles.loadingSpinner(themeColor)}
                    />
                    <span>
                      {timerReachedZero ? t('game.finalFive.loadingAnswer') : message}
                    </span>
                  </span>
                  
                  {/* Show retry count if retrying */}
                  {message.includes(t('game.finalFive.retrying')) && (
                    <span className="text-xs text-gray-500">
                      {message}
                    </span>
                  )}
                </span>
              );
            }
            
            // Style "correct answer was" message
            if (typeof message === 'string' && 
                (message.includes(t('game.finalFive.theCorrectAnswerWas')) || 
                 message.includes(t('game.finalFive.timesUp')))) {
              
              // If the message doesn't contain the actual answer yet (database still loading)
              if (message.includes(t('game.finalFive.timesUp')) && 
                  !message.includes(t('game.finalFive.theCorrectAnswerWas'))) {
                return (
                  <span className="flex items-center justify-center">
                    <div 
                      className={finalFiveStyles.loadingSpinnerClass}
                      style={finalFiveStyles.loadingSpinner(themeColor)}
                    />
                    <span>{t('game.finalFive.loadingAnswer')}</span>
                  </span>
                );
              }
              
              // Handle "time's up" message with special formatting
              if (message.includes(t('game.finalFive.timesUp'))) {
                const parts = message.split(t('game.finalFive.theCorrectAnswerWas'));
                if (parts.length === 2) {
                  return (
                    <>
                      {t('game.finalFive.theCorrectAnswerWas')}{' '}
                      <span style={finalFiveStyles.correctAnswerText(themeColor)}>
                        {parts[1].trim()}
                      </span>
                    </>
                  );
                }
              }
              
              // Regular correct answer message
              const parts = message.split(t('game.finalFive.theCorrectAnswerWas') + ' ');
              if (parts.length === 2) {
                return (
                  <>
                    {t('game.finalFive.theCorrectAnswerWas')}{' '}
                    <span style={finalFiveStyles.correctAnswerText(themeColor)}>
                      {capitalizeAnswer(parts[1])}
                    </span>
                  </>
                );
              }
            }
            
            return message;
          })()}
        </div>
        
        {/* Grid of cards - 3-2 layout with timer in the bottom center */}
        <div className={finalFiveStyles.getCardGrid()}>
          {options.map((option: string, index: number) => {
            const { frontBg, backBg, textColor } = getCardStyles(option);
            
            return (
              <FinalFiveCard
                key={`option-${index}`}
                option={option}
                index={index}
                isFlipped={flippedCards[index]}
                isGameOver={isGameOver || timerReachedZero}
                animationComplete={animationComplete || timerReachedZero}
                frontBg={frontBg}
                backBg={backBg}
                textColor={textColor}
                isCorrect={isCorrectOption(option)}
                isIncorrectGuess={isIncorrectGuess(option)}
                onCardClick={handleOptionClick}
                allCardsFlipped={allCardsFlipped}
                selectedOption={selectedOption}
              />
            );
          })}
          
          {/* Timer - as part of the grid */}
          {allCardsFlipped && !selectedOption && (
            <motion.div 
              className={finalFiveStyles.timerContainer}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: (isGameOver && animationComplete) || selectedOption || timerReachedZero ? 0 : 1,
                scale: 1 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              style={{ 
                minHeight: finalFiveStyles.card.getDimensions().minHeight,
                maxWidth: finalFiveStyles.card.getDimensions().maxWidth,
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
                  {t('ui.buttons.continue')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
} 