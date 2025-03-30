import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useTheme } from '../context/ThemeContext';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightStyles, setSpotlightStyles] = useState({
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px'
  });
  const [textBoxStyles, setTextBoxStyles] = useState({
    top: '0px',
    left: '0px',
    width: '0px'
  });
  const { colors } = useTheme();

  // Reset to first step when tutorial is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen) {
      const currentTarget = tutorialSteps[currentStep].target;
      const element = document.getElementById(currentTarget);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 16;
        const textPadding = 24;
        const isMobile = window.innerWidth < 640;
        const navigationHeight = 120; // Height of navigation area
        const viewportHeight = window.innerHeight;
        
        // Spotlight styles
        setSpotlightStyles({
          top: `${rect.top - padding}px`,
          left: `${rect.left - padding}px`,
          width: `${rect.width + padding * 2}px`,
          height: `${rect.height + padding * 2}px`
        });

        // Calculate text box position
        const textBoxWidth = isMobile ? Math.min(window.innerWidth - 32, 400) : 300;
        let textTop = rect.top;
        let textLeft = rect.left;

        if (isMobile) {
          // Center the text box horizontally
          textLeft = (window.innerWidth - textBoxWidth) / 2;
          
          // Position text box based on element's position in viewport
          const viewportMiddle = viewportHeight / 2;
          
          if (rect.top + rect.height / 2 < viewportMiddle) {
            // If element is in upper half, place text below with space for navigation
            textTop = Math.min(
              rect.bottom + textPadding * 2,
              viewportHeight - 200 - navigationHeight
            );
          } else {
            // If element is in lower half, place text above
            textTop = Math.max(80, rect.top - 160 - textPadding);
          }
        } else {
          // Desktop positioning logic
          switch (tutorialSteps[currentStep].textPosition) {
            case 'right':
              textLeft = rect.right + textPadding * 2;
              textTop = rect.top + (rect.height - 120) / 2;
              break;
            case 'left':
              textLeft = rect.left - textBoxWidth - textPadding * 2;
              textTop = rect.top + (rect.height - 120) / 2;
              break;
            case 'top':
              textTop = Math.max(16, rect.top - 160 - textPadding);
              textLeft = rect.left + (rect.width - textBoxWidth) / 2;
              break;
            case 'bottom':
              textTop = Math.min(
                rect.bottom + textPadding * 2,
                viewportHeight - 200 - navigationHeight
              );
              textLeft = rect.left + (rect.width - textBoxWidth) / 2;
              break;
          }
        }

        // Ensure text box stays within viewport bounds and doesn't overlap navigation
        textLeft = Math.max(16, Math.min(textLeft, window.innerWidth - textBoxWidth - 16));
        textTop = Math.max(16, Math.min(textTop, window.innerHeight - 200));

        setTextBoxStyles({
          top: `${textTop}px`,
          left: `${textLeft}px`,
          width: `${textBoxWidth}px`
        });
      }
    }
  }, [currentStep, isOpen]);

  // Update the resize handler with similar logic
  useEffect(() => {
    const handleResize = () => {
      const currentTarget = tutorialSteps[currentStep].target;
      const element = document.getElementById(currentTarget);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 16;
        const textPadding = 24;
        const isMobile = window.innerWidth < 640;
        const navigationHeight = 120; // Height of navigation area
        const viewportHeight = window.innerHeight;
        
        setSpotlightStyles({
          top: `${rect.top - padding}px`,
          left: `${rect.left - padding}px`,
          width: `${rect.width + padding * 2}px`,
          height: `${rect.height + padding * 2}px`
        });

        const textBoxWidth = isMobile ? Math.min(window.innerWidth - 32, 400) : 300;
        let textTop = rect.top;
        let textLeft = rect.left;

        if (isMobile) {
          textLeft = (window.innerWidth - textBoxWidth) / 2;
          
          const elementMiddle = rect.top + rect.height / 2;
          const viewportMiddle = viewportHeight / 2;
          
          if (elementMiddle < viewportMiddle) {
            textTop = Math.min(
              rect.bottom + textPadding * 2,
              viewportHeight - 200 - navigationHeight
            );
          } else {
            textTop = Math.max(80, rect.top - 160 - textPadding);
          }
        } else {
          switch (tutorialSteps[currentStep].textPosition) {
            case 'right':
              textLeft = rect.right + textPadding * 2;
              textTop = rect.top + (rect.height - 120) / 2;
              break;
            case 'left':
              textLeft = rect.left - textBoxWidth - textPadding * 2;
              textTop = rect.top + (rect.height - 120) / 2;
              break;
            case 'top':
              textTop = Math.max(16, rect.top - 160 - textPadding);
              textLeft = rect.left + (rect.width - textBoxWidth) / 2;
              break;
            case 'bottom':
              textTop = Math.min(
                rect.bottom + textPadding * 2,
                viewportHeight - 200 - navigationHeight
              );
              textLeft = rect.left + (rect.width - textBoxWidth) / 2;
              break;
          }
        }

        textLeft = Math.max(16, Math.min(textLeft, window.innerWidth - textBoxWidth - 16));
        textTop = Math.max(16, Math.min(textTop, window.innerHeight - 200));

        setTextBoxStyles({
          top: `${textTop}px`,
          left: `${textLeft}px`,
          width: `${textBoxWidth}px`
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep]);

  if (!isOpen) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-50 cursor-pointer"
      onClick={() => {
        if (currentStep < tutorialSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          onClose();
        }
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Spotlight effect */}
      <div
        className="absolute transition-all duration-300 ease-in-out"
        style={{
          ...spotlightStyles,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
          borderRadius: '8px',
          pointerEvents: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'brightness(1.25) contrast(1.1)',
          WebkitBackdropFilter: 'brightness(1.25) contrast(1.1)'
        }}
      />

      {/* Tutorial text box */}
      <motion.div 
        className={`${inter.className} fixed bg-white rounded-lg shadow-xl p-6 sm:p-4 border-2`}
        style={{
          borderColor: `var(--color-${colors.primary})`,
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
          className="text-xl sm:text-lg font-semibold mb-3 sm:mb-2" 
          style={{ color: `var(--color-${colors.primary})` }}
          layout="position"
          transition={{ duration: 0.4 }}
        >
          {currentTutorialStep.title}
        </motion.h3>
        <motion.p 
          className="text-gray-600 text-base sm:text-sm leading-relaxed"
          layout="position"
          transition={{ duration: 0.4 }}
        >
          {currentTutorialStep.description}
        </motion.p>
      </motion.div>

      {/* Progress indicator and continue message */}
      <motion.div 
        className="fixed left-0 right-0 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: Math.max(
            16,
            Math.min(
              window.innerHeight - 100,
              Math.min(
                parseFloat(spotlightStyles.top) - 60,
                parseFloat(textBoxStyles.top) - 60
              )
            )
          )
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
      >
        <motion.div 
          className="flex space-x-2 mb-3"
          layout
          transition={{ duration: 0.4 }}
        >
          {tutorialSteps.map((_, index) => (
            <motion.div
              key={index}
              layout
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: index === currentStep 
                  ? `var(--color-${colors.primary})`
                  : `var(--color-${colors.primary}30)`
              }}
            />
          ))}
        </motion.div>
        <motion.p 
          className="text-white text-sm font-medium opacity-75"
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