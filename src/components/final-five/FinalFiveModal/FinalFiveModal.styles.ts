import styles from './FinalFiveModal.module.css';
import { deviceDetection } from '@/helpers/deviceHelpers';

/**
 * Hybrid styles for FinalFiveModal component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from FinalFiveModal.module.css
 * - Dynamic styles use functions for device detection and responsive behavior
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
  getCardGrid: () => {
    // Surface Duo specific layouts
    if (typeof window !== 'undefined' && deviceDetection.isSurfaceDuo()) {
      // Check if we're in landscape mode (wider than tall)
      if (window.innerWidth > window.innerHeight) {
        return "grid grid-cols-3 grid-rows-2 gap-3 mb-6 mx-auto max-w-[650px]";
      }
      // Portrait mode layout
      return "grid grid-cols-2 gap-4 mb-6 mx-auto max-w-[420px]";
    }
    
    // Default layout: full width on mobile, constrained center on md+
    return "grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mx-auto w-full md:max-w-[600px] px-2 md:px-0";
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
    
    // Get card dimensions adjusted for Surface Duo
    getDimensions: () => {
      if (typeof window !== 'undefined' && deviceDetection.isSurfaceDuo()) {
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
      
      return {
        minHeight: "100px",
        maxWidth: "160px"
      };
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