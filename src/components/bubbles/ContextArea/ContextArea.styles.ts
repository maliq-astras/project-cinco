/**
 * Styles for the ContextArea components
 */
import { CSSProperties } from 'react';

export const contextAreaStyles = {
  // Base text styling with responsive sizing
  text: "font-medium text-center font-display",

  // Specific container variants
  bubble: "whitespace-nowrap",
  instructions: "whitespace-normal max-w-lg",
  
  // Responsive text sizes for different screen sizes
  textSize: {
    xs: "text-xs", // Extra small for Galaxy S9+ (320px)
    sm: "text-sm", // Small for narrow devices (330-480px)
    md: "text-base", // Medium for regular mobile (480px+)
    lg: "text-lg", // Large for tablets and desktop
  },

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
 * Get responsive text size based on screen width
 */
export function getResponsiveTextSize(windowWidth: number): string {
  if (windowWidth <= 330) return contextAreaStyles.textSize.xs; // Galaxy S9+ and similar
  if (windowWidth <= 480) return contextAreaStyles.textSize.sm; // Small mobile
  if (windowWidth <= 768) return contextAreaStyles.textSize.md; // Regular mobile
  return contextAreaStyles.textSize.lg; // Tablet and desktop
}

/**
 * Utility function to get the base classnames for context text
 */
export function getContextTextClassNames(primaryColor: string, additionalClasses: string = "", windowWidth: number = 480) {
  const textSize = getResponsiveTextSize(windowWidth);
  return `text-${primaryColor} ${contextAreaStyles.text} ${textSize} ${additionalClasses}`.trim();
} 