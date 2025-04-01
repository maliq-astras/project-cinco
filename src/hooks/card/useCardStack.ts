import { useState, useRef, useEffect } from 'react';
import { calculate3DTiltEffect } from '../../helpers/uiHelpers';

/**
 * Custom hook for managing card stack interactions and animations
 * @param visibleCards Array of visible card indices
 * @returns State and handlers for card stack
 */
export function useCardStack(visibleCards: number[]) {
  // UI interaction state
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  
  // Animation state
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isCardReturning, setIsCardReturning] = useState(false);
  const [prevVisibleCards, setPrevVisibleCards] = useState<number[]>([]);
  
  // References
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);

  // Handle new card appearance and card return animations
  useEffect(() => {
    // Check if this is a new card being added or removed
    const isNewCardAdded = visibleCards.length > prevVisibleCards.length;
    
    // Only set initial render to true for the first render or when a new card is added from a bubble
    if (prevVisibleCards.length === 0 || (isNewCardAdded && !prevVisibleCards.some(card => !visibleCards.includes(card)))) {
      setIsInitialRender(true);
      const timer = setTimeout(() => {
        setIsInitialRender(false);
      }, visibleCards.length * 100 + 500); // Wait for all cards to be dealt
      
      return () => clearTimeout(timer);
    }
    
    // Check if a card is returning to the stack (length is the same but order changed)
    if (visibleCards.length === prevVisibleCards.length && 
        JSON.stringify(visibleCards) !== JSON.stringify(prevVisibleCards)) {
      setIsCardReturning(true);
      const timer = setTimeout(() => {
        setIsCardReturning(false);
      }, 800); // Increased duration for the return animation
      
      return () => clearTimeout(timer);
    }
    
    // Update the previous revealed facts
    setPrevVisibleCards(visibleCards);
    
    // Resize the refs array
    cardRefs.current = cardRefs.current.slice(0, visibleCards.length);
  }, [visibleCards]);

  // Mouse interaction handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    setHandPosition(calculate3DTiltEffect(e));
  };

  const handleMouseLeave = () => {
    setHandPosition({ x: 0, y: 0 }); // Reset to neutral position
  };

  return {
    // State
    hoveredCardIndex,
    isInitialRender,
    isCardReturning,
    handPosition,
    
    // Refs
    cardRefs,
    stackRef,
    
    // Event handlers
    setHoveredCardIndex,
    handleMouseMove,
    handleMouseLeave,
  };
} 