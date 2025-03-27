/**
 * Extracted Tailwind classes for the FactCard component
 */

export const factCardStyles = {
  // Modal and container styles
  modalOverlay: "fixed inset-0 flex items-center justify-center z-50 modal-overlay bg-black bg-opacity-50",
  cardContainer: "relative w-[280px] sm:w-[320px] h-[420px] sm:h-[480px] rounded-lg shadow-xl overflow-hidden",
  
  // Flip card classes
  flipCard: "flip-card",
  cardBack: "flip-card-back absolute inset-0",
  cardFront: "flip-card-front absolute inset-0 bg-white rounded-lg shadow-xl p-4 sm:p-6 flex flex-col card-border-glow",
  
  // Button styles
  closeButton: "absolute top-4 right-4 z-20",
  closeButtonIcon: "w-6 h-6",
  
  // Content styles
  cardContent: "w-full h-full flex flex-col z-10",
  
  // Content sections
  topHalf: "flex-1 flex flex-col items-center justify-center pb-4 border-b border-gray-200",
  bottomHalf: "flex-1 flex items-center justify-center pt-4",
  factContent: "text-gray-800 text-sm sm:text-base text-left leading-tight sm:leading-snug px-1",
  
  // Helper function for dynamic classes
  getFactTypeClasses: (darkColor: string) => `text-base sm:text-lg font-semibold text-${darkColor} text-center mt-4`
}; 