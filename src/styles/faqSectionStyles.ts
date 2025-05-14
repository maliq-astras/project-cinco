import { CSSProperties } from 'react';

/**
 * Styles for the FAQ section component
 */
export const faqSectionStyles = {
  // Header styles
  header: 'text-4xl font-bold text-center mt-16 mb-8 md:mb-12',
  headerStyle: (primaryColor: string) => ({
    color: `var(--color-${primaryColor})`,
  }),
  
  // Content wrapper to center the accordion with responsive max-width at breakpoints
  contentWrapper: "flex flex-col items-center justify-center w-full sm:max-w-[500px] md:max-w-[560px] lg:max-w-[560px] mt-6",
  
  // Updated scrollable container with themed scrollbar that's always visible
  scrollContainer: "h-full overflow-y-auto pr-3",
  
  // FAQ list styles - consistent width with breakpoints - fixed for mobile
  faqList: "flex flex-col",
  
  // FAQ item styles with fixed layout
  faqItem: "mb-4 last:mb-0 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0",
  
  // Question button styles with fixed layout
  questionButton: "w-full flex justify-between items-center py-2 focus:outline-none",
  
  // Question text styles - fixed width to ensure consistency
  questionText: "text-left text-base sm:text-lg font-medium text-black dark:text-white text-opacity-90 pr-2",
  
  // Icon container styles - fixed width
  iconContainer: "flex items-center justify-center w-6 h-6 transition-transform duration-200",
  iconContainerActive: "transform rotate-45",
  iconContainerInactive: "",
  
  // Icon styles
  icon: "w-5 h-5",
  iconStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // Button wrapper with consistent width
  buttonWrapper: "w-full mb-1",
  
  // Answer container styles - fixed width to match question width
  answerContainer: "overflow-hidden",
  
  // Answer text styles - match exact question padding
  answerText: "text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-1 pb-2 pl-0",
  
  // Animation configurations
  answerAnimation: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { 
      height: { duration: 0.2 },
      opacity: { duration: 0.15 }
    }
  }
} as const; 