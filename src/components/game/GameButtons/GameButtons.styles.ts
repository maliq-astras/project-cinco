export const gameButtonsStyles = {
  container: "flex flex-col justify-between items-center h-[66px] sm:h-[76px] min-w-[60px] sm:min-w-[80px]",
  controlButton: "flex items-center justify-center h-[32px] sm:h-[36px] w-[32px] sm:w-[36px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
  divider: "w-[24px] h-[2px] sm:w-[28px]",
  skipTooltip: "absolute right-2 sm:right-0 top-0 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap text-white z-[90]",
  skipTooltipCaret: "absolute right-7 sm:right-6 -bottom-1 w-2 h-2 rotate-45 z-[90]",
  
  // Style functions
  getButtonStyle: (color: string, isDisabled: boolean, isActive: boolean) => ({
    color: `var(--color-${color})`,
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: isActive ? `var(--color-${color}20)` : 'transparent'
  }),
  getTooltipStyle: (color: string) => ({
    backgroundColor: `var(--color-${color})`
  })
} as const;
