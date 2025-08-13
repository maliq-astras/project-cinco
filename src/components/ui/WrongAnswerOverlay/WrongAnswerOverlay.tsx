'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface WrongAnswerOverlayProps {
  isVisible: boolean;
  wrongGuessCount: number;
  maxGuesses: number;
  onAnimationComplete: () => void;
}

export default function WrongAnswerOverlay({
  isVisible,
  wrongGuessCount,
  maxGuesses,
  onAnimationComplete
}: WrongAnswerOverlayProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [modalAnimation, setModalAnimation] = React.useState("visible");
  
  const remainingGuesses = maxGuesses - wrongGuessCount;
  
  // Always generate 5 X mark slots, but only show the ones with wrong guesses
  const maxXMarks = 5;
  const xMarkSlots = Array.from({ length: maxXMarks }, (_, i) => i);
  
  // Trigger shake animation after modal appears
  React.useEffect(() => {
    if (isVisible) {
      setModalAnimation("visible");
      const timer = setTimeout(() => {
        setModalAnimation("shake");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    hidden: {
      scale: 0.85,
      opacity: 0,
      x: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "backOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    shake: {
      scale: 1,
      opacity: 1,
      x: [-8, 8, -8, 8, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      x: 0,
      transition: {
        duration: 0.25,
        ease: "easeIn"
      }
    }
  };

  const xMarkVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "backOut",
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };

  const textVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.8, // Fixed delay for consistent timing
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: 0.3
      }
    }
  };

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white dark:bg-black rounded-2xl p-4 sm:p-8 md:p-10 lg:p-12 shadow-2xl border-4 mx-4 text-center w-80 sm:w-96 md:w-[28rem] lg:w-[32rem]"
            style={{ 
              borderColor: `var(--color-${colors.primary})`,
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 4px var(--color-${colors.primary})`
            }}
            variants={modalVariants}
            initial="hidden"
            animate={modalAnimation}
            exit="exit"
          >
            {/* X Marks Container */}
            <motion.div 
              className="flex justify-center items-center mb-6 gap-1 sm:gap-2 md:gap-2.5 lg:gap-3"
              variants={pulseVariants}
              animate="pulse"
            >
              {xMarkSlots.map((_, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={xMarkVariants}
                  initial="hidden"
                  animate={index < wrongGuessCount ? "visible" : "hidden"}
                  custom={index}
                  style={{ 
                    visibility: index < wrongGuessCount ? 'visible' : 'hidden'
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center border-4 shadow-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16"
                    style={{
                      backgroundColor: `var(--color-${colors.primary})`,
                      borderColor: `var(--color-${colors.accent})`,
                      boxShadow: `0 4px 12px rgba(var(--color-${colors.primary}-rgb), 0.4)`
                    }}
                  >
                    <motion.span
                      className={`${righteous.className} text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl`}
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
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: `var(--color-${colors.primary})`,
                      opacity: 0.3
                    }}
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
              className="space-y-4"
            >
              <motion.h2 
                className={`${righteous.className} text-2xl sm:text-3xl font-bold uppercase`}
                style={{ color: `var(--color-${colors.primary})` }}
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
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.1, // Fixed delay for consistent timing
                  duration: 0.5
                }}
              >
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  {remainingGuesses > 0 
                    ? t('game.wrongAnswer.guessesLeft', { count: remainingGuesses, guesses: remainingGuesses })
                    : t('game.wrongAnswer.noGuessesLeft')
                  }
                </p>
              </motion.div>

              {/* Progress indicator */}
              <motion.div
                className="flex justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 1.2, // Fixed delay for consistent timing
                  duration: 0.5
                }}
              >
                <div className="flex space-x-2">
                  {Array.from({ length: maxGuesses }, (_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full border-2"
                      style={{
                        backgroundColor: i < wrongGuessCount 
                          ? `var(--color-${colors.primary})` 
                          : 'transparent',
                        borderColor: `var(--color-${colors.primary})`
                      }}
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