import React from 'react';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useGameTutorial } from './useGameTutorial';
import { gameTutorialStyles } from './GameTutorial.styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useFluidResponsive } from '@/hooks/ui';

const inter = Inter({ subsets: ['latin'] });

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  textPosition: 'left' | 'right' | 'top' | 'bottom';
}



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
    continueText
  } = useGameTutorial({ isOpen, onClose });
  
  const { darkMode } = useTheme();
  const { height } = useFluidResponsive();

  if (!isOpen) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div 
      className={gameTutorialStyles.container}
      onClick={handleClick}
    >
      {/* Mask-based overlay */}
      <div className={gameTutorialStyles.overlay} style={{ pointerEvents: 'none' }}>
        <div style={gameTutorialStyles.overlayMask(spotlightStyles, tutorialSteps[currentStep].target === 'header-area')} />
      </div>

      {/* White border around the spotlight (adjusted for dark mode) */}
      <div
        className={gameTutorialStyles.spotlightWrapper}
        style={gameTutorialStyles.spotlight(spotlightStyles, tutorialSteps[currentStep].target === 'header-area', darkMode)}
      />

      {/* Tutorial text box */}
      <motion.div 
        className={`${inter.className} ${gameTutorialStyles.textBox}`}
        style={gameTutorialStyles.textBoxBorder(colors.primary, darkMode)}
        {...gameTutorialStyles.textBoxAnimation}
        animate={gameTutorialStyles.textBoxAnimation.animate(textBoxStyles)}
        layout
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h3 
          className={gameTutorialStyles.textBoxTitle}
          style={{ color: `var(--color-${colors.primary})` }}
          layout="position"
          transition={{ duration: 0.4 }}
        >
          {currentTutorialStep.title}
        </motion.h3>
        <motion.p 
          className={gameTutorialStyles.textBoxDescription}
          layout="position"
          transition={{ duration: 0.4 }}
        >
          {currentTutorialStep.description}
        </motion.p>
      </motion.div>

            {/* Progress indicator and continue message */}
      <motion.div 
        className={gameTutorialStyles.progressContainer}
        {...gameTutorialStyles.progressAnimation}
        animate={gameTutorialStyles.progressAnimation.animate()}
      >
        <motion.p 
          className={gameTutorialStyles.progressText}
          style={gameTutorialStyles.progressTextShadow}
        >
          {continueText}
        </motion.p>
        <motion.div 
          className={gameTutorialStyles.progressDots}
        >
          {tutorialSteps.map((_, index) => (
            <motion.div
              key={index}
              className={gameTutorialStyles.progressDot}
              style={gameTutorialStyles.progressDotColor(colors.primary, index === currentStep)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 