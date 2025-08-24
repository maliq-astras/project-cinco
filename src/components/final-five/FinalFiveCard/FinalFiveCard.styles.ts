import styles from './FinalFiveCard.module.css';

/**
 * Hybrid styles for FinalFiveCard component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from FinalFiveCard.module.css
 * - Animation-critical styles remain as Tailwind classes or inline styles
 * - Dynamic styles use functions for theme integration
 */

export const finalFiveCardStyles = {
  // Static styles from CSS modules
  container: styles.container,
  wrapper: styles.wrapper,
  front: styles.front,
  back: styles.back,
  optionText: styles.optionText,
  xOverlay: styles.xOverlay,
  xOverlayContent: styles.xOverlayContent,
  xSvg: styles.xSvg,
  
  // Animation-critical styles 
  frontNumber: "text-7xl font-bold text-white",
  
  // Interactive effects 
  interactive: {
    hover: (frontBg: string) => ({
      boxShadow: `0 8px 16px rgba(0,0,0,0.2), 0 0 8px ${frontBg}80`,
      transform: "rotateY(180deg) scale(1.03)",
      cursor: 'pointer',
      borderColor: `${frontBg}`
    }),
    active: {
      transform: "rotateY(180deg) scale(0.95)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    default: {
      transform: "rotateY(180deg) scale(1)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }
  },
  
  // Get card dimensions 
  getDimensions: (width: number, height: number, isLandscape: boolean) => {
    // Responsive dimensions based on breakpoints
    if (width <= 480) {
      // Extra small screens
      return {
        minHeight: isLandscape ? "80px" : "90px",
        maxWidth: isLandscape ? "120px" : "140px"
      };
    } else if (width <= 768) {
      // Small screens
      return {
        minHeight: isLandscape ? "90px" : "100px",
        maxWidth: isLandscape ? "130px" : "150px"
      };
    } else if (width <= 1024) {
      // Medium screens
      return {
        minHeight: "100px",
        maxWidth: "160px"
      };
    } else {
      // Large screens
      return {
        minHeight: "110px",
        maxWidth: "170px"
      };
    }
  }
} as const;
