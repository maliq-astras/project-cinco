'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import styles from './FinalFiveCard.module.css';
import { useFinalFiveCard } from './useFinalFiveCard';
import { getFinalFiveCardDimensions } from '../shared/helpers';

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

export default function FinalFiveCard({
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
}: FinalFiveCardProps) {
  const {
    shouldFadeOut,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    getBackCardStyle,
    width,
    height,
    isLandscape,
    responsiveValues
  } = useFinalFiveCard({
    isGameOver,
    allCardsFlipped,
    selectedOption,
    option,
    frontBg,
    isCorrect
  });

  const cardDimensions = getFinalFiveCardDimensions(width, height, isLandscape);

  return (
    <motion.div 
      key={`option-${index}`} 
      className={styles.container}
      animate={{ 
        opacity: shouldFadeOut ? 0 : 1,
        scale: shouldFadeOut ? 0.8 : 1
      }}
      transition={{ duration: 0.5 }}
      style={{ 
        minHeight: cardDimensions.minHeight,
        maxWidth: cardDimensions.maxWidth,
        margin: "0 auto",
        pointerEvents: (!isFlipped || isGameOver || !allCardsFlipped || (selectedOption !== null && selectedOption !== option)) ? "none" : "auto"
      }}
    >
      <motion.div
        className={styles.wrapper}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          type: "spring", 
          stiffness: 200,
          damping: 25,
          duration: 0.8
        }}
        style={{ 
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d"
        }}
      >      
        <div 
          className={`${styles.front} ${righteous.className}`}
          style={{ 
            backgroundColor: frontBg,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
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
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
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
} 