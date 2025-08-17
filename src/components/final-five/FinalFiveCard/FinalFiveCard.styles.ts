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
  getDimensions: () => {
    if (typeof window !== 'undefined') {
      // Check if we're on Surface Duo
      const isSurfaceDuo = window.navigator.userAgent.includes('Surface Duo');
      
      if (isSurfaceDuo) {
        // Special dimensions for Surface Duo in landscape mode
        if (window.innerWidth > window.innerHeight) {
          return {
            minHeight: "120px",
            maxWidth: "150px"
          };
        }
        // Surface Duo portrait dimensions
        return {
          minHeight: "90px",
          maxWidth: "140px"
        };
      }
    }
    
    return {
      minHeight: "100px",
      maxWidth: "160px"
    };
  }
} as const;
