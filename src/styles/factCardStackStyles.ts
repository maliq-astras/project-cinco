import { CSSProperties } from 'react';

/**
 * Styles for the FactCardStack component
 */
export const factCardStackStyles = {
  // Container styles
  container: "flex justify-center items-end relative card-stack-container",
  
  // Inner container with perspective effect
  innerContainer: "relative flex items-end justify-center transition-transform duration-300 ease-out",
  
  // Card styles
  card: {
    base: "absolute p-0 border-0 rounded-lg",
    clickable: "cursor-pointer card-hover-glow",
    nonClickable: "cursor-not-allowed opacity-70",
    stack: "card-in-stack"
  },
  
  // Card shadow classes based on position
  shadows: {
    first: "card-shadow-strong",
    middle: "card-shadow-medium",
    last: "card-shadow-light"
  },
  
  // Darkmode specific classes
  darkMode: {
    clickable: "" // No glow effect in dark mode
  },
  
  // Card positioning
  getCardPosition: (
    cardSize: { width: number; height: number },
    index: number,
    totalCards: number
  ): CSSProperties => ({
    transformOrigin: 'bottom center',
    left: `calc(50% - ${cardSize.width / 2}px)`,
    bottom: '0px',
    width: `${cardSize.width}px`,
    height: `${cardSize.height}px`,
    zIndex: totalCards - index
  }),
} as const;

/**
 * Get dynamic card class names based on card state
 */
export function getCardClassNames({
  isClickable,
  shadowClass,
  isDarkMode
}: {
  isClickable: boolean;
  shadowClass: string;
  isDarkMode: boolean;
}) {
  const { card } = factCardStackStyles;
  
  return `${card.base} ${
    isClickable ? 
      `${card.clickable} ${isDarkMode ? factCardStackStyles.darkMode.clickable : ''}` : 
      card.nonClickable
  } ${card.stack} ${shadowClass}`;
} 