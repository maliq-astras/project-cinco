/**
 * Extracted Tailwind classes for the FactCard component
 */

export const factCardStyles = {
  // Modal and container styles
  modalOverlay: "fixed inset-0 flex items-center justify-center z-[100] modal-overlay bg-black bg-opacity-50",
  cardContainer: "relative w-[280px] sm:w-[320px] h-[420px] sm:h-[480px] rounded-lg shadow-xl overflow-hidden z-[101]",
  
  // Flip card classes
  flipCard: "flip-card",
  cardBack: "flip-card-back absolute inset-0 z-[101]",
  cardFront: "flip-card-front absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none p-4 sm:p-6 flex flex-col dark:border-2 dark:border-gray-700 dark:high-contrast:border-gray-300 z-[101]",
  
  // Button styles
  closeButton: "absolute top-4 right-4 z-[102]",
  closeButtonIcon: "w-6 h-6",
  
  // Content styles
  cardContent: "w-full h-full flex flex-col z-[101]",
  
  // Content sections
  topHalf: "flex-1 flex flex-col items-center justify-center pb-4 border-b border-gray-200 dark:border-gray-700",
  bottomHalf: "flex-1 flex items-center justify-center pt-4",
  factContent: "text-gray-800 dark:text-gray-200 text-sm sm:text-base text-left leading-tight sm:leading-snug px-1",
  
  // Helper function for dynamic classes
  getFactTypeClasses: (primaryColor: string) => `text-base sm:text-lg font-semibold text-center mt-4 fact-type`,
  
  // Animation properties
  flipAnimation: {
    initial: { rotateY: 0 },
    animate: (isFlipped: boolean, isDrawn: boolean, isClosing: boolean) => ({ 
      rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 
    })
  },
  
  // Style properties
  preserve3d: {
    transformStyle: 'preserve-3d'
  },
} as const; 