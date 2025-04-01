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

/**
 * Handle showing/hiding the toast notification for wrong guesses
 * @param skipped Whether the guess was skipped
 */
export function handleToastNotification(skipped: boolean): void {
  if (skipped) return;
  
  const toast = document.getElementById('wrong-guess-toast');
  if (toast) {
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        toast.classList.remove('animate-fadeIn', 'animate-fadeOut');
        toast.classList.add('hidden');
      }, 300);
    }, 2000);
  }
} 