import { CSSProperties } from 'react';

export const supportPageStyles = {
  // Main container - removed scroll behavior
  container: "min-h-screen bg-white dark:bg-gray-950",
  
  // Content container - simplified
  contentContainer: "flex flex-col max-w-7xl mx-auto px-4",
  
  // Main content - fixed height to prevent internal scroll
  mainContent: "flex-1 pb-16 pt-20 md:pt-24",
  
  // Section styles - fixed height with padding
  section: "flex flex-col justify-center py-8",
  
  // Section headers
  sectionHeader: "text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center mx-auto w-full",
  sectionHeaderStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // FAQ styles
  faqList: "space-y-4 md:space-y-6",
  faqItem: "border-b border-gray-200 dark:border-gray-800 pb-4 md:pb-6",
  faqQuestion: "text-lg md:text-xl font-semibold mb-2",
  faqQuestionStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
  }),
  faqAnswer: "text-sm md:text-base text-gray-700 dark:text-gray-300",
  
  // Form styles
  formContainer: "w-full max-w-lg mx-auto px-4",
  formGroup: "mb-4 md:mb-6",
  formLabel: "block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2",
  formInput: "w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm md:text-base",
  formTextarea: "w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent min-h-[8rem] bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm md:text-base",
  formInputStyle: (primaryColor: string): CSSProperties => ({
    outlineColor: `var(--color-${primaryColor})`,
  }),
  
  // Button styles
  button: "mt-4 px-4 py-2 md:px-6 md:py-3 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  buttonStyle: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`,
  }),
  
  // Navigation links container - moved up slightly to prevent overlap
  navLinksContainer: "fixed bottom-12 left-0 right-0 flex justify-between px-6 md:px-16 z-20",
  
  // Navigation link - updated for dark mode
  navLink: "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 hover:scale-105 focus:outline-none bg-white dark:bg-gray-800",
  navLinkStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    border: `1px solid var(--color-${primaryColor}30)`,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }),
  
  // Icon styles
  navIcon: "w-4 h-4",
  navIconStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // Navigation dots for section indicators
  navDotsContainer: "fixed bottom-4 left-0 right-0 flex justify-center gap-3 z-20",
  navDot: "w-2 h-2 rounded-full transition-all duration-200",
  navDotStyle: (primaryColor: string, isActive: boolean): CSSProperties => ({
    backgroundColor: isActive ? `var(--color-${primaryColor})` : 'rgba(150, 150, 150, 0.3)',
    transform: isActive ? 'scale(1.2)' : 'scale(1)'
  }),
  
  // Animation styles
  loadingContainer: "fixed inset-0 flex items-center justify-center z-40 bg-white dark:bg-gray-950",
  pageAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  sectionAnimation: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
    transition: { type: "spring", damping: 20, stiffness: 100 }
  },
  reverseAnimation: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
    transition: { type: "spring", damping: 20, stiffness: 100 }
  },
  loadingAnimation: {
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
} as const; 