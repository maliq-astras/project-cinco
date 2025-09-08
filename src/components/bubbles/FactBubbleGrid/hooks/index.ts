import { useFactBubbleGridState } from './useFactBubbleGridState';
import { useFactBubbleGridLogic } from './useFactBubbleGridLogic';
import { useFactBubbleGridEvents } from './useFactBubbleGridEvents';

export const useFactBubbleGrid = () => {
  const state = useFactBubbleGridState();
  
  const logic = useFactBubbleGridLogic({
    totalSlots: state.totalSlots
  });
  
  // Register DOM element for grid
  useFactBubbleGridEvents({
    bubbleGridRef: state.bubbleGridRef
  });

  return {
    // State
    bubbleGridRef: state.bubbleGridRef,
    
    // Logic
    gridItems: logic.gridItems,
    remainingFactsCount: logic.remainingFactsCount,
    animationProps: logic.animationProps,
    bubbleSize: logic.bubbleSize,
    gapSize: logic.gapSize,
    responsiveValues: logic.responsiveValues,
    willFit: logic.willFit,
    availableContentHeight: logic.availableContentHeight,
    layoutMode: logic.layoutMode
  };
};