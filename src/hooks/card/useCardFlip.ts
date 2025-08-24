import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getCardInitialPosition, getCardReturnPosition, calculateCardReturnPositionFromElements } from '../../helpers/factCardHelpers';
import { useMemoizedFlipTransition, useCardTransition } from '../animation';
import { useDOMRefs } from '../../providers/DOMRefsProvider';
import { useResponsive } from '../responsive';

interface UseCardFlipProps {
  sourcePosition: { x: number, y: number } | null;
  visibleStackCount: number;
  onClose?: () => void;
}

export function useCardFlip({ 
  sourcePosition, 
  visibleStackCount, 
  onClose
}: UseCardFlipProps) {
  const closeFactCard = useGameStore(state => state.closeFactCard);
  const completeCardAnimation = useGameStore(state => state.completeCardAnimation);
  const { getElement } = useDOMRefs();
  
  // Use our new responsive system
  const { 
    breakpoint, 
    heightBreakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues,
    width,
    height
  } = useResponsive();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDrawn, setIsDrawn] = useState(!sourcePosition);
  const [isClosing, setIsClosing] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [returnPosition, setReturnPosition] = useState<{ x: number, y: number } | null>(null);

  // Memoize animation settings to prevent unnecessary re-renders
  const initialAnimation = useMemo(() => {
    // Use fallback values if responsive dimensions aren't ready yet
    const currentWidth = width || window.innerWidth;
    const currentHeight = height || window.innerHeight;
    const currentBreakpoint = breakpoint || 'md';
    
    return getCardInitialPosition(sourcePosition, currentWidth, currentHeight, currentBreakpoint);
  }, [sourcePosition, width, height, breakpoint]);
  
  const cardAnimation = useMemo(() => {
    // Use fallback values if responsive dimensions aren't ready yet
    const currentWidth = width || window.innerWidth;
    const currentHeight = height || window.innerHeight;
    const currentBreakpoint = breakpoint || 'md';
    
    return !isClosing ? { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0
    } : getCardReturnPosition(returnPosition, currentWidth, currentHeight, currentBreakpoint);
  }, [isClosing, returnPosition, width, height, breakpoint]);
  
  // Use custom animation hooks for transitions
  const cardTransition = useCardTransition({
    isDrawingFromSource: !!sourcePosition,
    isReturning: isClosing
  });

  const flipTransition = useMemoizedFlipTransition();

  // Handle click outside the card - now returns a handler for the component to use
  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-overlay') && canClose) {
      handleClose();
    }
  }, [canClose]);

  // Handle closing the card
  const handleClose = useCallback(() => {
    if (!canClose) return;

    // First flip the card back
    setIsFlipped(false);
    setIsClosing(true);
    
    // After the flip animation, start the return animation
    setTimeout(() => {
      // Get card stack elements from DOM refs provider
      const cardStackElement = getElement('card-stack-container');
      const rightmostCardElement = getElement('rightmost-card');
      
      // Calculate the return position using refs
      const currentWidth = width || window.innerWidth;
      const currentHeight = height || window.innerHeight;
      
      const position = calculateCardReturnPositionFromElements(
        cardStackElement,
        rightmostCardElement,
        visibleStackCount,
        currentWidth,
        currentHeight
      );
      setReturnPosition(position);
      
      // After the return animation completes, call closeFactCard from the store
      setTimeout(() => {
        closeFactCard();
        if (onClose) onClose();
      }, 500);
    }, 400);
  }, [closeFactCard, visibleStackCount, onClose, canClose, getElement, width, height]);

  // Setup animations
  useEffect(() => {
    // If we're drawing from the stack, first animate the drawing
    if (sourcePosition && !isClosing) {
      // Start the flip animation after the drawing animation completes
      const timer = setTimeout(() => {
        setIsDrawn(true);
        
        // Then start the flip animation after a short delay
        const flipTimer = setTimeout(() => {
          setIsFlipped(true);
          
          // Allow closing after 2 seconds
          const closeTimer = setTimeout(() => {
            setCanClose(true);
          }, 2000);
          
          return () => clearTimeout(closeTimer);
        }, 300);
        
        return () => clearTimeout(flipTimer);
      }, 500);
      
      return () => {
        clearTimeout(timer);
      };
    } else if (!isClosing) {
      // If not drawing from stack, just do the flip animation
      const timer = setTimeout(() => {
        setIsFlipped(true);
        
        // Allow closing after 2 seconds
        const closeTimer = setTimeout(() => {
          setCanClose(true);
        }, 2000);
        
        return () => clearTimeout(closeTimer);
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [sourcePosition, isClosing]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canClose) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, canClose]);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    if (isClosing) {
      completeCardAnimation();
    }
  }, [isClosing, completeCardAnimation]);

  return {
    isFlipped,
    isDrawn,
    isClosing,
    canClose,
    returnPosition,
    handleClose,
    handleClickOutside, // Now returns the handler for component use
    handleAnimationComplete,
    // Include animation properties in the hook return
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition
  };
} 