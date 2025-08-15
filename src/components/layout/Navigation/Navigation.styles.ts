import { CSSProperties } from 'react';

export const navigationStyles = {
  container: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  innerContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  navBar: "flex justify-between items-center h-8 sm:h-10 lg:h-12",
  
  // XS → XL Container variants
  containerXs: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  containerSm: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  containerMd: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  containerLg: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  containerXl: "w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800",
  
  // XS → XL Inner container variants
  innerContainerXs: "max-w-7xl mx-auto px-3",
  innerContainerSm: "max-w-7xl mx-auto px-3.5",
  innerContainerMd: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  innerContainerLg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  innerContainerXl: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // XS → XL Nav bar variants with VERTICAL breakpoints
  navBarXs: "flex justify-between items-center h-6",
  navBarSm: "flex justify-between items-center h-7",
  navBarMd: "flex justify-between items-center h-8",
  navBarLg: "flex justify-between items-center h-10",
  navBarXl: "flex justify-between items-center h-12",
  
  // Hard Mode Badge
  badgeContainer: "flex items-center",
  hardModeBadge: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`
  }),
  hardModeBadgeText: "py-1 px-2.5 rounded-md text-xs sm:text-sm font-medium text-white uppercase",
  compactHardModeBadgeText: "py-0.5 px-2 rounded-md text-xs font-medium text-white uppercase",
  
  // XS → XL Nav variants
  navXs: "flex items-center space-x-1.5",
  navSm: "flex items-center space-x-2",
  navMd: "flex items-center space-x-3",
  navLg: "flex items-center space-x-4",
  navXl: "flex items-center space-x-5",
  
  // Nav Items (legacy)
  nav: "flex items-center space-x-4",
  
  // Dropdown container for proper positioning
  dropdownContainer: "relative",
  
  // XS → XL Dropdown button variants (INCREASED)
  dropdownButtonXs: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.375rem", // Increased from 0.3125rem to match p-1.5
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonSm: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.375rem", // Increased from 0.3rem to match p-1.5
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonMd: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.4375rem", // Increased from 0.375rem to match p-1.75
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonLg: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.5rem", // Increased from 0.45rem to match p-2
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonXl: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.625rem", // Increased from 0.5rem to match p-2.5
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  
  // XS → XL Dropdown button class variants (INCREASED)
  dropdownButtonClassXs: (isOpen: boolean) => 
    `p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`, // Increased from p-1.25 to p-1.5
  dropdownButtonClassSm: (isOpen: boolean) => 
    `p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`, // Increased from p-1.25 to p-1.5
  dropdownButtonClassMd: (isOpen: boolean) => 
    `p-1.75 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`, // Increased from p-1.5 to p-1.75
  dropdownButtonClassLg: (isOpen: boolean) => 
    `p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`, // Increased from p-1.75 to p-2
  dropdownButtonClassXl: (isOpen: boolean) => 
    `p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`, // Increased from p-2 to p-2.5
  
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
  // XS → XL Nav icon class variants (INCREASED)
  navIconClassXs: "p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900", // Increased from p-1.25 to p-1.5
  navIconClassSm: "p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900", // Increased from p-1.25 to p-1.5
  navIconClassMd: "p-1.75 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900", // Increased from p-1.5 to p-1.75
  navIconClassLg: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900", // Increased from p-1.75 to p-2
  navIconClassXl: "p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900", // Increased from p-2 to p-2.5
  
  // XS → XL Icon size variants with VERTICAL breakpoints (INCREASED)
  iconSizeXs: "w-5 h-5", // Increased from w-4 h-4
  iconSizeSm: "w-5 h-5", // Increased from w-4 h-4
  iconSizeMd: "w-6 h-6", // Increased from w-5 h-5
  iconSizeLg: "w-7 h-7", // Increased from w-6 h-6
  iconSizeXl: "w-8 h-8", // Increased from w-7 h-7
  
  // Nav icon class (legacy)
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