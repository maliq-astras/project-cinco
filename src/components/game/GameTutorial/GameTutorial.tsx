import React from 'react';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useGameTutorial } from './hooks';
import { 
  getOverlayMaskStyle, 
  getSpotlightStyle,
  getTextBoxStyle,
  getTitleStyle,
  getProgressDotStyle,
  getTextBoxAnimationProps,
  getTitleAnimationProps,
  getDescriptionAnimationProps,
  getProgressContainerAnimationProps
} from './helpers';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './GameTutorial.module.css';

const inter = Inter({ subsets: ['latin'] });

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameTutorial = React.memo(function GameTutorial({ isOpen, onClose }: GameTutorialProps) {
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
        style={getTextBoxStyle(colors.primary, darkMode, textBoxStyles)}
        {...getTextBoxAnimationProps(textBoxStyles)}
        layout
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h3 
          className={styles.textBoxTitle}
          style={getTitleStyle(colors.primary)}
          {...getTitleAnimationProps()}
        >
          {currentTutorialStep.title}
        </motion.h3>
        <motion.p 
          className={styles.textBoxDescription}
          {...getDescriptionAnimationProps()}
        >
          {currentTutorialStep.description}
        </motion.p>
      </motion.div>

      <motion.div 
        className={styles.progressContainer}
        {...getProgressContainerAnimationProps()}
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
              style={getProgressDotStyle(colors.primary, index === currentStep)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

GameTutorial.displayName = 'GameTutorial';

export default GameTutorial; 