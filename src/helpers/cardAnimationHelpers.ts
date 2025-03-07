/**
 * Helper functions for card animations and positioning
 */

/**
 * Calculate the initial position for a card being drawn from a source position
 * @param sourcePosition The source position of the card
 * @returns Animation properties for the initial position
 */
export function getCardInitialPosition(sourcePosition: { x: number, y: number } | null) {
  if (!sourcePosition) return { opacity: 0, scale: 0.8 };
  
  // Get the center of the viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  
  // Calculate the offset from center
  const offsetX = sourcePosition.x - centerX;
  const offsetY = sourcePosition.y - centerY;
  
  // Calculate the rotation based on the position
  const rotation = offsetX > 0 ? Math.min(5, offsetX / 50) : Math.max(-5, offsetX / 50);
  
  // Calculate the scale ratio between stack card and open card
  const isSmallScreen = window.innerWidth < 640; // sm breakpoint in Tailwind
  const scaleRatio = isSmallScreen ? 0.429 : 0.4167;
  
  return {
    x: offsetX,
    y: offsetY,
    rotate: rotation,
    scale: scaleRatio,
    opacity: 1
  };
}

/**
 * Calculate the final position for a card returning to the stack
 * @param returnPosition The position to return the card to
 * @returns Animation properties for the final position
 */
export function getCardReturnPosition(returnPosition: { x: number, y: number } | null) {
  if (!returnPosition) return { opacity: 0 };
  
  // Get the center of the viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  
  // Calculate the offset from center
  const offsetX = returnPosition.x - centerX;
  const offsetY = returnPosition.y - centerY;
  
  // Calculate the scale ratio between stack card and open card
  const isSmallScreen = window.innerWidth < 640;
  const scaleRatio = isSmallScreen ? 0.429 : 0.4167;
  
  return {
    x: offsetX,
    y: offsetY,
    scale: scaleRatio,
    opacity: 1,
    rotateY: 0
  };
}

/**
 * Calculate the return position for a card going back to the stack
 * @param visibleStackCount Number of cards visible in the stack
 * @returns The position to return the card to
 */
export function calculateCardReturnPosition(visibleStackCount: number): { x: number, y: number } {
  // Find the card stack element to get its position
  const cardStackElement = document.querySelector('.card-stack-container');
  
  if (cardStackElement) {
    const rect = cardStackElement.getBoundingClientRect();
    
    // Check if there are visible cards in the stack
    if (visibleStackCount > 0) {
      // Find the rightmost card in the stack
      const rightmostCard = document.querySelector('.card-stack-container .card-in-stack:last-child');
      
      if (rightmostCard) {
        // Position to the right of the rightmost card
        const cardRect = rightmostCard.getBoundingClientRect();
        return {
          x: cardRect.right + 20, // Position to the right of the last card with some spacing
          y: cardRect.top + cardRect.height / 2 // Align with the vertical center of the card
        };
      } else {
        // Fallback: position to the right side of the stack
        return {
          x: rect.right - 70, // Position at the right edge of the stack minus half card width
          y: rect.top + rect.height / 2 // Position at the vertical center of the stack
        };
      }
    } else {
      // If no cards in the stack, position to the center of the stack
      return {
        x: rect.left + rect.width / 2, // Center of the stack horizontally
        y: rect.top + rect.height / 2 // Center of the stack vertically
      };
    }
  } else {
    // Fallback if we can't find the card stack element
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    
    // Position based on whether there are cards in the stack
    if (visibleStackCount > 0) {
      return {
        x: centerX + 150, // Move to the right side
        y: viewportHeight / 2 - 50 // Adjust to match the card stack's vertical position
      };
    } else {
      return {
        x: centerX, // Center horizontally
        y: viewportHeight / 2 - 50 // Adjust to match the card stack's vertical position
      };
    }
  }
} 