/**
 * Calculate fan angle for a card stack, adjusted for screen size
 * @param cardCount Number of cards in the stack
 * @param breakpoint Current responsive breakpoint
 * @returns Optimal fan angle
 */
export function calculateFanAngle(cardCount: number, breakpoint: string): number {
  const baseAngle = Math.min(3, 10 / Math.max(1, cardCount));
  
  if (breakpoint === 'xs') {
    return baseAngle * 0.7;
  } else if (breakpoint === 'sm') {
    return baseAngle * 0.85;
  }
  
  return baseAngle;
}

/**
 * Calculate spread factor for card positioning, adjusted for screen size
 * @param cardCount Number of cards in the stack
 * @param breakpoint Current responsive breakpoint
 * @returns Spread factor for horizontal positioning
 */
export function calculateSpreadFactor(cardCount: number, breakpoint: string): number {
  const cardSize = (window as any).__CARD_SIZE__ || { width: 120 }; 
  
  let spreadPercentage;
  if (cardCount === 2) {
    spreadPercentage = 0.80; 
  } else if (cardCount === 3) {
    spreadPercentage = 0.75; 
  } else if (cardCount === 4) {
    spreadPercentage = 0.70; 
  } else {
    spreadPercentage = 0.65; 
  }
  
  const spread = Math.round(cardSize.width * spreadPercentage);
  
  return Math.max(20, spread);
}

/**
 * Calculate card position in fan layout, with responsive adjustments
 * @param index Card index in the stack
 * @param cardCount Total number of cards
 * @param isHovered Whether this card is hovered
 * @param hoveredIndex Index of the currently hovered card
 * @param breakpoint Current responsive breakpoint
 * @returns Position, rotation, scale and other styling properties
 */
export function calculateCardPosition(
  index: number, 
  cardCount: number, 
  isHovered: boolean, 
  hoveredIndex: number | null,
  breakpoint: string
) {
  const centerIndex = Math.floor(cardCount / 2);
  const fanAngle = calculateFanAngle(cardCount, breakpoint);
  const spreadFactor = calculateSpreadFactor(cardCount, breakpoint);
  
  const baseRotation = (index - centerIndex) * fanAngle;
  const baseTranslateX = (index - centerIndex) * spreadFactor;
  
  let rotation = baseRotation;
  let translateX = baseTranslateX;
  let translateY = 0;
  let scale = 1;
  let zIndex = cardCount - Math.abs(index - centerIndex); 
  let shadowClass = "shadow-sm";
  
  if (hoveredIndex !== null) {
    const isAdjacent = index === hoveredIndex - 1 || index === hoveredIndex + 1;
    
    if (isHovered) {
      scale = breakpoint === 'xs' ? 1.05 : breakpoint === 'sm' ? 1.06 : breakpoint === 'md' ? 1.08 : breakpoint === 'lg' ? 1.09 : 1.1;
      zIndex = 100; 
      rotation = 0; 
      shadowClass = "shadow-xl"; 
    } else if (isAdjacent) {
      const moveAmount = breakpoint === 'xs' ? 8 : breakpoint === 'sm' ? 10 : breakpoint === 'md' ? 12 : breakpoint === 'lg' ? 14 : 15;
      translateX = index < hoveredIndex ? translateX - moveAmount : translateX + moveAmount;
      zIndex = 50 + index; 
      shadowClass = "shadow-md"; 
    } else {
      const moveAmount = breakpoint === 'xs' ? 5 : breakpoint === 'sm' ? 6 : breakpoint === 'md' ? 8 : breakpoint === 'lg' ? 9 : 10;
      translateX = index < hoveredIndex ? translateX - moveAmount : translateX + moveAmount;
      translateY = breakpoint === 'xs' ? -2 : breakpoint === 'sm' ? -3 : breakpoint === 'md' ? -4 : -5; // Slight lift to create depth
    }
  }
  
  return {
    rotation,
    translateX,
    translateY,
    scale,
    zIndex,
    shadowClass,
  };
}

/**
 * Generate animation variants for card appearance and movement
 * @param isInitialRender Whether this is the first render
 * @param isReturningCard Whether card is returning to the stack
 * @param index Card index
 * @param centerIndex Center index in the stack
 * @returns Animation variants for initial, animate, and exit states
 */
export function getCardAnimationVariants(
  isInitialRender: boolean,
  isReturningCard: boolean,
  index: number,
  centerIndex: number
) {
  const initialState = isInitialRender ? {
    y: 100,
    x: -50 * (index - centerIndex),
    rotate: -10,
    opacity: 0
  } : isReturningCard ? {
    x: 200, 
    y: 0,
    opacity: 0,
    scale: 0.4167, 
    rotate: 0
  } : {
    opacity: 0,
    scale: 0.8
  };
  
  const exitState = {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  };

  const transitionSettings = {
    type: "spring",
    stiffness: 280, 
    damping: 22, 
    delay: isInitialRender ? index * 0.1 : isReturningCard ? 0.4 : 0 
  };
  
  return {
    initialState,
    exitState,
    transitionSettings
  };
}

/**
 * Calculate 3D tilt effect based on mouse position
 * @param e Mouse event
 * @returns Coordinates for the tilt effect
 */
export function calculate3DTiltEffect(e: React.MouseEvent): { x: number, y: number } {
  const stack = e.currentTarget;
  const rect = stack.getBoundingClientRect();

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const x = (e.clientX - rect.left - centerX) / centerX; 
  const y = (e.clientY - rect.top - centerY) / centerY; 
  
  return { x, y };
}

export function getCardPosition(
  cardSize: { width: number; height: number },
  index: number,
  totalCards: number
): React.CSSProperties {
  return {
    transformOrigin: 'center center',
    left: `calc(50% - ${cardSize.width / 2}px)`,
    top: `calc(50% - ${cardSize.height / 2}px)`,
    width: `${cardSize.width}px`,
    height: `${cardSize.height}px`,
    zIndex: totalCards - index
  };
}