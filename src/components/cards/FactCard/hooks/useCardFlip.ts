import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getCardInitialPosition, getCardReturnPosition, calculateCardReturnPositionFromElements } from '../helpers';
import { useMemoizedFlipTransition } from './useMemoizedFlipTransition';
import { useCardTransition } from './useCardTransition';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

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
  
  const { 
    breakpoint, 
    width,
    height
  } = useResponsive();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDrawn, setIsDrawn] = useState(!sourcePosition);
  const [isClosing, setIsClosing] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [returnPosition, setReturnPosition] = useState<{ x: number, y: number } | null>(null);

  const initialAnimation = useMemo(() => {
   
    const currentWidth = width || window.innerWidth;
    const currentHeight = height || window.innerHeight;
    const currentBreakpoint = breakpoint || 'md';
    
    return getCardInitialPosition(sourcePosition, currentWidth, currentHeight, currentBreakpoint);
  }, [sourcePosition, width, height, breakpoint]);
  
  const cardAnimation = useMemo(() => {
   
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
  
 
  const cardTransition = useCardTransition({
    isDrawingFromSource: !!sourcePosition,
    isReturning: isClosing
  });

  const flipTransition = useMemoizedFlipTransition();

  
  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-overlay') && canClose) {
      handleClose();
    }
  }, [canClose]);

  
  const handleClose = useCallback(() => {
    if (!canClose) return;

    
    setIsFlipped(false);
    setIsClosing(true);
    

    setTimeout(() => {
      
      const cardStackElement = getElement('card-stack-container');
      const rightmostCardElement = getElement('rightmost-card');
      
      
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
      
      
      setTimeout(() => {
        closeFactCard();
        if (onClose) onClose();
      }, 500);
    }, 400);
  }, [closeFactCard, visibleStackCount, onClose, canClose, getElement, width, height]);

  
  useEffect(() => {
    if (sourcePosition && !isClosing) {
     
      const timer = setTimeout(() => {
        setIsDrawn(true);
        
       
        const flipTimer = setTimeout(() => {
          setIsFlipped(true);
          
         
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
     
      const timer = setTimeout(() => {
        setIsFlipped(true);
        
       
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
    handleClickOutside, 
    handleAnimationComplete,
    initialAnimation,
    cardAnimation,
    cardTransition,
    flipTransition
  };
} 