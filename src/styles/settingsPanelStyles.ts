import { CSSProperties } from 'react';

export const settingsPanelStyles = {
  // Main containers
  mobileContainer: "fixed inset-0 bg-black bg-opacity-70 z-50",
  mobilePanel: (primaryColor: string): CSSProperties => ({
    borderTop: `4px solid var(--color-${primaryColor})`,
    borderLeft: `1px solid var(--color-${primaryColor})`,
    borderRight: `1px solid var(--color-${primaryColor})`
  }),
  mobilePanelClass: "absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-lg",
  mobileDragIndicator: "w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto my-2 max-w-[4rem]",
  
  desktopContainer: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50",
  desktopPanel: (primaryColor: string): CSSProperties => ({
    border: `2px solid var(--color-${primaryColor})`
  }),
  desktopPanelClass: "bg-white dark:bg-black rounded-xl shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
  
  contentContainer: "p-6 max-h-[80vh] overflow-y-auto",
  
  // Header
  header: "flex justify-between items-center mb-6",
  title: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  titleClass: "text-xl font-bold dark:text-white",
  closeButton: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  closeButtonClass: "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
  
  // Settings sections
  settingsContainer: "space-y-6",
  settingRow: "flex items-center justify-between",
  settingTextContainer: "space-y-1",
  settingTitle: "font-medium text-gray-800 dark:text-gray-200",
  settingDescription: "text-sm text-gray-500 dark:text-gray-400",
  settingErrorText: "text-xs text-red-500 mt-1",
  
  // Toggle switch
  toggleSwitch: (isOn: boolean, primaryColor: string, disabled: boolean): CSSProperties => ({
    backgroundColor: isOn 
      ? `var(--color-${primaryColor})` 
      : 'rgb(209, 213, 219)', // gray-300
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }),
  toggleSwitchClass: "w-12 h-6 rounded-full p-1 transition-colors",
  toggleDot: (isOn: boolean): string => 
    `w-4 h-4 rounded-full bg-white transform transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`,
  
  // Language selector
  languageContainer: "flex flex-col",
  languageLabel: "font-medium text-gray-800 dark:text-gray-200 mb-1",
  languageSelect: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  languageSelectClass: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white",
  
  // Footer
  footer: "mt-8 border-t border-gray-200 dark:border-gray-700 pt-4",
  footerText: "text-xs text-gray-500 dark:text-gray-400 text-center",
  
  // Animations
  overlayAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  mobilePanelAnimation: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'tween', duration: 0.3 }
  }
} as const; 