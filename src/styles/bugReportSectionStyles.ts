import { CSSProperties } from 'react';

/**
 * Styles for the Bug Report Section component
 */
export const bugReportSectionStyles = {
  // Container styles
  container: "flex flex-col items-center justify-center w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md",
  
  // Step container for each form step - updated for better centering
  stepContainer: "flex flex-col items-center w-full max-w-sm pt-0",
  
  // Header styles
  header: "text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white",
  headerStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
  }),
  
  // Form container styles
  formContainer: "w-full mt-6 space-y-4",
  
  // Input field styles
  inputField: "w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2",
  inputFieldStyle: (primaryColor: string): CSSProperties => ({
    outlineColor: `var(--color-${primaryColor})`,
  }),
  
  // Dropdown styles
  dropdownWrapper: "relative w-full mb-4",
  dropdownRelativeContainer: "relative w-full",
  dropdownTrigger: "w-full py-2 px-3 md:px-4 md:py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg flex justify-between items-center cursor-pointer text-black dark:text-white max-[375px]:px-2 max-[375px]:py-1.5",
  dropdownIconContainer: "flex items-center ml-2",
  dropdownIcon: "w-4 h-4 text-gray-600 dark:text-gray-400",
  dropdownContainer: "absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden",
  dropdownOption: "py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-black dark:text-white transition-colors duration-150",
  
  // Dropdown option selection styling
  dropdownOptionSelected: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor}10)`,
    borderLeft: `2px solid var(--color-${primaryColor})`
  }),
  
  dropdownOptionUnselected: {
    borderLeft: '2px solid transparent'
  },
  
  // File upload styles
  fileUploadContainer: "w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 mb-4 p-4",
  fileUploadDraggingStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    backgroundColor: `var(--color-${primaryColor}10)`
  }),
  fileUploadDefaultStyle: {
    borderColor: 'var(--color-gray-300)',
    backgroundColor: 'transparent'
  },
  fileUploadIcon: "w-10 h-10 text-gray-400 mb-2",
  fileUploadText: "text-sm text-gray-500 dark:text-gray-400 text-center",
  fileUploadInfoText: "text-xs text-gray-500 dark:text-gray-400 text-center mt-1",
  uploadedFileContainer: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 mt-2",
  uploadedFileName: "text-sm text-gray-700 dark:text-gray-300 truncate",
  removeFileButton: "text-red-500 hover:text-red-600 focus:outline-none",
  removeFileIcon: "w-4 h-4",
  
  // Loading states
  loadingButton: "inline-flex items-center",
  loadingSpinner: "animate-spin mr-2 h-4 w-4",
  spinnerPath: "opacity-25",
  spinnerPathHighlight: (primaryColor: string): CSSProperties => ({
    opacity: '75',
    stroke: `var(--color-${primaryColor})`
  }),
  
  // Sub screen styles
  submittedContainer: "flex flex-col items-center justify-center pb-8 w-full",
  submittedIcon: "w-12 h-12 mb-4 text-green-500",
  submittedTitle: "text-xl font-bold mb-2",
  submittedTitleStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  submittedMessage: "text-gray-700 dark:text-gray-300 text-center max-w-xs",
  
  // Step animation
  stepAnimation: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.2 }
  },
}; 