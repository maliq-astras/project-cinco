import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

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

interface UseGameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useGameTutorial = ({ isOpen, onClose }: UseGameTutorialProps) => {
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

  const updatePositions = () => {
    if (isOpen) {
      const currentTarget = tutorialSteps[currentStep].target;
      const element = document.getElementById(currentTarget);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 16;
        const textPadding = 24;
        const isMobile = window.innerWidth < 640;
        const navigationHeight = 120;
        const viewportHeight = window.innerHeight;
        
        // Update spotlight styles
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
          textLeft = (window.innerWidth - textBoxWidth) / 2;
          const viewportMiddle = viewportHeight / 2;
          
          if (rect.top + rect.height / 2 < viewportMiddle) {
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

        // Ensure text box stays within viewport bounds
        textLeft = Math.max(16, Math.min(textLeft, window.innerWidth - textBoxWidth - 16));
        textTop = Math.max(16, Math.min(textTop, window.innerHeight - 200));

        setTextBoxStyles({
          top: `${textTop}px`,
          left: `${textLeft}px`,
          width: `${textBoxWidth}px`
        });
      }
    }
  };

  // Update positions when step changes or window resizes
  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [currentStep, isOpen]);

  const handleClick = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return {
    currentStep,
    spotlightStyles,
    textBoxStyles,
    colors,
    tutorialSteps,
    handleClick
  };
}; 