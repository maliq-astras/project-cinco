import { CSSProperties } from 'react';
import styles from './FactCardStack.module.css';

/**
 * Hybrid styles for FactCardStack component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from FactCardStack.module.css
 * - Animation-critical styles remain as Tailwind classes
 * - Dynamic positioning uses CSS properties for precise control
 */

export const factCardStackStyles = {
  // Static styles from CSS modules
  container: styles.container,
  innerContainer: styles.innerContainer,
  card: styles.card,
  cardClickable: styles.cardClickable,
  cardNonClickable: styles.cardNonClickable,
  cardInStack: styles.cardInStack,
  
  // Animation-critical styles 
  cardHoverGlow: "card-hover-glow",
  
  // Card shadow classes 
  shadows: {
    default: "shadow-sm",
    hovered: "shadow-xl", 
    adjacent: "shadow-md"
  },
  
  // Darkmode specific classes
  darkMode: {
    clickable: "" 
  },
  
  // Card positioning - now simplified since cards are in the same container as drop zone
  getCardPosition: (
    cardSize: { width: number; height: number },
    index: number,
    totalCards: number
  ): CSSProperties => {
    return {
      transformOrigin: 'bottom center',
      left: `calc(50% - ${cardSize.width / 2}px)`,
      bottom: '0px', // Cards sit at the bottom of the drop zone
      width: `${cardSize.width}px`,
      height: `${cardSize.height}px`,
      zIndex: totalCards - index
    };
  },
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
  return `${factCardStackStyles.card} ${
    isClickable ? 
      `${factCardStackStyles.cardClickable} ${factCardStackStyles.cardHoverGlow} ${isDarkMode ? factCardStackStyles.darkMode.clickable : ''}` : 
      factCardStackStyles.cardNonClickable
  } ${factCardStackStyles.cardInStack} ${shadowClass}`;
} 