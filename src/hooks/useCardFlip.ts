import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCardInitialPosition, getCardReturnPosition, calculateCardReturnPosition } from '../helpers/factCardHelpers';

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDrawn, setIsDrawn] = useState(!sourcePosition);
  const [isClosing, setIsClosing] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [returnPosition, setReturnPosition] = useState<{ x: number, y: number } | null>(null);

  // Memoize animation settings to prevent unnecessary re-renders
  const initialAnimation = useMemo(() => 
    getCardInitialPosition(sourcePosition), 
    [sourcePosition]
  );
  
  const cardAnimation = useMemo(() => {
    return !isClosing ? { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0
    } : getCardReturnPosition(returnPosition);
  }, [isClosing, returnPosition]);
  
  const cardTransition = useMemo(() => ({
    duration: sourcePosition || isClosing ? 0.7 : 0.3,
    ease: "easeInOut" as const
  }), [sourcePosition, isClosing]);

  const flipTransition = useMemo(() => ({
    type: "spring" as const,
    stiffness: 70,
    damping: 15,
    duration: 0.9
  }), []);

  // Handle click outside the card
  const handleClickOutside = useCallback((e: MouseEvent) => {
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
      // Calculate the return position
      setReturnPosition(calculateCardReturnPosition(visibleStackCount));
      
      // After the return animation completes, call closeFactCard from the store
      setTimeout(() => {
        closeFactCard();
        if (onClose) onClose();
      }, 500);
    }, 400);
  }, [closeFactCard, visibleStackCount, onClose, canClose]);

  // Setup animations and event listeners
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    
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
        document.removeEventListener('click', handleClickOutside);
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
        document.removeEventListener('click', handleClickOutside);
        clearTimeout(timer);
      };
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, sourcePosition, isClosing]);

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
    handleAnimationComplete,
    // Include animation properties in the hook return
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition
  };
} 