/**
 * Dynamic styles for GameContent component
 * Handles theme integration and animations
 */

export const gameContentStyles = {
  // Context line background - dynamic color
  contextLineBackground: (primaryColor: string) => ({
    backgroundColor: `var(--color-${primaryColor}30)`
  }),

  // Professional staggered entrance animations - adapted for flipped wide layout
  gameEntranceAnimation: {
    // Top section (context area) - enters first
    topSection: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    
    // Middle section (bubbles - now right panel) - enters second
    middleSection: {
      initial: { opacity: 0, x: 20 }, // Slide in from right for right panel
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    
    // Bottom section (game controls - bottom panel) - enters last
    bottomSection: {
      initial: { opacity: 0, y: 20 }, // Slide in from bottom
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    
    // Card stack (now left panel) - enters with slight delay
    cardStack: {
      initial: { opacity: 0, scale: 0.95, x: -20 }, // Slide in from left
      animate: { opacity: 1, scale: 1, x: 0 },
      transition: { duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }
} as const;