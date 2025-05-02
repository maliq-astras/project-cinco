import { CSSProperties } from 'react';

export const faqSectionStyles = {
  // Header styles
  header: 'text-4xl font-bold text-center mt-16 mb-8 md:mb-12',
  headerStyle: (primaryColor: string) => ({
    color: `var(--color-${primaryColor})`,
  }),
  
  // Content wrapper to center the accordion with responsive max-width at breakpoints
  contentWrapper: "flex flex-col items-center justify-center w-full sm:max-w-[500px] md:max-w-[560px] lg:max-w-[560px] mt-6",
  
  // Scrollable container for the FAQ list
  scrollContainer: "w-full overflow-y-auto pr-1 custom-scrollbar max-h-[45vh] md:max-h-[55vh] lg:max-h-[60vh]",
  
  // FAQ list styles - consistent width with breakpoints
  faqList: "w-full sm:w-[500px] md:w-[560px] max-w-full divide-y divide-gray-200 dark:divide-gray-700 border-t border-b border-gray-200 dark:border-gray-700 box-border",
  
  // FAQ item styles with fixed layout
  faqItem: "w-full border-0 box-border",
  
  // Question button styles with fixed layout
  questionButton: "w-full flex justify-between items-center py-5 px-4 focus:outline-none group text-left box-border",
  
  // Question text styles - fixed width to ensure consistency
  questionText: "font-semibold text-lg md:text-xl text-gray-800 dark:text-white group-hover:text-opacity-80 transition-all duration-200 block w-[calc(100%-3rem)]",
  
  // Icon container styles - fixed width
  iconContainer: "flex items-center justify-center transition-transform duration-500 ease-in-out w-10 flex-shrink-0",
  iconContainerActive: "rotate-45",
  iconContainerInactive: "",
  
  // Icon styles
  icon: "w-6 h-6 flex-shrink-0",
  iconStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // Button wrapper with consistent width
  buttonWrapper: "w-full box-border",
  
  // Answer container styles - fixed width to match question width
  answerContainer: "overflow-hidden w-full box-border",
  
  // Answer text styles - match exact question padding
  answerText: "pb-6 pl-4 pr-14 text-gray-600 dark:text-gray-300 text-base w-full box-border",
  
  // Animation configurations
  answerAnimation: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }
} as const; 