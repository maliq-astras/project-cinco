import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  textPosition: 'left' | 'right' | 'top' | 'bottom';
}

// Create the tutorial steps as a function that takes hardMode as a parameter
const createTutorialSteps = (hardMode: boolean, t: Function): TutorialStep[] => [
  {
    target: 'header-area',
    title: t('tutorial.steps.welcome.title'),
    description: t('tutorial.steps.welcome.description'),
    textPosition: 'right',
  },
  {
    target: 'category-title',
    title: t('tutorial.steps.category.title'),
    description: t('tutorial.steps.category.description'),
    textPosition: 'right',
  },
  {
    target: 'facts-area',
    title: t('tutorial.steps.factCards.title'),
    description: t('tutorial.steps.factCards.description'),
    textPosition: 'right',
  },
  {
    target: 'bubble-grid',
    title: t('tutorial.steps.hiddenFacts.title'),
    description: t('tutorial.steps.hiddenFacts.description'),
    textPosition: 'left',
  },
  {
    target: 'bubble-0',
    title: t('tutorial.steps.revealFacts.title'),
    description: t('tutorial.steps.revealFacts.description'),
    textPosition: 'right',
  },
  {
    target: 'game-input',
    title: t('tutorial.steps.guesses.title'),
    description: t('tutorial.steps.guesses.description'),
    textPosition: 'top',
  },
  {
    target: 'game-timer',
    title: t('tutorial.steps.timeLimit.title'),
    description: hardMode 
      ? t('tutorial.steps.timeLimit.description.hard')
      : t('tutorial.steps.timeLimit.description.normal'),
    textPosition: 'top',
  },
  {
    target: 'game-progress',
    title: t('tutorial.steps.guessLimit.title'),
    description: t('tutorial.steps.guessLimit.description'),
    textPosition: 'top',
  },
  {
    target: 'game-controls-right',
    title: t('tutorial.steps.tools.title'),
    description: t('tutorial.steps.tools.description'),
    textPosition: 'top',
  }
];

interface UseGameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useGameTutorial = ({ isOpen, onClose }: UseGameTutorialProps) => {
  const { t } = useTranslation('common');
  const { colors } = useTheme();
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

  // Get the hardMode status and timer pause functions
  const hardMode = useGameStore(state => state.hardMode);
  const setTutorialOpen = useGameStore(state => state.setTutorialOpen);
  
  // Use the dynamic tutorial steps based on game mode
  const tutorialSteps = createTutorialSteps(hardMode, t);

  // Reset step when tutorial is closed and manage timer pausing
  useEffect(() => {
    // The tutorial is opening or closing
    setTutorialOpen(isOpen);
    
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen, setTutorialOpen]);

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
    handleClick,
    continueText: currentStep === tutorialSteps.length - 1 
      ? t('tutorial.navigation.finish')
      : t('tutorial.navigation.continue')
  };
}; 