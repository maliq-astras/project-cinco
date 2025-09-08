import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  textPosition: 'left' | 'right' | 'top' | 'bottom';
}

const createTutorialSteps = (hardMode: boolean, t: any): TutorialStep[] => [
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
    description: t('tutorial.steps.revealFacts.description', 'Drag any bubble to the card area to reveal its fact! Start with this one to begin your journey.'),
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

  const hardMode = useGameStore(state => state.hardMode);
  const setTutorialOpen = useGameStore(state => state.setTutorialOpen);
  const tutorialSteps = createTutorialSteps(hardMode, t);
  const { registerElement, unregisterElement, getElement } = useDOMRefs();
  const { 
    width, 
    height, 
  } = useResponsive();
  useEffect(() => {
    setTutorialOpen(isOpen);
    
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen, setTutorialOpen]);

  const updatePositions = useCallback(() => {
    if (isOpen) {
      const currentTarget = tutorialSteps[currentStep].target;
      const element = getElement(currentTarget);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const textPadding = 24;
        const { isMobileLayout } = require('@/constants/breakpoints');
        const isMobile = isMobileLayout(width, height);
        const navigationHeight = 120;
        const viewportHeight = height;
        
        if (currentTarget === 'header-area') {
          const logoWidth = rect.width; 
          const logoHeight = Math.min(150, rect.height * 0.6); 
          
          const centerY = rect.top + rect.height / 2;
          
          setSpotlightStyles({
            top: `${centerY - logoHeight / 2}px`,
            left: `${rect.left}px`, 
            width: `${logoWidth}px`,
            height: `${logoHeight}px`
          });
        } else {
          if (currentTarget === 'category-title') {
            setSpotlightStyles({
              top: `${rect.top - 12}px`,
              left: `${rect.left - 1}px`,
              width: `${rect.width + 2}px`,
              height: `${rect.height + 24}px`
            });
          } else if (currentTarget === 'facts-area') {
            if (isMobile) {
              setSpotlightStyles({
                top: `${rect.top}px`,
                left: '2.5px',
                width: `${width - 5}px`,
                height: `${rect.height}px`
              });
            } else {
              setSpotlightStyles({
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
              });
            }
          } else if (currentTarget === 'bubble-0') {
            const padding = 10; 
            setSpotlightStyles({
              top: `${rect.top - padding}px`,
              left: `${rect.left - padding}px`,
              width: `${rect.width + (padding * 2)}px`,
              height: `${rect.height + (padding * 2)}px`
            });
          } else if (currentTarget === 'game-input') {
            setSpotlightStyles({
              top: `${rect.top - 2.5}px`,
              left: `${rect.left - 1.3}px`,
              width: `${rect.width + 3}px`,
              height: `${rect.height + 5}px`
            });
          } else if (currentTarget === 'bubble-grid') {
            setSpotlightStyles({
              top: `${rect.top - 10}px`,
              left: `${rect.left - 7}px`,
              width: `${rect.width + 12}px`,
              height: `${rect.height + 22}px`
            });
          } else if (currentTarget === 'game-timer') {
            setSpotlightStyles({
              top: `${rect.top - 5}px`,
              left: `${rect.left - 4}px`,
              width: `${rect.width + 8}px`,
              height: `${rect.height + 10}px`
            });
          } else if (currentTarget === 'game-progress') {
            setSpotlightStyles({
              top: `${rect.top - 4.6}px`,
              left: `${rect.left - .8}px`,
              width: `${rect.width + 2}px`,
              height: `${rect.height + 10}px`
            });
          } else if (currentTarget === 'game-controls-right') {
            setSpotlightStyles({
              top: `${rect.top - 4.6}px`,
              left: `${rect.left - .8}px`,
              width: `${rect.width + 1}px`,
              height: `${rect.height + 10}px`
            });
          } else {
            setSpotlightStyles({
              top: `${rect.top - 16}px`,
              left: `${rect.left - 16}px`,
              width: `${rect.width + 32}px`,
              height: `${rect.height + 32}px`
            });
          }
        }

        // Calculate text box position - below for most elements, above for bubble grid
        const textBoxWidth = isMobile ? Math.min(width - 32, 400) : 300;
        let textTop;
        let textLeft = rect.left + (rect.width - textBoxWidth) / 2;
        
        if (currentTarget === 'bubble-grid' || currentTarget === 'bubble-0') {
          textTop = Math.max(16, rect.top - 200 - textPadding);
        } else if (currentTarget === 'facts-area') {
          textTop = Math.max(
            rect.bottom + 100, 
            16 
          );
        } else {
          textTop = Math.min(
            rect.bottom + textPadding * 2,
            viewportHeight - 200 - navigationHeight
          );
        }

        textLeft = Math.max(16, Math.min(textLeft, width - textBoxWidth - 16));
        
        if (currentTarget === 'facts-area') {
          textTop = Math.max(16, Math.min(textTop, height - 190)); 
        } else {
          textTop = Math.max(16, Math.min(textTop, height - 200));
        }

        setTextBoxStyles({
          top: `${textTop}px`,
          left: `${textLeft}px`,
          width: `${textBoxWidth}px`
        });
      }
    }
  }, [isOpen, currentStep, tutorialSteps, getElement, width, height]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePositions();
    }, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, isOpen, updatePositions]);

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