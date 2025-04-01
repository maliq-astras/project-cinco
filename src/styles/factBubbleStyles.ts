/**
 * Styles for the FactBubble component
 */
export const factBubbleStyles = {
  container: "relative w-full aspect-square",
  
  bubble: "relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 border-2 shadow-md dark:shadow-lg flex items-center justify-center transition-colors",
  
  // States
  clickable: "cursor-pointer",
  notClickable: "cursor-not-allowed opacity-50",
  touched: "scale-95",
  
  // Particles
  particle: "absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
};

/**
 * Get dynamic bubble styles based on state
 */
export function getBubbleClassNames({
  isClickable,
  isTouched
}: {
  isClickable: boolean,
  isTouched: boolean
}) {
  return `${factBubbleStyles.bubble} ${
    isTouched ? factBubbleStyles.touched : ''
  } ${
    isClickable ? factBubbleStyles.clickable : factBubbleStyles.notClickable
  }`.trim();
} 