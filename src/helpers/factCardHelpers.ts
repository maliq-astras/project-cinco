/**
 * Helper functions for FactCard animations, styling, and data processing
 */

import { CSSProperties } from 'react';

// Import our responsive utilities
import { getResponsiveValue } from './breakpoints';

/**
 * Calculate the initial position for a card being drawn from a source position
 * @param sourcePosition The source position of the card
 * @param width Current viewport width
 * @param height Current viewport height
 * @param breakpoint Current responsive breakpoint
 * @returns Animation properties for the initial position
 */
export function getCardInitialPosition(
  sourcePosition: { x: number, y: number } | null,
  width: number,
  height: number,
  breakpoint: string
) {
  if (!sourcePosition) return { opacity: 0, scale: 0.8 };
  
  // Get the center of the viewport
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate the offset from center
  const offsetX = sourcePosition.x - centerX;
  const offsetY = sourcePosition.y - centerY;
  
  // Calculate the rotation based on the position
  const rotation = offsetX > 0 ? Math.min(5, offsetX / 50) : Math.max(-5, offsetX / 50);
  
  // Calculate the scale ratio between stack card and open card
  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm';
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
 * @param width Current viewport width
 * @param height Current viewport height
 * @param breakpoint Current responsive breakpoint
 * @returns Animation properties for the final position
 */
export function getCardReturnPosition(
  returnPosition: { x: number, y: number } | null,
  width: number,
  height: number,
  breakpoint: string
) {
  if (!returnPosition) return { opacity: 0 };
  
  // Get the center of the viewport
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate the offset from center
  const offsetX = returnPosition.x - centerX;
  const offsetY = returnPosition.y - centerY;
  
  // Calculate the scale ratio between stack card and open card
  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm';
  const scaleRatio = isSmallScreen ? 0.429 : 0.4167;
  
  return {
    x: offsetX,
    y: offsetY,
    scale: scaleRatio,
    opacity: 1,
    rotateY: 0
  };
}

export function calculateCardReturnPositionFromElements(
  cardStackElement: HTMLElement | null,
  rightmostCardElement: HTMLElement | null,
  visibleStackCount: number,
  width: number,
  height: number
): { x: number, y: number } {
  if (cardStackElement) {
    const rect = cardStackElement.getBoundingClientRect();
    
    // Check if there are visible cards in the stack
    if (visibleStackCount > 0 && rightmostCardElement) {
      // Position to the right of the rightmost card
      const cardRect = rightmostCardElement.getBoundingClientRect();
      return {
        x: cardRect.right + 20, // Position to the right of the last card with some spacing
        y: cardRect.top + cardRect.height / 2 // Align with the vertical center of the card
      };
    } else if (visibleStackCount > 0) {
      // Fallback: position to the right side of the stack
      return {
        x: rect.right - 70, // Position at the right edge of the stack minus half card width
        y: rect.top + rect.height / 2 // Position at the vertical center of the stack
      };
    } else {
      // If no cards in the stack, position to the center of the stack
      return {
        x: rect.left + rect.width / 2, // Center of the stack horizontally
        y: rect.top + rect.height / 2 // Center of the stack vertically
      };
    }
  } else {
    // Fallback if we can't find the card stack element
    const centerX = width / 2;
    
    // Position based on whether there are cards in the stack
    if (visibleStackCount > 0) {
      return {
        x: centerX + 150, // Move to the right side
        y: height / 2 - 50 // Adjust to match the card stack's vertical position
      };
    } else {
      return {
        x: centerX, // Center horizontally
        y: height / 2 - 50 // Adjust to match the card stack's vertical position
      };
    }
  }
}

/**
 * Normalize a category value to a string
 * @param category The category value which could be a string or any other type
 * @param defaultCategory Default category to use if none is provided
 * @returns Normalized category string
 */
export function normalizeCategory(category: string | any, defaultCategory: string = 'countries'): string {
  if (!category) {
    return defaultCategory;
  }
  
  return typeof category === 'string' 
    ? category 
    : category.toString();
}

/**
 * Inline styles for the FactCard component
 */
export const factCardInlineStyles = {
  preserve3d: { transformStyle: "preserve-3d" as CSSProperties["transformStyle"] },
  hidden: { backfaceVisibility: "hidden" as CSSProperties["backfaceVisibility"] },
}; 