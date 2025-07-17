/**
 * Extracted Tailwind classes for the FactCardBack component
 */

export const factCardBackStyles = {
  container: "w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 relative rounded-lg",
  
  // State-specific classes
  finalFive: "bg-gray-50 dark:bg-gray-800",
  revealed: "revealed-fact",
  inStack: "border border-white/40 dark:border-white/20",
};

/**
 * Helper function to get background style based on theme and state
 */
export function getCardBackgroundStyle(isFinalFive: boolean, primaryColor: string) {
  return {
    background: !isFinalFive ? `var(--color-${primaryColor})` : undefined
  };
} 