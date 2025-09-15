import { CSSProperties } from 'react';

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
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  const offsetX = sourcePosition.x - centerX;
  const offsetY = sourcePosition.y - centerY;
  
  const rotation = offsetX > 0 ? Math.min(5, offsetX / 50) : Math.max(-5, offsetX / 50);
  
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
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  const offsetX = returnPosition.x - centerX;
  const offsetY = returnPosition.y - centerY;
  
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
    
    if (visibleStackCount > 0 && rightmostCardElement) {
      const cardRect = rightmostCardElement.getBoundingClientRect();
      return {
        x: cardRect.right + 20, 
        y: cardRect.top + cardRect.height / 2 
      };
    } else if (visibleStackCount > 0) {
      return {
        x: rect.right - 70, 
        y: rect.top + rect.height / 2 
      };
    } else {
      return {
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      };
    }
  } else {
    const centerX = width / 2;
    
    if (visibleStackCount > 0) {
      return {
        x: centerX + 150, 
        y: height / 2 - 50 
      };
    } else {
      return {
        x: centerX, 
        y: height / 2 - 50 
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
export function normalizeCategory(category: string | number | null | undefined, defaultCategory: string = 'countries'): string {
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