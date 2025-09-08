import { useState, useRef } from 'react';

/**
 * Hook for managing card stack state
 * @returns State values and setters
 */
export function useCardStackState() {
  // UI interaction state
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  
  // Animation state
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isCardReturning, setIsCardReturning] = useState(false);
  const [prevVisibleCards, setPrevVisibleCards] = useState<number[]>([]);
  
  // References
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);

  return {
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
  };
}