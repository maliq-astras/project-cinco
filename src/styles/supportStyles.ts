import { CSSProperties } from 'react';

export const bugReportStyles = {
  container: "flex flex-col items-center min-h-[400px]",
  sectionHeader: "text-2xl font-bold mb-8 text-center",
  sectionHeaderStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),

  // Form elements
  formInput: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary mb-4",
  dropdownTrigger: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer flex items-center justify-between",
  dropdownContainer: "absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto",
  dropdownOption: "px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-white",
  dropdownOptionStyle: (isSelected: boolean, primaryColor: string): CSSProperties => ({
    backgroundColor: isSelected ? `var(--color-${primaryColor}10)` : undefined,
    borderLeft: isSelected ? `2px solid var(--color-${primaryColor})` : '2px solid transparent'
  }),

  // File upload
  fileUploadContainer: (isDragging: boolean, primaryColor: string) => 
    `w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors ${
      isDragging 
        ? 'border-primary bg-primary bg-opacity-10' 
        : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
    }`,
  fileUploadContainerStyle: (isDragging: boolean, primaryColor: string): CSSProperties => ({
    borderColor: isDragging ? `var(--color-${primaryColor})` : undefined,
    cursor: 'pointer'
  }),

  // Buttons
  primaryButton: "mt-2 px-6 py-2 rounded bg-primary text-white font-semibold shadow disabled:opacity-50",
  primaryButtonStyle: (primaryColor: string): CSSProperties => ({
    background: `var(--color-${primaryColor})`
  }),
  secondaryButton: "px-6 py-2 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold shadow",

  // Progress bar
  progressContainer: "w-full max-w-lg mt-8",
  progressBar: "h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
  progressFill: "h-2 rounded-full",
  progressFillStyle: (primaryColor: string, progress: number): CSSProperties => ({
    background: `var(--color-${primaryColor})`,
    width: `${progress}%`
  })
} as const;

export const faqStyles = {
  container: "max-w-4xl mx-auto px-4 py-8",
  header: "text-2xl font-bold mb-8 text-center",
  headerStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  // Add FAQ specific styles here
} as const;

export const feedbackStyles = {
  container: "max-w-4xl mx-auto px-4 py-8",
  header: "text-2xl font-bold mb-8 text-center",
  headerStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  // Add feedback specific styles here
} as const;

export const supportHeaderStyles = {
  container: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  innerContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  header: "flex justify-between items-center h-16",
  title: "text-2xl font-bold",
  titleStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  })
} as const;

export const diamondNavStyles = {
  container: "flex justify-center items-center space-x-4 mb-8",
  diamond: "transform rotate-45 w-3 h-3",
  diamondStyle: (isActive: boolean, primaryColor: string): CSSProperties => ({
    backgroundColor: isActive ? `var(--color-${primaryColor})` : 'rgb(209, 213, 219)'
  })
} as const; 