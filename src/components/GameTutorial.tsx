import React from 'react';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useGameTutorial } from '../hooks/components/gameTutorial';
import { gameTutorialStyles } from '../styles/gameTutorialStyles';

const inter = Inter({ subsets: ['latin'] });

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  textPosition: 'left' | 'right' | 'top' | 'bottom';
}

const tutorialSteps: TutorialStep[] = [
  {
    target: 'header-area',
    title: 'Welcome to Fact 5!',
    description: 'Discover hidden facts and use your deductive skills to solve the daily puzzle. Each day brings a new challenge to test your knowledge!',
    textPosition: 'right',
  },
  {
    target: 'category-title',
    title: 'Daily Category',
    description: "Today's mystery category is shown here. Your goal is to figure out what connects all the facts you'll discover. What could it be?",
    textPosition: 'right',
  },
  {
    target: 'facts-area',
    title: 'Fact Cards',
    description: 'As you reveal facts, they\'ll appear here. Click any revealed card to review its information.',
    textPosition: 'right',
  },
  {
    target: 'bubble-grid',
    title: 'Hidden Facts',
    description: 'These bubbles contain hidden facts that will help you solve the category.',
    textPosition: 'left',
  },
  {
    target: 'bubble-0',
    title: 'Reveal Facts',
    description: 'Double-click any bubble to reveal its fact! Start with this one to begin your journey.',
    textPosition: 'right',
  },
  {
    target: 'game-input',
    title: 'Make Your Guesses',
    description: 'Type your guesses here. Try to figure out what category matches all the facts you discover!',
    textPosition: 'top',
  },
  {
    target: 'game-timer',
    title: 'Time Limit',
    description: 'You have 5 minutes to solve the puzzle. Keep an eye on the timer to track your remaining time!',
    textPosition: 'top',
  },
  {
    target: 'game-progress',
    title: 'Guess Limit',
    description: 'You have 5 guesses to solve the puzzle. The progress bar shows how many guesses you have left.',
    textPosition: 'top',
  },
  {
    target: 'game-controls-right',
    title: 'Helpful Tools',
    description: 'Use the info button (i) to learn more about fact categories, or the skip button to pass on a guess if you\'re stuck.',
    textPosition: 'top',
  }
];

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
    handleClick
  } = useGameTutorial({ isOpen, onClose });

  if (!isOpen) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div 
      className={gameTutorialStyles.container}
      onClick={handleClick}
    >
      {/* Mask-based overlay */}
      <div className={gameTutorialStyles.overlay} style={{ pointerEvents: 'none' }}>
        <div style={gameTutorialStyles.overlayMask(spotlightStyles)} />
      </div>

      {/* White border around the spotlight */}
      <div
        className={gameTutorialStyles.spotlightWrapper}
        style={gameTutorialStyles.spotlight(spotlightStyles)}
      />

      {/* Tutorial text box */}
      <motion.div 
        className={`${inter.className} ${gameTutorialStyles.textBox}`}
        style={{
          borderColor: `var(--color-${colors.primary})`
        }}
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
        animate={gameTutorialStyles.progressAnimation.animate(spotlightStyles, textBoxStyles)}
        layout
      >
        <motion.div 
          className={gameTutorialStyles.progressDots}
          layout
          transition={{ duration: 0.4 }}
        >
          {tutorialSteps.map((_, index) => (
            <motion.div
              key={index}
              layout
              className={gameTutorialStyles.progressDot}
              style={{
                backgroundColor: index === currentStep 
                  ? `var(--color-${colors.primary})`
                  : `var(--color-${colors.primary}30)`
              }}
            />
          ))}
        </motion.div>
        <motion.p 
          className={gameTutorialStyles.progressText}
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          layout
          transition={{ duration: 0.4 }}
        >
          {currentStep === tutorialSteps.length - 1 ? 'Click anywhere to finish' : 'Click anywhere to continue'}
        </motion.p>
      </motion.div>
    </div>
  );
} 