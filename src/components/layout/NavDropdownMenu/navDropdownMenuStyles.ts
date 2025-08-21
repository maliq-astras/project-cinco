/**
 * Hybrid styles for NavDropdownMenu component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from NavDropdownMenu.module.css
 * - Dynamic styles remain as functions for theme integration
 */

import { CSSProperties } from 'react';
import styles from './NavDropdownMenu.module.css';

export const navDropdownMenuStyles = {
  // Static styles from CSS modules
  menuContainer: styles.menuContainer,
  menuItem: styles.menuItem,
  arrowIcon: styles.arrowIcon,
  
  // Dynamic styles for theme integration
  menuContainerStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`
  }),
  
  menuItemStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  
  // Text container to ensure proper spacing with arrow
  textContainer: {
    flex: '1',
    marginRight: '8px'
  },
  
  // Fixed-size container for arrows to ensure consistent sizing
  arrowContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20px',
    height: '20px',
    flexShrink: 0
  }
} as const; 