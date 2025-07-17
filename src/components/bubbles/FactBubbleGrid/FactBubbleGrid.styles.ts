/**
 * Styles for the FactBubbleGrid component
 */
import { CSSProperties } from 'react';

export const factBubbleGridStyles = {
  // Container styles
  container: "w-full flex justify-center",
  
  // Grid styles
  grid: "grid justify-items-center",
  
  // Empty slot styles
  emptySlot: "aspect-square opacity-0",
  
  // Bubble container styles
  bubbleContainer: "flex items-center justify-center",
  
  // Container spacing
  containerSpacing: {
    marginTop: "0.5rem"
  },
  
  // Bubble size
  bubbleSize: (size: number): CSSProperties => ({
    width: `${size}px`
  })
} as const; 