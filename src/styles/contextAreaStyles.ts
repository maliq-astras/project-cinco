/**
 * Styles for the ContextArea components
 */
import { CSSProperties } from 'react';

export const contextAreaStyles = {
  // Base text styling
  text: "font-medium text-center font-display",

  // Specific container variants
  bubble: "whitespace-nowrap",
  instructions: "whitespace-normal max-w-lg",

  // Animation constants
  animation: {
    duration: 0.8
  },

  // Loading animation styles
  loadingSpinner: (textColor: string): CSSProperties => ({
    border: `2px solid var(--color-${textColor})`,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginTop: '-2px'
  })
} as const;

/**
 * Utility function to get the base classnames for context text
 */
export function getContextTextClassNames(primaryColor: string, additionalClasses: string = "") {
  return `text-${primaryColor} ${contextAreaStyles.text} ${additionalClasses}`.trim();
} 