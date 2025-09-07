import React from 'react';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useGameTutorial } from './useGameTutorial';
import { getOverlayMaskStyle, getSpotlightStyle } from './helpers';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './GameTutorial.module.css';

const inter = Inter({ subsets: ['latin'] });

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameTutorial({ isOpen, onClose }: GameTutorialProps) {
  const {
    currentStep,
    spotlightStyles,
    textBoxStyles,
    colors,
    tutorialSteps,
    handleClick,
    continueText,
  } = useGameTutorial({ isOpen, onClose });
  
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  const isLogo = tutorialSteps[currentStep].target === 'header-area';

  return (
    <div 
      className={styles.container}
      onClick={handleClick}
    >
      <div className={styles.overlay} style={{ pointerEvents: 'none' }}>
        <div style={getOverlayMaskStyle(spotlightStyles, isLogo)} />
      </div>

      <div
        className={styles.spotlightWrapper}
        style={getSpotlightStyle(spotlightStyles, isLogo, darkMode)}
      />

      <motion.div 
        className={`${inter.className} ${styles.textBox}`}
        style={{
          borderColor: `var(--color-${colors.primary})`,
          boxShadow: darkMode 
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5)' 
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1,
          scale: 1,
          x: parseFloat(textBoxStyles.left),
          y: parseFloat(textBoxStyles.top),
          width: parseFloat(textBoxStyles.width)
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          layout: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        layout
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h3 
          className={styles.textBoxTitle}
          style={{ color: `var(--color-${colors.primary})` }}
          layout="position"
          transition={{ duration: 0.4 }}
        >
          {currentTutorialStep.title}
        </motion.h3>
        <motion.p 
          className={styles.textBoxDescription}
          layout="position"
          transition={{ duration: 0.4 }}
        >
          {currentTutorialStep.description}
        </motion.p>
      </motion.div>

      <motion.div 
        className={styles.progressContainer}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: 0
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <motion.p 
          className={styles.progressText}
        >
          {continueText}
        </motion.p>
        <motion.div 
          className={styles.progressDots}
        >
          {tutorialSteps.map((_, index) => (
            <motion.div
              key={index}
              className={styles.progressDot}
              style={{
                backgroundColor: index === currentStep 
                  ? `var(--color-${colors.primary})`
                  : `var(--color-${colors.primary}30)`
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 