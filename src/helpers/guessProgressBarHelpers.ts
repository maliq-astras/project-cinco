/**
 * Helper functions for the GuessProgressBar component
 */

import { CSSProperties } from 'react';

/**
 * Generate gradient background style based on theme colors
 */
export function getGradientBackground(primaryColor: string, secondaryColor: string): CSSProperties {
  return {
    background: `linear-gradient(to right, var(--color-${primaryColor}), var(--color-${secondaryColor}))`
  };
}

/**
 * Generate bottom shadow style based on theme
 */
export function getBottomShadowStyle(darkColor: string): CSSProperties {
  return {
    backgroundColor: `var(--color-${darkColor})`
  };
} 