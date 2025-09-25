'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useFinalFiveModal } from './hooks';
import Timer from '../../ui/Timer';
import FinalFiveCard from '../FinalFiveCard';
import styles from './FinalFiveModal.module.css';
import BaseModal from '@/components/modals/BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { capitalizeAnswer } from '@/helpers/gameLogic';
import { getFinalFiveGridClasses, getFinalFiveCardDimensions } from '../shared/helpers';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const FinalFiveModal = React.memo(() => {
  const {
    options,
    flippedCards,
    allCardsFlipped,
    showContinueButton,
    isFinalFiveActive,
    isGameOver,
    isFinalFiveCompleted,
    finalFiveTimeRemaining,
    gameOutcome,
    animationComplete,
    loading,
    selectedOption,
    timerReachedZero,
    correctAnswer,
    width,
    height,
    isLandscape,
    themeColor,
    primaryColorClass,
    getMessage,
    getCardStyles,
    isCorrectOption,
    isIncorrectGuess,
    handleOptionClick,
    closeFinalFive
  } = useFinalFiveModal();

  const { t } = useTranslation();
  
  const finalFiveError = useGameStore(state => state.finalFiveError);
  const resetFinalFiveError = useGameStore(state => state.resetFinalFiveError);
  const triggerFinalFive = useGameStore(state => state.triggerFinalFive);
  
  if (finalFiveError) {
    return (
      <BaseModal
        isOpen={true}
        onClose={() => resetFinalFiveError()}
        colors={{ primary: primaryColorClass }}
        mobileHeight={'auto'}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className={styles.warningIconContainer}>
            <div className={styles.warningIcon}>
              <span className="text-2xl">!</span>
            </div>
            <p>{finalFiveError}</p>
          </div>
          <button
            className={styles.continueButton}
            style={{ backgroundColor: themeColor }}
            onClick={() => {
              resetFinalFiveError();
              // Add a small delay to prevent rapid clicking and rate limit issues
              setTimeout(() => triggerFinalFive(), 500);
            }}
          >
            {t('ui.buttons.tryAgain')}
          </button>
        </div>
      </BaseModal>
    );
  }
  
  return (
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
            className={`${styles.header} ${righteous.className}`}
            style={{ color: themeColor }}
          >
            {t('game.finalFive.title')}
          </h2>
            
            <div className={styles.message}>
              {(() => {
                const message = getMessage();
                
                if (typeof message === 'string' && 
                    (message === t('game.finalFive.checkingAnswer') || 
                     message === t('game.finalFive.verifyingGuess') ||
                     message === t('game.finalFive.determiningAnswer') ||
                     message === t('game.finalFive.slowConnection') ||
                     message.includes(t('game.finalFive.retrying')) ||
                     (timerReachedZero && loading && !correctAnswer))) {
                  
                  return (
                    <span className="flex flex-col items-center justify-center">
                      <span className="flex items-center justify-center mb-2">
                        <div 
                          className={`h-5 w-5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent ${styles.loadingSpinner}`}
                          style={{ color: themeColor }}
                        />
                        <span>
                          {timerReachedZero ? t('game.finalFive.loadingAnswer') : message}
                        </span>
                      </span>
                      
                      {message.includes(t('game.finalFive.retrying')) && (
                        <span className="text-xs text-gray-500">
                          {message}
                        </span>
                      )}
                    </span>
                  );
                }
                
                if (typeof message === 'string' && 
                    (message.includes(t('game.finalFive.theCorrectAnswerWas')) || 
                     message.includes(t('game.finalFive.timesUp')))) {
                  
                  if (message.includes(t('game.finalFive.timesUp')) && 
                      !message.includes(t('game.finalFive.theCorrectAnswerWas'))) {
                    return (
                      <span className="flex items-center justify-center">
                        <div 
                          className={`h-5 w-5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent ${styles.loadingSpinner}`}
                          style={{ color: themeColor }}
                        />
                        <span>{t('game.finalFive.loadingAnswer')}</span>
                      </span>
                    );
                  }
                  
                  if (message.includes(t('game.finalFive.timesUp'))) {
                    const parts = message.split(t('game.finalFive.theCorrectAnswerWas'));
                    if (parts.length === 2) {
                      return (
                        <>
                          {t('game.finalFive.theCorrectAnswerWas')}{' '}
                          <span style={{ color: themeColor, fontWeight: 'bold' }}>
                            {parts[1].trim()}
                          </span>
                        </>
                      );
                    }
                  }
                  
                  const parts = message.split(t('game.finalFive.theCorrectAnswerWas') + ' ');
                  if (parts.length === 2) {
                    return (
                      <>
                        {t('game.finalFive.theCorrectAnswerWas')}{' '}
                        <span style={{ color: themeColor, fontWeight: 'bold' }}>
                          {capitalizeAnswer(parts[1])}
                        </span>
                      </>
                    );
                  }
                }
                
                return message;
              })()}
            </div>
            
            <div className={getFinalFiveGridClasses(width, height, isLandscape)}>
              {options.map((option: string, index: number) => {
                const { frontBg, backBg, textColor } = getCardStyles(option);
                
                return (
                  <FinalFiveCard
                    key={`option-${index}`}
                    option={option}
                    index={index}
                    isFlipped={flippedCards[index]}
                    isGameOver={isFinalFiveCompleted || timerReachedZero}
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
              
              {allCardsFlipped && !selectedOption && (
                <motion.div 
                  className={styles.timerContainer}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: (isGameOver && animationComplete) || selectedOption || timerReachedZero ? 0 : 1,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  style={{ 
                    ...getFinalFiveCardDimensions(width, height, isLandscape),
                    margin: "0 auto"
                  }}
                >
                  <div className={styles.timerWrapper}>
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
            
            <div className={styles.buttonContainer}>
              <AnimatePresence>
                {showContinueButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-x-0 flex justify-center"
                  >
                    <button
                      className={styles.continueButton}
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
});

FinalFiveModal.displayName = 'FinalFiveModal';

export default FinalFiveModal; 