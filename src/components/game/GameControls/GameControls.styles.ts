export const gameControlsStyles = {
  container: "w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center",
  wrapper: "w-full max-w-lg mx-auto",
  toastContainer: "fixed top-4 right-4 z-50 flex flex-col gap-2",
  duplicateToast: "hidden bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-slideInRight font-mono",
  skipToast: "hidden bg-blue-100 text-blue-800 py-2 px-4 rounded-md text-sm font-medium border border-blue-200 shadow-md animate-slideInRight font-mono",
  controlsArea: "w-full border-t border-gray-200 px-2 pt-3 pb-2 sm:px-0 sm:py-3 sm:border-0 sm:flex sm:flex-col sm:items-center z-10",
  factsArea: "flex w-full max-w-md gap-2 mx-auto",
  inputContainer: "flex-1 flex flex-col justify-between",
  input: (isDisabled: boolean) => `w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-full ${isDisabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} text-gray-900 dark:text-gray-100 font-display outline-none theme-focus-ring transition-all duration-300 ${isDisabled ? 'opacity-70' : 'opacity-100'} pr-20`,
  progressContainer: "mt-1",
  controlsRight: "flex flex-col justify-between items-center h-[66px] sm:h-[76px] min-w-[70px] sm:min-w-[80px]",
  controlButton: "flex items-center justify-center h-[32px] sm:h-[36px] w-[32px] sm:w-[36px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
  divider: "w-[24px] h-[2px] sm:w-[28px]",
  skipTooltip: "absolute right-2 sm:right-0 top-0 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap text-white",
  skipTooltipCaret: "absolute sm:left-1/2 sm:-translate-x-1/2 right-7 -bottom-1 w-2 h-2 rotate-45",
  submitButton: "absolute right-2 top-1/2 -translate-y-1/2 font-display text-sm font-bold px-2 py-1 rounded-md transition-opacity duration-200",
  inputWrapper: "relative",
  inputWithTheme: (color: string) => ({
    "--theme-color": `var(--color-${color})`,
    paddingRight: "5rem"
  }),
  
  // Style functions
  getButtonStyle: (color: string, isDisabled: boolean, isActive: boolean) => ({
    color: `var(--color-${color})`,
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: isActive ? `var(--color-${color}20)` : 'transparent'
  }),
  getTooltipStyle: (color: string) => ({
    backgroundColor: `var(--color-${color})`
  }),
  
  // Animations
  tooltipAnimation: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 }
  },
  wrapperAnimation: {
    initial: { opacity: 1 },
    animate: (isVictoryAnimationActive: boolean) => ({ 
      opacity: isVictoryAnimationActive ? 0 : 1 
    }),
    transition: { duration: 0.5 }
  },
  buttonAnimation: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    initial: { scale: 0.95 }
  },
  disabledButtonAnimation: {
    initial: { scale: 0.95 }
  }
} as const; 