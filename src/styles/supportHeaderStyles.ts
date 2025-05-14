import { CSSProperties } from 'react';

export const supportHeaderStyles = {
  // Main container - consistent padding with slight adjustments for portrait
  container: "fixed top-0 left-0 w-full z-5 flex items-center justify-center py-4 portrait:py-3 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm",
  
  // Content container
  contentContainer: "flex items-center",
  
  // Logo container - more consistent sizing with smaller reduction for portrait
  logoContainer: "h-20 sm:h-24 md:h-26 lg:h-28 portrait:h-20 mr-3 md:mr-4",
  
  // Title styles - more consistent sizing across breakpoints
  title: "text-3xl sm:text-3xl md:text-4xl lg:text-4xl m-0",
  
  // Animation styles
  headerAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  
  // Get title style with theme color
  getTitleStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  })
} as const; 