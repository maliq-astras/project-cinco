/**
 * Dynamic styles for MobileGameContent component
 * Handles theme integration and animations for mobile/vertical layout
 */

export const mobileGameContentStyles = {
  // Context line background - dynamic color
  contextLineBackground: (primaryColor: string) => ({
    backgroundColor: `var(--color-${primaryColor}30)`
  }),

  // Section spacing
  sectionGap: {
    gap: "1rem"
  },

  // Professional staggered entrance animations for mobile layout
  gameEntranceAnimation: {
    // Top section (card stack) - enters first
    cardStack: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },

    // Top section (context area) - enters first
    topSection: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    
    // Middle section (bubbles) - enters second with stagger
    middleSection: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    
    // Bottom section (game controls) - enters last
    bottomSection: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }
} as const;