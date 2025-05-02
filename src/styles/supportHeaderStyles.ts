import { CSSProperties } from 'react';

export const supportHeaderStyles = {
  // Main container
  container: "fixed top-0 left-0 w-full z-50 flex items-center justify-center py-5 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm",
  
  // Content container
  contentContainer: "flex items-center",
  
  // Logo container
  logoContainer: "h-32 md:h-40 mr-5",
  
  // Title styles
  title: "text-4xl md:text-5xl m-0",
  
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