/**
 * Hybrid styles for Navigation component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from Navigation.module.css
 * - Dynamic styles remain as functions for theme integration
 */

import { CSSProperties } from 'react';
import styles from './Navigation.module.css';

export const navigationStyles = {
  // Static styles from CSS modules
  container: styles.container,
  innerContainer: styles.innerContainer,
  navBar: styles.navBar,
  
  // Container size variants
  containerXs: styles.containerXs,
  containerSm: styles.containerSm,
  containerMd: styles.containerMd,
  containerLg: styles.containerLg,
  containerXl: styles.containerXl,
  
  // Inner container size variants
  innerContainerXs: styles.innerContainerXs,
  innerContainerSm: styles.innerContainerSm,
  innerContainerMd: styles.innerContainerMd,
  innerContainerLg: styles.innerContainerLg,
  innerContainerXl: styles.innerContainerXl,
  
  // Nav bar size variants
  navBarXs: styles.navBarXs,
  navBarSm: styles.navBarSm,
  navBarMd: styles.navBarMd,
  navBarLg: styles.navBarLg,
  navBarXl: styles.navBarXl,
  
  // Hard Mode Badge
  badgeContainer: styles.badgeContainer,
  hardModeBadgeText: styles.hardModeBadgeText,
  compactHardModeBadgeText: styles.compactHardModeBadgeText,
  
  // Nav variants
  navXs: styles.navXs,
  navSm: styles.navSm,
  navMd: styles.navMd,
  navLg: styles.navLg,
  navXl: styles.navXl,
  
  // Legacy nav
  nav: styles.nav,
  
  // Dropdown container
  dropdownContainer: styles.dropdownContainer,
  
  // Dynamic styles for theme integration
  hardModeBadge: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`
  }),
  
  // Dynamic dropdown button styles
  dropdownButtonXs: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.375rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonSm: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.375rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonMd: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.4375rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonLg: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.5rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  dropdownButtonXl: (isOpen: boolean, primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    padding: "0.625rem",
    borderRadius: "9999px",
    backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
  }),
  
  // Dropdown button class functions (for className)
  dropdownButtonClassXs: (isOpen: boolean) => 
    `p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  dropdownButtonClassSm: (isOpen: boolean) => 
    `p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  dropdownButtonClassMd: (isOpen: boolean) => 
    `p-1.75 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  dropdownButtonClassLg: (isOpen: boolean) => 
    `p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  dropdownButtonClassXl: (isOpen: boolean) => 
    `p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`,
  
  // Static dropdown styles from CSS modules
  dropdownMenuClass: styles.dropdownMenuClass,
  menuItemClass: styles.menuItemClass,
  menuItemArrow: styles.menuItemArrow,
  
  // Dynamic dropdown styles
  dropdownMenu: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`
  }),
  
  menuItem: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // Static nav icon styles from CSS modules
  dropdownIcon: styles.dropdownIcon,
  compactDropdownIcon: styles.compactDropdownIcon,
  
  // Nav icon class variants
  navIconClassXs: styles.navIconClassXs,
  navIconClassSm: styles.navIconClassSm,
  navIconClassMd: styles.navIconClassMd,
  navIconClassLg: styles.navIconClassLg,
  navIconClassXl: styles.navIconClassXl,
  
  // Icon size variants
  iconSizeXs: styles.iconSizeXs,
  iconSizeSm: styles.iconSizeSm,
  iconSizeMd: styles.iconSizeMd,
  iconSizeLg: styles.iconSizeLg,
  iconSizeXl: styles.iconSizeXl,
  
  // Legacy nav icon styles
  navIconClass: styles.navIconClass,
  compactNavIconClass: styles.compactNavIconClass,
  
  // Dynamic nav icon styles
  navIcon: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),

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