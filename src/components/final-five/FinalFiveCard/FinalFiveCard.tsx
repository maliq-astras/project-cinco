'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { finalFiveCardStyles } from './FinalFiveCard.styles';
import { useFinalFiveCard } from './useFinalFiveCard';

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

/**
 * Individual card for Final Five options
 */
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
    getBackCardStyle
  } = useFinalFiveCard({
    isGameOver,
    allCardsFlipped,
    selectedOption,
    option,
    frontBg,
    isCorrect
  });

  // Get dimensions for the card based on device
  const cardDimensions = finalFiveCardStyles.getDimensions();

  return (
    <motion.div 
      key={`option-${index}`} 
      className={finalFiveCardStyles.container}
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
        className={finalFiveCardStyles.wrapper}
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
        {/* Front of card - Number 5 */}
        <div 
          className={`${finalFiveCardStyles.front} ${righteous.className} ${finalFiveCardStyles.frontNumber}`}
          style={{ 
            backgroundColor: frontBg,
            color: "white",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            fontSize: "3.5rem",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          5
        </div>
        
        {/* Back of card - Option text */}
        <div 
          className={finalFiveCardStyles.back}
          style={getBackCardStyle(backBg, textColor)}
          onClick={() => (!isGameOver && allCardsFlipped && !selectedOption) && onCardClick(option)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className={finalFiveCardStyles.optionText}>
            {option}
          </span>
          
          {/* X overlay for incorrect guesses */}
          {isGameOver && isIncorrectGuess && (
            <div 
              className={finalFiveCardStyles.xOverlay}
              aria-hidden="true"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={finalFiveCardStyles.xOverlayContent}
              >
                <svg 
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={finalFiveCardStyles.xSvg}
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