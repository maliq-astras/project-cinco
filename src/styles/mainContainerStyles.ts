export const mainContainerStyles = {
  container: `flex flex-col h-screen w-full items-center bg-white dark:bg-black text-gray-800 dark:text-gray-100 overflow-hidden`,
  
  loadingWrapper: `flex-1 flex items-center justify-center w-full`,
  
  main: `w-full flex-1 flex flex-col items-center justify-between`,
  
  gameContent: `w-full flex-1 flex flex-col items-center pt-1 pb-2 sm:py-2 gap-1`,
  
  topSection: `w-full flex justify-center`,
  
  middleSection: `flex-1 flex flex-col justify-center w-full`,
  
  contextLine: `w-full relative flex-shrink-0 mb-2`,
  
  horizontalLine: (primaryColor: string) => `absolute inset-x-0 h-1 bg-${primaryColor}30`,
  
  contextWrapper: `absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center`,
  
  contextContainer: `px-4 py-1 rounded-lg relative z-10`,
  
  factBubblesWrapper: `w-full flex justify-center mb-2 mt-3`,
  
  factBubblesContainer: `w-full max-w-lg mb-0 py-0 sm:pt-1`,
  
  bottomSection: `w-full mt-auto`,
  
  instructionsWrapper: `w-full relative my-1 flex-shrink-0`,
  
  instructionsContainer: `flex justify-center`,
  
  instructionsInner: `px-4 py-1 rounded-lg`,
  
  controlsWrapper: `w-full flex justify-center mb-2`,
  
  // Small landscape mode warning
  warningOverlay: `fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center p-6 z-50`,
  
  warningIcon: `w-16 h-16 mb-4 animate-pulse`,
  
  warningTitle: (primaryColor: string) => `text-xl font-bold mb-2 dark:text-white text-${primaryColor}`,
  
  warningText: `text-center mb-4 dark:text-gray-200`,
  
  spinIcon: `w-12 h-12 animate-spin-slow`,
  
  // Transitions
  fadeIn: { 
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay: 2.4 }
  },
  
  fadeOut: {
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 }
  },
  
  staggeredFade: (delay: number) => ({
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, delay }
  }),
  
  // Context line styles
  contextLineBackground: (primaryColor: string) => ({
    backgroundColor: `var(--color-${primaryColor}30)`
  }),
  
  // Section spacing
  sectionGap: {
    gap: "1rem"
  }
} as const; 