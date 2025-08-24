import styles from './FinalFiveModal.module.css';

/**
 * Hybrid styles for FinalFiveModal component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from FinalFiveModal.module.css
 * - Dynamic styles use functions for responsive behavior
 */

export const finalFiveStyles = {
  // Static styles from CSS modules
  modalContainer: styles.modalContainer,
  modalContent: styles.modalContent,
  mobileHandle: styles.mobileHandle,
  warningIcon: {
    container: styles.warningIconContainer,
    icon: styles.warningIcon
  },
  header: styles.header,
  message: styles.message,
  timerContainer: styles.timerContainer,
  timerWrapper: styles.timerWrapper,
  buttonContainer: styles.buttonContainer,
  continueButton: styles.continueButton,
  loadingSpinner: styles.loadingSpinner,
  
  // Dynamic styles 
  getCardGrid: (width: number, height: number, isLandscape: boolean) => {
    // Responsive grid layout
    if (width <= 480) {
      // Extra small screens - 2x3 grid
      return "grid grid-cols-2 gap-3 mb-4 mx-auto max-w-[320px] px-2";
    } else if (width <= 768) {
      // Small screens - 2x3 grid
      return "grid grid-cols-2 gap-4 mb-6 mx-auto max-w-[420px] px-2";
    } else if (isLandscape && height <= 600) {
      // Landscape with low height - 3x2 grid
      return "grid grid-cols-3 grid-rows-2 gap-3 mb-4 mx-auto max-w-[650px]";
    } else {
      // Medium+ screens - 3x2 grid
      return "grid grid-cols-3 grid-rows-2 gap-4 mb-6 mx-auto max-w-[600px]";
    }
  },
  
  // Card styles 
  card: {
    container: "relative aspect-square w-full perspective-1000",
    wrapper: "w-full h-full relative preserve-3d",
    front: "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden shadow-md dark:border-2 dark:border-gray-700 dark:high-contrast:border-gray-300", 
    back: "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden shadow-md font-display border-2 dark:border-gray-700 dark:high-contrast:border-gray-300",
    
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
    
    // Get card dimensions - use same responsive logic as FinalFiveCard
    getDimensions: (width: number, height: number, isLandscape: boolean) => {
      // Responsive dimensions based on breakpoints - same as FinalFiveCard
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
  },
  
  // Loading spinner class 
  loadingSpinnerClass: "h-5 w-5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent",
  
  // Message formatting 
  correctAnswerText: (color: string) => ({
    color: color,
    fontWeight: 'bold'
  })
} as const; 