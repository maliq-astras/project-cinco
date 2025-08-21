/**
 * Hybrid styles for Logo component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from Logo.module.css
 * - Dynamic styles remain as functions for prop-based styling
 */

import { CSSProperties } from 'react';
import styles from './Logo.module.css';

export const logoStyles = {
  // Static styles from CSS modules
  logo: styles.logo,
  
  // Dynamic styles for width/height props
  image: (width?: number | string, height?: number | string): CSSProperties => ({
    width: width || 'auto',
    height: height || 'auto'
  })
} as const; 