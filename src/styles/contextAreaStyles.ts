/**
 * Styles for the ContextArea components
 */
export const contextAreaStyles = {
  // Base text styling
  text: "font-medium text-center font-display",

  // Specific container variants
  bubble: "whitespace-nowrap",
  instructions: "whitespace-normal max-w-lg",

  // Animation constants
  animation: {
    duration: 0.8
  }
};

/**
 * Utility function to get the base classnames for context text
 */
export function getContextTextClassNames(primaryColor: string, additionalClasses: string = "") {
  return `text-${primaryColor} ${contextAreaStyles.text} ${additionalClasses}`.trim();
} 