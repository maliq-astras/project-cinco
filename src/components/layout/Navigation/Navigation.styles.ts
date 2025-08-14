import { CSSProperties } from 'react';

export const navigationStyles = {
  container: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  compactContainer: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  innerContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  compactInnerContainer: "max-w-7xl mx-auto px-4",
  navBar: "flex justify-between items-center h-8 sm:h-10 lg:h-12",
  compactNavBar: "flex justify-between items-center h-6",
  
  // Hard Mode Badge
  badgeContainer: "flex items-center",
  hardModeBadge: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`
  }),
  hardModeBadgeText: "py-1 px-2.5 rounded-md text-xs sm:text-sm font-medium text-white uppercase",
  compactHardModeBadgeText: "py-0.5 px-2 rounded-md text-xs font-medium text-white uppercase",
  
  // Nav Items
  nav: "flex items-center space-x-4",
  compactNav: "flex items-center space-x-2",
  
  // Dropdown
  dropdownContainer: "relative",
  dropdownButton: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.375rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  compactDropdownButton: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.25rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonClass: (isOpen: boolean) => 
    `p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  compactDropdownButtonClass: (isOpen: boolean) => 
    `p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  
  dropdownMenu: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`
  }),
  dropdownMenuClass: "absolute right-0 sm:right-0 -left-24 sm:left-auto mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-black border-2 z-50",
  
  menuItem: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  menuItemClass: "w-full text-left flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
  menuItemArrow: "w-3 h-3 ml-2",
  
  // Nav Icons
  dropdownIcon: "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8",
  compactDropdownIcon: "w-5 h-5",
  navIcon: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  navIconClass: "p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900",
  compactNavIconClass: "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900",
  iconSize: "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8",
  compactIconSize: "w-5 h-5",

  // Header entrance animations
  headerAnimations: {
    // Navigation icons animation (similar to FactCard X button)
    navigationIcons: {
      initial: { opacity: 0, scale: 0.8, rotate: -90 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      transition: { duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }
    }
  }
} as const; 