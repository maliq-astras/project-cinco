'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import styles from './FinalFiveCard.module.css';
import { useFinalFiveCard } from './hooks';
import { getFinalFiveCardDimensions } from '../shared/helpers';
import { 
  getFinalFiveCardAnimations, 
  getFlipAnimationProps, 
  getXOverlayAnimations,
  getWrapperStyle,
  getFrontCardStyle,
  getContainerStyle
} from './helpers';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface FinalFiveCardProps {
  option: string;
  index: number;
  isFlipped: boolean;
  isGameOver: boolean;
  frontBg: string;
  backBg: string;
  textColor: string;
  isCorrect: boolean;
  isIncorrectGuess: boolean;
  onCardClick: (option: string) => void;
  allCardsFlipped: boolean;
  selectedOption: string | null;
}

const FinalFiveCard = React.memo<FinalFiveCardProps>(({
  option,
  index,
  isFlipped,
  isGameOver,
  frontBg,
  backBg,
  textColor,
  isCorrect,
  isIncorrectGuess,
  onCardClick,
  allCardsFlipped,
  selectedOption
}) => {
  const {
    shouldFadeOut,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    getBackCardStyle,
    width,
    height,
    isLandscape
  } = useFinalFiveCard({
    isGameOver,
    allCardsFlipped,
    selectedOption,
    option,
    frontBg,
    isCorrect
  });

  const cardDimensions = getFinalFiveCardDimensions(width, height, isLandscape);
  const canClick = isFlipped && !isGameOver && allCardsFlipped && (selectedOption === null || selectedOption === option);
  
  const cardAnimations = getFinalFiveCardAnimations(shouldFadeOut);
  const flipAnimations = getFlipAnimationProps(isFlipped);
  const containerStyle = getContainerStyle(cardDimensions.minHeight, cardDimensions.maxWidth, canClick);
  const wrapperStyle = getWrapperStyle();

  return (
    <motion.div 
      key={`option-${index}`} 
      className={styles.container}
      {...cardAnimations}
      style={containerStyle}
    >
      <motion.div
        className={styles.wrapper}
        {...flipAnimations}
        style={wrapperStyle}
      >      
        <div 
          className={`${styles.front} ${righteous.className}`}
          style={getFrontCardStyle(frontBg)}
        >
          5
        </div>
         
        <div 
          className={styles.back}
          style={getBackCardStyle(backBg, textColor)}
          onClick={() => (!isGameOver && allCardsFlipped && !selectedOption) && onCardClick(option)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className={styles.optionText}>
            {option}
          </span>
          
          {isGameOver && isIncorrectGuess && (
            <div 
              className={styles.xOverlay}
              aria-hidden="true"
            >
              <motion.div
                {...getXOverlayAnimations()}
                className={styles.xOverlayContent}
              >
                <svg 
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.xSvg}
                >
                  <g stroke={frontBg} strokeWidth="12" strokeLinecap="round">
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
});

FinalFiveCard.displayName = 'FinalFiveCard';

export default FinalFiveCard; 