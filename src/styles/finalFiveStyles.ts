/**
 * Styles for the Final Five Modal component
 */
export const finalFiveStyles = {
  // Main modal container
  modalContainer: "fixed inset-0 z-40 flex md:items-center justify-center bg-black/75 backdrop-blur-sm",
  
  // Modal content panel
  modalContent: "w-full max-w-[580px] bg-white dark:bg-gray-900 md:rounded-xl rounded-t-xl shadow-2xl p-4 mx-0 md:mx-4 md:p-6 absolute md:relative bottom-0 md:bottom-auto",
  
  // Mobile handle
  mobileHandle: "w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 md:hidden",
  
  // Header
  header: "text-4xl font-bold text-center mb-6",
  
  // Message
  message: "text-left mb-6 text-gray-700 dark:text-gray-300 font-display",
  
  // Card grid
  cardGrid: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mx-auto max-w-[500px]",
  
  // Timer container
  timerContainer: "relative aspect-square w-full flex items-center justify-center",
  timerWrapper: "w-full h-full rounded-xl flex items-center justify-center shadow-md",
  
  // Button container
  buttonContainer: "h-14 relative",
  
  // Continue button
  continueButton: "px-8 py-3 rounded-full font-display font-bold text-white transition-all"
}; 