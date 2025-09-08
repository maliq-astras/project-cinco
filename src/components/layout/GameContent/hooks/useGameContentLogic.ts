import { useEffect } from 'react';
import { ANIMATIONS } from '@/constants/animations';
import { calculateBubbleContextSpacing } from '../helpers';

interface UseGameContentLogicProps {
  isDragging: boolean;
  isTutorialOpen: boolean;
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  registerElement: (key: string, element: HTMLElement) => void;
  unregisterElement: (key: string) => void;
  responsiveValues: {
    bubbleSize: number;
  };
}

export const useGameContentLogic = ({
  isDragging,
  isTutorialOpen,
  dropZoneRef,
  registerElement,
  unregisterElement,
  responsiveValues
}: UseGameContentLogicProps) => {
  // Calculate dynamic spacing for bubble context area based on bubble size
  const bubbleContextSpacing = calculateBubbleContextSpacing(responsiveValues.bubbleSize);
  
  // Animation configurations
  const animations = {
    cardStack: ANIMATIONS.CARD_STACK,
    middleSection: ANIMATIONS.MIDDLE_SECTION,
    bottomSection: ANIMATIONS.BOTTOM_SECTION
  };
  
  // Register the drop zone as the drop target when dragging (but not during tutorial)
  useEffect(() => {
    if (isDragging && !isTutorialOpen && dropZoneRef.current) {
      registerElement('fact-card-stack-container', dropZoneRef.current);
    }
    return () => {
      if (isDragging && !isTutorialOpen) {
        unregisterElement('fact-card-stack-container');
      }
    };
  }, [isDragging, isTutorialOpen, registerElement, unregisterElement]);

  return {
    bubbleContextSpacing,
    animations
  };
};