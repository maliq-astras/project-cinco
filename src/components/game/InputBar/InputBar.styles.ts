export const inputBarStyles = {
  container: "flex-1 flex flex-col justify-between relative",
  // Shell locks the baseline; textarea is absolutely bottom-anchored inside
  inputShell: "relative h-[66px] sm:h-[76px] overflow-visible",
  input: (isDisabled: boolean) => `w-full min-h-[44px] p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-2xl ${isDisabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} text-gray-900 dark:text-gray-100 font-display outline-none theme-focus-ring transition-all duration-300 ${isDisabled ? 'opacity-70' : 'opacity-100'} pr-16 sm:pr-20 resize-none overflow-hidden`,
  // No bottom:0. We keep the baseline visually fixed using a translateY in the hook
  inputPosition: "relative z-[45] will-change-transform",
  // Pin ENTER inside the input by making it a child of the shell and centering it vertically
  submitButton: "absolute right-2 top-1/2 -translate-y-1/2 font-display text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-1 rounded-md transition-opacity duration-200 z-[70] pointer-events-auto",
  progressContainer: "mt-1",
  
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
  })
} as const;
