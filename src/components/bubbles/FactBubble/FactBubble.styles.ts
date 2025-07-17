import { CSSProperties } from 'react';

/**
 * Styles for the FactBubble component
 */
export const factBubbleStyles = {
  container: "relative w-full aspect-square",
  
  bubble: "relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 border-2 shadow-md dark:shadow-lg flex items-center justify-center transition-colors",
  
  // States
  clickable: "cursor-pointer",
  notClickable: "cursor-not-allowed opacity-50",
  
  // Particles
  particle: "absolute top-1/2 left-1/2 w-2 h-2 rounded-full",
  
  // Icon styles
  icon: (isClickable: boolean): CSSProperties => ({
    filter: 'var(--icon-filter)',
    opacity: isClickable ? 0.7 : 0.4,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const
  }),
  
  // Particle styles
  particleContainer: (x: number, y: number): CSSProperties => ({
    position: 'fixed' as const,
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)'
  })
} as const;

/**
 * Get dynamic bubble styles based on state
 */
export function getBubbleClassNames({
  isClickable,
  isTouched = false
}: {
  isClickable: boolean,
  isTouched?: boolean
}) {
  return `${factBubbleStyles.bubble} ${
    isClickable ? factBubbleStyles.clickable : factBubbleStyles.notClickable
  }`.trim();
} 