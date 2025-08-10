import { CSSProperties } from 'react';

export const settingsPanelStyles = {
  // Main containers
  mobileContainer: "fixed inset-0 bg-black bg-opacity-70 z-[70] backdrop-blur-md",
  mobilePanelClass: "absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-lg min-h-[510px]",
  mobilePanel: (primaryColor: string): CSSProperties => ({
    borderTop: `4px solid var(--color-${primaryColor})`,
    borderLeft: `1px solid var(--color-${primaryColor})`,
    borderRight: `1px solid var(--color-${primaryColor})`,
    maxHeight: '95vh'
  }),
  mobileDragIndicator: "w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto my-2 max-w-[4rem]",
  
  desktopContainer: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[70] backdrop-blur-md",
  desktopPanelClass: "bg-white dark:bg-black rounded-xl shadow-lg p-6 max-w-md w-full mx-4",
  desktopPanel: (primaryColor: string): CSSProperties => ({
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight: '90vh'
  }),
  
  contentContainer: "p-6",
  
  // Header
  header: "flex justify-between items-center mb-6",
  titleClass: "text-xl font-bold dark:text-white",
  title: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  closeButtonClass: "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
  closeButton: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  
  // Settings sections
  settingsContainer: "space-y-6",
  settingRow: "flex items-center justify-between gap-4",
  settingTextContainer: "flex-1 space-y-1",
  settingTitle: "font-medium text-gray-800 dark:text-gray-200",
  settingDescription: "text-sm text-gray-500 dark:text-gray-400",
  settingErrorText: "text-sm text-red-500 dark:text-red-400 mt-1",
  
  // Toggle switch
  toggleSwitchClass: "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black",
  toggleSwitch: (isOn: boolean, primaryColor: string, disabled: boolean): CSSProperties => ({
    backgroundColor: isOn ? `var(--color-${primaryColor})` : '#9ca3af',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }),
  toggleDot: (isOn: boolean): string => isOn ? "inline-block h-4 w-4 rounded-full bg-white transition-transform transform translate-x-5" : "inline-block h-4 w-4 rounded-full bg-white transition-transform transform translate-x-0.5",
  
  // Language selection
  languageSelectContainer: "relative",
  languageSelectClass: "flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer",
  languageSelect: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`,
    backgroundColor: darkMode ? 'transparent' : 'white',
  }),
  languageSelectArrow: "ml-2 flex-shrink-0",
  
  // Language dropdown options
  languageOptionClass: "px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0",
  languageOptionDisabled: "px-3 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed border-b border-gray-200 dark:border-gray-600 last:border-b-0",
  languageOption: (isSelected: boolean, primaryColor: string): CSSProperties => ({
    backgroundColor: isSelected ? `var(--color-${primaryColor})` : 'transparent',
    color: isSelected ? 'white' : 'inherit',
  }),
  
  // Footer
  footer: "mt-6 pt-4 border-t border-gray-200 dark:border-gray-700",
  footerText: "text-xs text-gray-500 dark:text-gray-400 text-center",
  
  // Animations
  overlayAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  mobilePanelAnimation: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
}; 