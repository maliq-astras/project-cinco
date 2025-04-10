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
  
  // Card styles
  card: {
    container: "relative aspect-square w-full perspective-1000",
    wrapper: "w-full h-full relative preserve-3d",
    front: "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden shadow-md", 
    back: "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden shadow-md font-display border-2",
    
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
    }
  },
  
  // Timer container
  timerContainer: "relative aspect-square w-full flex items-center justify-center",
  timerWrapper: "w-full h-full rounded-xl flex items-center justify-center shadow-md",
  
  // Button container
  buttonContainer: "h-14 relative",
  
  // Continue button
  continueButton: "px-8 py-3 rounded-full font-display font-bold text-white transition-all"
}; 