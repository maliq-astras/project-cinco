/**
 * Helper functions for Autocomplete component styling
 */

/**
 * Generate container style with theme-based border and effects
 */
export function getContainerStyle(primaryColor: string): React.CSSProperties {
  return {
    border: `2px solid var(--color-${primaryColor})`,
    backdropFilter: 'blur(8px)',
    boxShadow: `0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px var(--color-${primaryColor}20)`
  };
}

/**
 * Generate suggestion button style based on selection state and theme
 */
export function getSuggestionStyle(primaryColor: string, isSelected: boolean): React.CSSProperties {
  return {
    backgroundColor: isSelected 
      ? `var(--color-${primaryColor}30)` 
      : 'transparent',
    color: isSelected 
      ? `var(--color-${primaryColor})` 
      : undefined, 
    borderLeft: isSelected 
      ? `4px solid var(--color-${primaryColor})` 
      : '4px solid transparent',
    fontWeight: isSelected ? '700' : '500'
  };
}