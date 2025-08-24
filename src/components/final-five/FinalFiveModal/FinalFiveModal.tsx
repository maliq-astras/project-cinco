'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveModal } from './useFinalFiveModal';
import Timer from '../../ui/Timer';
import FinalFiveCard from '../FinalFiveCard';
import { finalFiveStyles } from './FinalFiveModal.styles';
import BaseModal from '@/components/modals/BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { capitalizeAnswer } from '@/helpers/gameLogic';

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
    
    // Responsive values
    width,
    height,
    isLandscape,
    
    // Styles and helpers
    themeColor,
    primaryColorClass,
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
  
  // If there's an error, show error state instead of normal content via BaseModal
  if (finalFiveError) {
    return (
      <BaseModal
        isOpen={true}
        onClose={() => resetFinalFiveError()}
        colors={{ primary: primaryColorClass }}
        mobileHeight={'auto'}
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
  
  const modal = (
    <AnimatePresence>
      {(options.length > 0 && isFinalFiveActive) && (
        <BaseModal
          isOpen={true}
          onClose={() => {}}
          colors={{ primary: primaryColorClass }}
          mobileHeight={'auto'}
          dismissible={false}
        >
          <h2 
            className={`${finalFiveStyles.header} ${righteous.className}`}
            style={{ color: themeColor }}
          >
            {t('game.finalFive.title')}
          </h2>
            
            {/* Message */}
            <div className={finalFiveStyles.message}>
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
                          className={`${finalFiveStyles.loadingSpinnerClass} ${finalFiveStyles.loadingSpinner}`}
                          style={{ color: themeColor }}
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
                          className={`${finalFiveStyles.loadingSpinnerClass} ${finalFiveStyles.loadingSpinner}`}
                          style={{ color: themeColor }}
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
            <div className={finalFiveStyles.getCardGrid(width, height, isLandscape)}>
              {options.map((option: string, index: number) => {
                const { frontBg, backBg, textColor } = getCardStyles(option);
                
                return (
                  <FinalFiveCard
                    key={`option-${index}`}
                    option={option}
                    index={index}
                    isFlipped={flippedCards[index]}
                    isGameOver={isGameOver || timerReachedZero}
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
                    minHeight: finalFiveStyles.card.getDimensions(width, height, isLandscape).minHeight,
                    maxWidth: finalFiveStyles.card.getDimensions(width, height, isLandscape).maxWidth,
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
        </BaseModal>
      )}
    </AnimatePresence>
  );
  return modal;
} 