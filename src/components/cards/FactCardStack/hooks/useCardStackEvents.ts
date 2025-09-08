import { calculate3DTiltEffect } from '../helpers';

interface UseCardStackEventsProps {
  visibleCards: number[];
  hoveredCardIndex: number | null;
  isTouching: boolean;
  stackRef: React.RefObject<HTMLDivElement | null>;
  onCardClicked?: (factIndex: number, cardIndex: number) => void;
  setHandPosition: (position: { x: number, y: number }) => void;
  setHoveredCardIndex: (index: number | null) => void;
  setIsTouching: (touching: boolean) => void;
}

/**
 * Hook for handling card stack mouse and touch events
 * @param props Dependencies and state setters
 * @returns Event handlers
 */
export function useCardStackEvents({
  visibleCards,
  hoveredCardIndex,
  isTouching,
  stackRef,
  onCardClicked,
  setHandPosition,
  setHoveredCardIndex,
  setIsTouching
}: UseCardStackEventsProps) {

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
  const handleTouchStart = () => {
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

  const handleTouchEnd = () => {
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
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}