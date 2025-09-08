import { CSSProperties } from 'react';

// Navigation-specific styling utilities
export const getDropdownButtonStyle = (
  isOpen: boolean,
  primaryColor: string,
  padding: string
): CSSProperties => ({
  color: `var(--color-${primaryColor})`,
  padding,
  borderRadius: "9999px",
  backgroundColor: isOpen ? 'var(--color-gray-100)' : 'transparent'
});

export const getDropdownButtonClass = (isOpen: boolean): string => 
  `rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`;

export const getNavIconStyle = (primaryColor: string): CSSProperties => ({
  color: `var(--color-${primaryColor})`
});

export const getDropdownMenuStyle = (primaryColor: string): CSSProperties => ({
  borderColor: `var(--color-${primaryColor})`
});

export const getMenuItemStyle = (primaryColor: string): CSSProperties => ({
  color: `var(--color-${primaryColor})`
});