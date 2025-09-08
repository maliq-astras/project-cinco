import { CSSProperties } from 'react';

// MobileGameContent-specific styling utilities
export const getContextLineBackground = (primaryColor: string): CSSProperties => ({
  backgroundColor: `var(--color-${primaryColor}30)`
});