import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useCardStackState } from './useCardStackState';
import { useCardStackEffects } from './useCardStackEffects';
import { useCardStackEvents } from './useCardStackEvents';

/**
 * Custom hook for managing card stack interactions and animations
 * @param visibleCards Array of visible card indices
 * @returns State and handlers for card stack
 */
export function useCardStack(visibleCards: number[], onCardClicked?: (factIndex: number, cardIndex: number) => void) {
  // DOM refs provider for accessing registered elements
  const { } = useDOMRefs();
  
  // Component state
  const {
    hoveredCardIndex,
    setHoveredCardIndex,
    handPosition,
    setHandPosition,
    isTouching,
    setIsTouching,
    isInitialRender,
    setIsInitialRender,
    isCardReturning,
    setIsCardReturning,
    prevVisibleCards,
    setPrevVisibleCards,
    cardRefs,
    stackRef
  } = useCardStackState();
  
  // Side effects
  useCardStackEffects({
    visibleCards,
    prevVisibleCards,
    setPrevVisibleCards,
    setIsInitialRender,
    setIsCardReturning,
    cardRefs
  });
  
  // Event handlers
  const {
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCardStackEvents({
    visibleCards,
    hoveredCardIndex,
    isTouching,
    stackRef,
    onCardClicked,
    setHandPosition,
    setHoveredCardIndex,
    setIsTouching
  });

  return {
    // State
    hoveredCardIndex,
    isInitialRender,
    isCardReturning,
    handPosition,
    isTouching,
    
    // Refs
    cardRefs,
    stackRef,
    
    // Event handlers
    setHoveredCardIndex,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
} 