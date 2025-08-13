export const gameControlsStyles = {
  container: "w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center",
  wrapper: "w-full max-w-lg mx-auto",
  toastContainer: "fixed top-4 right-4 z-50 flex flex-col gap-2",
  duplicateToast: "hidden bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-slideInRight font-mono",
  skipToast: "hidden bg-blue-100 text-blue-800 py-2 px-4 rounded-md text-sm font-medium border border-blue-200 shadow-md animate-slideInRight font-mono",
  controlsArea: "w-full border-t border-gray-200 px-2 pt-3 pb-2 sm:px-0 sm:py-3 sm:border-0 sm:flex sm:flex-col sm:items-center z-10",
  factsArea: "flex w-full max-w-md sm:max-w-lg lg:max-w-xl gap-2 mx-auto",
  inputContainer: "flex-1 flex flex-col justify-between relative",
  // Shell locks the baseline; textarea is absolutely bottom-anchored inside
  inputShell: "relative h-[66px] sm:h-[76px] overflow-visible",
  input: (isDisabled: boolean) => `w-full min-h-[44px] p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-2xl ${isDisabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} text-gray-900 dark:text-gray-100 font-display outline-none theme-focus-ring transition-all duration-300 ${isDisabled ? 'opacity-70' : 'opacity-100'} pr-16 sm:pr-20 resize-none overflow-hidden`,
  // No bottom:0. We keep the baseline visually fixed using a translateY in the hook
  inputPosition: "relative z-[45] will-change-transform",
  progressContainer: "mt-1",
  controlsRight: "flex flex-col justify-between items-center h-[66px] sm:h-[76px] min-w-[60px] sm:min-w-[80px]",
  controlButton: "flex items-center justify-center h-[32px] sm:h-[36px] w-[32px] sm:w-[36px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
  divider: "w-[24px] h-[2px] sm:w-[28px]",
  skipTooltip: "absolute right-2 sm:right-0 top-0 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap text-white z-[90]",
  skipTooltipCaret: "absolute right-7 sm:right-6 -bottom-1 w-2 h-2 rotate-45 z-[90]",
  // Pin ENTER inside the input by making it a child of the shell and using absolute positioning
  submitButton: "absolute right-2 bottom-2 font-display text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-1 rounded-md transition-opacity duration-200 z-[70] pointer-events-auto",
  inputWrapper: "relative",
  inputWithTheme: (color: string) => ({
    "--theme-color": `var(--color-${color})`,
    paddingRight: "5rem",
    transitionProperty: "height, transform",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "height, transform",
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    transform: "translateY(0)",
    overflowY: "hidden" as const,
    // Hide legacy scrollbars if any engine still paints them
    msOverflowStyle: "none" as const,
    scrollbarWidth: "none" as const
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