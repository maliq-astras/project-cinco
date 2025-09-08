import { CSSProperties } from 'react';

/**
 * Generate menu container style with primary color border
 */
export const getMenuContainerStyle = (primaryColor: string): CSSProperties => ({
  borderColor: `var(--color-${primaryColor})`
});

/**
 * Generate menu item style with primary color text
 */
export const getMenuItemStyle = (primaryColor: string): CSSProperties => ({
  color: `var(--color-${primaryColor})`
});