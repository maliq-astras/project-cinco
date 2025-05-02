import { CSSProperties } from 'react';

export const bugReportSectionStyles = {
  // Container with responsive width constraints and proper vertical spacing
  container: "flex flex-col items-center justify-between w-full sm:max-w-[500px] md:max-w-[560px] mx-auto px-4 min-h-[calc(100vh-280px)]",
  
  // Header styles matching FAQ header
  header: "text-4xl font-bold text-center mt-16 mb-8 md:mb-12",
  headerStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // Form container - fixed width for consistent appearance, centered vertically
  formContainer: "w-full flex-1 flex flex-col items-center justify-center my-8",
  
  // Label styles
  label: "block text-lg font-semibold mb-6 text-center text-black dark:text-white w-full",
  
  // Step content container
  stepContainer: "flex flex-col items-center w-full",
  
  // Input field styles
  input: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 mb-6",
  inputStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    outlineColor: `var(--color-${primaryColor})`
  }),
  
  // Textarea styles
  textarea: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 mb-6 min-h-[120px]",
  textareaStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    outlineColor: `var(--color-${primaryColor})`
  }),
  
  // Dropdown wrapper
  dropdownWrapper: "w-full mb-6",
  
  // Dropdown container
  dropdownRelativeContainer: "relative w-full",
  
  // Dropdown trigger button
  dropdownTrigger: "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 cursor-pointer flex items-center justify-between",
  dropdownTriggerStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`
  }),
  
  // Dropdown icon container
  dropdownIconContainer: "ml-2 text-gray-500 dark:text-gray-400",
  
  // Dropdown icon
  dropdownIcon: "w-4 h-4",
  
  // Dropdown options container
  dropdownContainer: "absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto",
  dropdownContainerStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`
  }),
  
  // Dropdown option
  dropdownOption: "px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-white",
  dropdownOptionStyle: (isSelected: boolean, primaryColor: string): CSSProperties => ({
    backgroundColor: isSelected ? `var(--color-${primaryColor}10)` : undefined,
    borderLeft: isSelected ? `2px solid var(--color-${primaryColor})` : '2px solid transparent'
  }),
  
  // File upload styles - fixed width for consistent appearance
  fileUploadContainer: "w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors mb-6",
  fileUploadContainerStyle: (isDragging: boolean, primaryColor: string): CSSProperties => ({
    borderColor: isDragging ? `var(--color-${primaryColor})` : 'var(--color-gray-300)',
    backgroundColor: isDragging ? `var(--color-${primaryColor}10)` : undefined
  }),
  
  // File upload text styles
  fileUploadText: "text-center text-gray-500 dark:text-gray-400 mt-2",
  fileUploadIcon: "w-10 h-10 text-gray-400 dark:text-gray-500 mb-2",
  fileUploadOptional: "text-xs text-gray-400",
  
  // File preview container
  filePreviewContainer: "w-full p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-6 flex items-center",
  filePreviewIcon: "w-6 h-6 text-gray-500 dark:text-gray-400 mr-2",
  filePreviewText: "truncate flex-1 text-sm text-gray-800 dark:text-gray-200",
  filePreviewRemoveButton: "ml-2 text-red-500 hover:text-red-700",
  
  // Button styles
  button: "mt-4 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 text-base md:text-lg hover:brightness-105",
  buttonStyle: (primaryColor: string): CSSProperties => ({
    background: `var(--color-${primaryColor})`,
    transform: "scale(1)",
  }),
  
  // Success container
  successContainer: "flex flex-col items-center justify-center py-8 w-full",
  
  // Success icon
  successIconContainer: "w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4",
  successIcon: "w-8 h-8 text-green-600",
  
  // Success title
  successTitle: "text-xl font-bold mb-2 text-center",
  
  // Success message
  successMessage: "text-center text-lg text-green-600 dark:text-green-400 mb-4",
  
  // Progress bar - moved to the bottom with margin
  progressContainer: "w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-14 mt-auto overflow-hidden",
  progressBar: "h-full rounded-full",
  progressBarStyle: (progress: number, primaryColor: string): CSSProperties => ({
    width: `${progress}%`,
    backgroundColor: `var(--color-${primaryColor})`
  }),
  
  // Step animations
  stepAnimation: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.35 }
  }
} as const; 