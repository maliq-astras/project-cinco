import { useCallback } from 'react';
import { isMobileLayout } from '@/constants/breakpoints';

interface UseGameTutorialPositioningProps {
  isOpen: boolean;
  currentStep: number;
  tutorialSteps: Array<{ target: string }>;
  getElement: (id: string) => HTMLElement | null;
  width: number;
  height: number;
  setSpotlightStyles: (styles: { top: string; left: string; width: string; height: string }) => void;
  setTextBoxStyles: (styles: { top: string; left: string; width: string }) => void;
}

export const useGameTutorialPositioning = ({
  isOpen,
  currentStep,
  tutorialSteps,
  getElement,
  width,
  height,
  setSpotlightStyles,
  setTextBoxStyles
}: UseGameTutorialPositioningProps) => {
  
  const updatePositions = useCallback(() => {
    if (isOpen) {
      const currentTarget = tutorialSteps[currentStep].target;
      const element = getElement(currentTarget);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const textPadding = 24;
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

        // Calculate text box position
        const textBoxWidth = isMobile ? Math.min(width - 32, 400) : 300;
        let textTop;
        let textLeft = rect.left + (rect.width - textBoxWidth) / 2;
        
        if (currentTarget === 'bubble-grid' || currentTarget === 'bubble-0') {
          textTop = Math.max(16, rect.top - 200 - textPadding);
        } else if (currentTarget === 'facts-area') {
          textTop = Math.max(rect.bottom + 100, 16);
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
  }, [isOpen, currentStep, tutorialSteps, getElement, width, height, setSpotlightStyles, setTextBoxStyles]);

  return {
    updatePositions
  };
};