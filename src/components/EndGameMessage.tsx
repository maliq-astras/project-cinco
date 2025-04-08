import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useEndGameMessage, GameOutcome } from '../hooks/components/endGameMessage';
import { endGameMessageStyles } from '../styles/endGameMessageStyles';
import { useTranslation } from 'react-i18next';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface EndGameMessageProps {
  outcome: GameOutcome;
  correctAnswer: string;
  numberOfTries?: number;
  timeSpent: number;
}

export default function EndGameMessage({ 
  outcome, 
  correctAnswer, 
  numberOfTries = 0,
  timeSpent
}: EndGameMessageProps) {
  const {
    showConfetti,
    confettiPieces,
    showTomorrowMessage,
    timeFormatted,
    shouldShowTime,
    messageData,
    colors
  } = useEndGameMessage({ outcome, correctAnswer, numberOfTries, timeSpent });

  const { t } = useTranslation();

  const getMessage = () => {
    const { type, displayAnswer, numberOfTries: tries } = messageData;
    const answerSpan = (
      <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }}>
        {displayAnswer}
      </span>
    );
    const finalFiveSpan = (
      <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }} className={righteous.className}>
        FINAL 5
      </span>
    );

    switch(type) {
      case 'standard-win':
        // Split the translation into parts using the answer as delimiter
        const standardWinParts = t('game.endGame.standardWin', { 
          answer: '{{answer}}', 
          tries, 
          count: tries 
        }).split('{{answer}}');
        
        return (
          <div>
            {standardWinParts[0]}
            {answerSpan}
            {standardWinParts[1]}
          </div>
        );
      case 'final-five-win':
        // Split the translation into parts using the answer as delimiter
        const finalFiveWinParts = t('game.endGame.finalFiveWin', { 
          answer: '{{answer}}' 
        }).split('{{answer}}');
        
        return (
          <div>
            {finalFiveWinParts[0]}
            {answerSpan}
            {finalFiveWinParts[1]}
          </div>
        );
      case 'loss-final-five-wrong':
        // Split the translation into parts using the answer as delimiter
        const lossWrongGuessParts = t('game.endGame.lossWrongGuess', { 
          answer: '{{answer}}' 
        }).split('{{answer}}');
        
        return (
          <div>
            {lossWrongGuessParts[0]}
            {answerSpan}
            {lossWrongGuessParts[1]}
          </div>
        );
      case 'loss-final-five-time':
      case 'loss-time':
        // Split the translation into parts using the answer as delimiter
        const lossTimeUpParts = t('game.endGame.lossTimeUp', { 
          answer: '{{answer}}' 
        }).split('{{answer}}');
        
        return (
          <div>
            {lossTimeUpParts[0]}
            {answerSpan}
            {lossTimeUpParts[1]}
          </div>
        );
    }
  };

  return (
    <div className={endGameMessageStyles.container} style={{ minHeight: '160px' }}>
      <motion.div
        className={endGameMessageStyles.messageWrapper}
        {...endGameMessageStyles.messageWrapperAnimation}
      >
        {/* Confetti animation - only for win scenarios */}
        {showConfetti && confettiPieces.map(piece => (
          <motion.div
            key={piece.id}
            className={endGameMessageStyles.confettiPiece}
            {...endGameMessageStyles.confettiAnimation(piece.angle)}
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: '50%',
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%'
            }}
          />
        ))}
        
        {/* Message text */}
        <motion.div
          className={endGameMessageStyles.messageContent}
          {...endGameMessageStyles.messageContentAnimation}
        >
          {getMessage()}
          
          {/* Time display - only for standard wins */}
          {shouldShowTime && (
            <div className={endGameMessageStyles.timeDisplay}>
              <span style={{ color: `var(--color-${colors.primary})` }}>
                {timeFormatted}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={endGameMessageStyles.shareIcon}
                style={{ color: `var(--color-${colors.primary})` }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-label={t('game.endGame.share')}
              >
                <title>{t('game.endGame.share')}</title>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                />
              </svg>
            </div>
          )}
          
          {/* "Come back tomorrow" message (animated in after a delay) */}
          <AnimatePresence>
            {showTomorrowMessage && (
              <motion.div 
                className={endGameMessageStyles.tomorrowMessage}
                style={{ color: `var(--color-${colors.primary})` }}
                {...endGameMessageStyles.tomorrowMessageAnimation}
              >
                {t('game.endGame.comeBackTomorrow')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
} 