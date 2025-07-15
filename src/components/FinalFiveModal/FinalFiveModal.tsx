'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveModal } from './useFinalFiveModal';
import Timer from '../Timer';
import FinalFiveCard from '../FinalFiveCard';
import { finalFiveStyles } from './FinalFiveModal.styles';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { capitalizeAnswer } from '../../helpers/gameLogic';
import BaseModal from '../modals/BaseModal';

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
  
  // Get colors for BaseModal - extract color name from CSS variable
  const colorName = themeColor.replace('var(--color-', '').replace(')', '');
  const colors = { primary: colorName };

  // If there's an error, show error content
  if (finalFiveError) {
    return (
      <BaseModal
        isOpen={isFinalFiveActive}
        onClose={() => {
          resetFinalFiveError();
          closeFinalFive();
        }}
        title={
          <span 
            className={`${righteous.className} uppercase`}
            style={{ color: themeColor }}
          >
            {t('game.finalFive.title')}
          </span>
        }
        colors={colors}
        className="max-w-[580px]"
        dismissible={false}
        mobileHeight="90vh"
      >
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
      </BaseModal>
    );
  }

  // Render the main modal content
  return (
    <BaseModal
      isOpen={options.length > 0 && isFinalFiveActive}
      onClose={closeFinalFive}
      title={
        <span 
          className={`${righteous.className} uppercase`}
              style={{ color: themeColor }}
            >
              {t('game.finalFive.title')}
        </span>
      }
      colors={colors}
      className="max-w-[580px]"
      dismissible={false}
      mobileHeight="90vh"
    >
            {/* Message */}
      <div className={`${finalFiveStyles.message} text-center mb-6`}>
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
                      className="text-5xl font-bold text-gray-800 dark:text-gray-100"
                    />
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Continue/Close button */}
            <div className={finalFiveStyles.buttonContainer}>
              <AnimatePresence>
                {showContinueButton && (
                  <motion.button
                    key="continue-button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={finalFiveStyles.continueButton}
                    style={{ backgroundColor: themeColor }}
                    onClick={closeFinalFive}
                  >
                    {t('ui.buttons.continue')}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
    </BaseModal>
  );
} 