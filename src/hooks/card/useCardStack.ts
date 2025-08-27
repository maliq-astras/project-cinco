import { useState, useRef, useEffect } from 'react';
import { calculate3DTiltEffect } from '../../helpers/uiHelpers';
import { useDOMRefs } from '../../providers/DOMRefsProvider';

/**
 * Custom hook for managing card stack interactions and animations
 * @param visibleCards Array of visible card indices
 * @returns State and handlers for card stack
 */
export function useCardStack(visibleCards: number[], onCardClicked?: (factIndex: number, cardIndex: number) => void) {
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
  
  // DOM refs provider for accessing registered elements
  const { getElement } = useDOMRefs();

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
    if (!isTouching) {
      setHoveredCardIndex(null); // Clear hover state if not touching
    }
  };

  // Touch interaction handlers for mobile hover effect
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching) return;
    
    const touch = e.touches[0];
    if (!touch) return;

    // Use document.elementFromPoint to find the element under touch
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Find which card index this element belongs to
    let foundCardIndex: number | null = null;
    
    if (elementUnderTouch) {
      // Check if it's a card element or contained within one
      const cardElement = elementUnderTouch.closest('[data-card-index]');
      if (cardElement) {
        const cardIndexStr = cardElement.getAttribute('data-card-index');
        if (cardIndexStr) {
          foundCardIndex = parseInt(cardIndexStr, 10);
        }
      }
    }

    // Update hover state based on found card
    setHoveredCardIndex(foundCardIndex);

    // Update hand position for 3D effect
    if (stackRef.current) {
      const rect = stackRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = (touch.clientX - rect.left - centerX) / centerX;
      const y = (touch.clientY - rect.top - centerY) / centerY;
      setHandPosition({ x, y });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const wasHoveringCard = hoveredCardIndex !== null;
    const hoveredCard = hoveredCardIndex;
    
    // Reset touch state first
    setIsTouching(false);
    setHoveredCardIndex(null);
    setHandPosition({ x: 0, y: 0 });
    
    // If user was hovering a card when they released, open it
    if (wasHoveringCard && hoveredCard !== null && onCardClicked) {
      const factIndex = visibleCards[hoveredCard];
      onCardClicked(factIndex, hoveredCard);
    }
  };

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