'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useWrongAnswerOverlay } from './hooks';
import {
  overlayVariants,
  modalVariants,
  xMarkVariants,
  textVariants,
  pulseVariants
} from './helpers';
import styles from './WrongAnswerOverlay.module.css';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface WrongAnswerOverlayProps {
  maxGuesses: number;
}

export default function WrongAnswerOverlay({
  maxGuesses
}: WrongAnswerOverlayProps) {
  const {
    isVisible,
    wrongGuessCount,
    modalAnimation,
    remainingGuesses,
    xMarkSlots,
    onAnimationComplete,
    modalStyle,
    getXMarkCircleStyleForIndex,
    glowingRingStyle,
    titleStyle,
    getProgressDotStyleForIndex,
    t
  } = useWrongAnswerOverlay({ maxGuesses });

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={styles.modal}
            style={modalStyle}
            variants={modalVariants}
            initial="hidden"
            animate={modalAnimation}
            exit="exit"
          >
            {/* X Marks Container */}
            <motion.div 
              className={styles.xMarksContainer}
              variants={pulseVariants}
              animate="pulse"
            >
              {xMarkSlots.map((_, index) => (
                <motion.div
                  key={index}
                  className={styles.xMarkContainer}
                  variants={xMarkVariants}
                  initial="hidden"
                  animate={index < wrongGuessCount ? "visible" : "hidden"}
                  custom={index}
                  style={{ 
                    visibility: index < wrongGuessCount ? 'visible' : 'hidden'
                  }}
                >
                  <div
                    className={styles.xMarkCircle}
                    style={getXMarkCircleStyleForIndex()}
                  >
                    <motion.span
                      className={`${righteous.className} ${styles.xMarkText}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                    >
                      ✕
                    </motion.span>
                  </div>
                  
                  {/* Glowing ring effect */}
                  <motion.div
                    className={styles.glowingRing}
                    style={glowingRingStyle}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      delay: index * 0.1 + 0.5,
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Wrong Answer Text */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className={styles.textContent}
            >
              <motion.h2 
                className={`${righteous.className} ${styles.title}`}
                style={titleStyle}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.9, // Fixed delay for consistent timing
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300
                }}
              >
                {t('game.wrongAnswer.title')}
              </motion.h2>

              {/* Remaining guesses */}
              <motion.div
                className={styles.remainingGuesses}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.1, // Fixed delay for consistent timing
                  duration: 0.5
                }}
              >
                <p className={styles.remainingGuessesText}>
                  {remainingGuesses > 0 
                    ? t('game.wrongAnswer.guessesLeft', { count: remainingGuesses, guesses: remainingGuesses })
                    : t('game.wrongAnswer.noGuessesLeft')
                  }
                </p>
              </motion.div>

              {/* Progress indicator */}
              <motion.div
                className={styles.progressIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 1.2, // Fixed delay for consistent timing
                  duration: 0.5
                }}
              >
                <div className={styles.progressDots}>
                  {Array.from({ length: maxGuesses }, (_, i) => (
                    <motion.div
                      key={i}
                      className={styles.progressDot}
                      style={getProgressDotStyleForIndex(i < wrongGuessCount)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1.0 + (i * 0.05), // Fixed base delay for consistent timing
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 