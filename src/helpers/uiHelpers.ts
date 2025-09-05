export function getFactBubblePositionFromElement(factBubble: HTMLElement | null): { x: number, y: number } | null {
  if (factBubble) {
    const rect = factBubble.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
  return null;
}

export function showToastMessageFromElement(toastElement: HTMLElement | null, duration: number = 2000): void {
  if (toastElement) {
    toastElement.classList.remove('hidden');
    setTimeout(() => {
      toastElement.classList.add('animate-fadeOut');
      setTimeout(() => {
        toastElement.classList.remove('animate-fadeIn', 'animate-fadeOut');
        toastElement.classList.add('hidden');
      }, 300);
    }, duration);
  }
}

export function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// Card stack UI helpers

/**
 * Calculate fan angle for a card stack, adjusted for screen size
 * @param cardCount Number of cards in the stack
 * @param breakpoint Current responsive breakpoint
 * @returns Optimal fan angle
 */
export function calculateFanAngle(cardCount: number, breakpoint: string): number {
  // Base angle calculation - reduced from 4 to 3 degrees max
  let baseAngle = Math.min(3, 10 / Math.max(1, cardCount));
  
  // Adjust for screen size based on breakpoint
  if (breakpoint === 'xs') {
    // Smaller angles on mobile
    return baseAngle * 0.7;
  } else if (breakpoint === 'sm') {
    // Slightly reduced angles on tablets
    return baseAngle * 0.85;
  }
  
  // Full angle on desktop
  return baseAngle;
}

/**
 * Calculate spread factor for card positioning, adjusted for screen size
 * @param cardCount Number of cards in the stack
 * @param breakpoint Current responsive breakpoint
 * @returns Spread factor for horizontal positioning
 */
export function calculateSpreadFactor(cardCount: number, breakpoint: string): number {
  // Get the current card size from the responsive system
  // This ensures spreads are proportional to actual card dimensions
  const cardSize = (window as any).__CARD_SIZE__ || { width: 120 }; // Fallback if not set
  
  // Calculate spread as a percentage of card width
  let spreadPercentage;
  if (cardCount === 2) {
    spreadPercentage = 0.80; // 80% of card width - widest spread
  } else if (cardCount === 3) {
    spreadPercentage = 0.75; // 75% of card width - medium spread
  } else if (cardCount === 4) {
    spreadPercentage = 0.70; // 70% of card width - narrower spread
  } else {
    spreadPercentage = 0.65; // 65% of card width - narrowest spread
  }
  
  // Calculate actual spread in pixels
  const spread = Math.round(cardSize.width * spreadPercentage);
  
  // Ensure minimum spread for very small cards
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
  
  // Base rotation and position
  const baseRotation = (index - centerIndex) * fanAngle;
  const baseTranslateX = (index - centerIndex) * spreadFactor;
  
  // Default values
  let rotation = baseRotation;
  let translateX = baseTranslateX;
  let translateY = 0;
  let scale = 1;
  let zIndex = cardCount - Math.abs(index - centerIndex); // Center cards on top
  let shadowClass = "shadow-sm";
  
  // Adjust based on hover state
  if (hoveredIndex !== null) {
    const isAdjacent = index === hoveredIndex - 1 || index === hoveredIndex + 1;
    
    if (isHovered) {
      // Lift the hovered card up and forward
      // translateY is now handled in the component based on screen size
      scale = breakpoint === 'xs' ? 1.05 : breakpoint === 'sm' ? 1.06 : breakpoint === 'md' ? 1.08 : breakpoint === 'lg' ? 1.09 : 1.1;
      zIndex = 100; // Ensure it's on top
      rotation = 0; // Straighten the card
      shadowClass = "shadow-xl"; // Stronger shadow for lifted card
    } else if (isAdjacent) {
      // Adjacent cards move slightly away - scale movement based on breakpoint
      const moveAmount = breakpoint === 'xs' ? 8 : breakpoint === 'sm' ? 10 : breakpoint === 'md' ? 12 : breakpoint === 'lg' ? 14 : 15;
      translateX = index < hoveredIndex ? translateX - moveAmount : translateX + moveAmount;
      zIndex = 50 + index; // Higher than non-adjacent but lower than hovered
      shadowClass = "shadow-md"; // Medium shadow for adjacent cards
    } else {
      // Non-adjacent cards move slightly away - scale movement based on breakpoint
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
  // Initial animation state
  const initialState = isInitialRender ? {
    y: 100,
    x: -50 * (index - centerIndex),
    rotate: -10,
    opacity: 0
  } : isReturningCard ? {
    x: 200, // Start from further to the right
    y: 0,
    opacity: 0,
    scale: 0.4167, // Exact ratio between stack card and open card
    rotate: 0
  } : {
    opacity: 0,
    scale: 0.8
  };
  
  // Exit animation state
  const exitState = {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  };
  
  // Animation transition settings
  const transitionSettings = {
    type: "spring",
    stiffness: 280, // Slightly reduced stiffness for smoother animation
    damping: 22, // Slightly increased damping for smoother animation
    delay: isInitialRender ? index * 0.1 : isReturningCard ? 0.4 : 0 // Increased delay for returning cards
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
  
  // Calculate mouse position relative to the center of the stack
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const x = (e.clientX - rect.left - centerX) / centerX; // -1 to 1
  const y = (e.clientY - rect.top - centerY) / centerY; // -1 to 1
  
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