export function getFactBubblePosition(factIndex: number): { x: number, y: number } | null {
  const factBubble = document.querySelector(`[data-fact-index="${factIndex}"]`);
  if (factBubble) {
    const rect = factBubble.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
  return null;
}

export function showToastMessage(elementId: string, duration: number = 2000): void {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
      errorDiv.classList.add('animate-fadeOut');
      setTimeout(() => {
        errorDiv.classList.remove('animate-fadeIn', 'animate-fadeOut');
        errorDiv.classList.add('hidden');
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
 * @returns Optimal fan angle
 */
export function calculateFanAngle(cardCount: number): number {
  // Get the current window width
  const windowWidth = window.innerWidth;
  
  // Base angle calculation
  let baseAngle = Math.min(4, 12 / Math.max(1, cardCount));
  
  // Adjust for screen size
  if (windowWidth < 480) {
    // Smaller angles on mobile
    return baseAngle * 0.7;
  } else if (windowWidth < 768) {
    // Slightly reduced angles on tablets
    return baseAngle * 0.85;
  }
  
  // Full angle on desktop
  return baseAngle;
}

/**
 * Calculate spread factor for card positioning, adjusted for screen size
 * @param cardCount Number of cards in the stack
 * @returns Spread factor for horizontal positioning
 */
export function calculateSpreadFactor(cardCount: number): number {
  // Get the current window width
  const windowWidth = window.innerWidth;
  
  // Adjust spread based on screen size
  if (windowWidth < 360) {
    // Very small mobile
    return Math.max(20, 15 + (cardCount * 7)); 
  } else if (windowWidth < 480) {
    // Small mobile
    return Math.max(25, 20 + (cardCount * 8));
  } else if (windowWidth < 640) {
    // Mobile
    return Math.max(30, 25 + (cardCount * 10));
  } else if (windowWidth < 768) {
    // Small tablets
    return Math.max(35, 28 + (cardCount * 12));
  }
  
  // Default for larger screens
  return Math.max(40, 30 + (cardCount * 15));
}

/**
 * Calculate card position in fan layout, with responsive adjustments
 * @param index Card index in the stack
 * @param cardCount Total number of cards
 * @param isHovered Whether this card is hovered
 * @param hoveredIndex Index of the currently hovered card
 * @returns Position, rotation, scale and other styling properties
 */
export function calculateCardPosition(
  index: number, 
  cardCount: number, 
  isHovered: boolean, 
  hoveredIndex: number | null
) {
  const centerIndex = Math.floor(cardCount / 2);
  const fanAngle = calculateFanAngle(cardCount);
  const spreadFactor = calculateSpreadFactor(cardCount);
  const windowWidth = window.innerWidth;
  
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
      scale = windowWidth < 480 ? 1.05 : windowWidth < 768 ? 1.08 : 1.1;
      zIndex = 100; // Ensure it's on top
      rotation = 0; // Straighten the card
      shadowClass = "shadow-xl"; // Stronger shadow for lifted card
    } else if (isAdjacent) {
      // Adjacent cards move slightly away - scale movement based on screen size
      const moveAmount = windowWidth < 480 ? 8 : windowWidth < 768 ? 12 : 15;
      translateX = index < hoveredIndex ? translateX - moveAmount : translateX + moveAmount;
      zIndex = 50 + index; // Higher than non-adjacent but lower than hovered
      shadowClass = "shadow-md"; // Medium shadow for adjacent cards
    } else {
      // Non-adjacent cards move slightly away - scale movement based on screen size
      const moveAmount = windowWidth < 480 ? 5 : windowWidth < 768 ? 8 : 10;
      translateX = index < hoveredIndex ? translateX - moveAmount : translateX + moveAmount;
      translateY = windowWidth < 480 ? -2 : -5; // Slight lift to create depth
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