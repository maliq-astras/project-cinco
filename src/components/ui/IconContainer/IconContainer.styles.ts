/**
 * Extracted Tailwind classes for icon components
 */

export const iconContainerStyles = {
  // Base container styles
  container: "aspect-square rounded-full flex items-center justify-center",
  
  // Background classes
  lightBackground: "", // Light mode background is handled via inline style
  darkBackground: "dark:bg-gray-700",
  
  // Card back icon styles
  cardBackContainer: "flex items-center justify-center",
};

/**
 * Style helper functions
 */
export function getIconContainerBgStyle(isRevealed: boolean, colorVar: string) {
  return isRevealed ? undefined : { backgroundColor: `var(--color-${colorVar})` };
}

/**
 * Style settings for icon images
 */
export const iconImageStyles = {
  standard: {
    transition: 'opacity 0.3s ease',
  },
  revealed: {
    lightMode: { opacity: 1 },
    darkMode: { opacity: 1.15, transform: 'scale(1.05)' }
  },
  hidden: {
    opacity: 0.7
  }
}; 