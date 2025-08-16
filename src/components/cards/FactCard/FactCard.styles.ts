/**
 * Hybrid styles for FactCard component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from FactCard.module.css
 * - Animation-critical styles remain as Tailwind classes
 * - Dynamic styles use functions for theme integration
 */

import styles from './FactCard.module.css';

export const factCardStyles = {
  // Static styles from CSS modules
  modalOverlay: styles.modalOverlay,
  cardContainer: styles.cardContainer,
  closeButton: styles.closeButton,
  closeButtonIcon: styles.closeButtonIcon,
  cardContent: styles.cardContent,
  topHalf: styles.topHalf,
  bottomHalf: styles.bottomHalf,
  factContent: styles.factContent,
  
  // Animation-critical styles 
  flipCard: "flip-card",
  cardBack: "flip-card-back absolute inset-0 z-[101]",
  cardFront: "flip-card-front absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none p-4 sm:p-6 flex flex-col dark:border-2 dark:border-gray-700 dark:high-contrast:border-gray-300 z-[101]",
  
  // Dynamic styles with theme integration
  getFactTypeClasses: (primaryColor: string) => `text-base sm:text-lg font-semibold text-center mt-4 fact-type`,
  
  // Animation properties
  flipAnimation: {
    initial: { rotateY: 0 },
    animate: (isFlipped: boolean, isDrawn: boolean, isClosing: boolean) => ({ 
      rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 
    })
  },
  
  // 3D transform properties
  preserve3d: {
    transformStyle: 'preserve-3d'
  },
} as const; 