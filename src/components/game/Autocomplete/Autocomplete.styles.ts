/**
 * Hybrid styles for Autocomplete component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from Autocomplete.module.css
 * - Dynamic positioning and theme styles use functions
 * - Animation styles remain as Framer Motion objects
 */

import styles from './Autocomplete.module.css';

export const autocompleteStyles = {
  // Static styles from CSS modules
  container: styles.container,
  suggestionButton: styles.suggestionButton,
  suggestionText: styles.suggestionText,
  
  // Dynamic positioning
  getPosition: (inputRect: DOMRect, isSmallPhone: boolean, desktopWidth: number) => ({
    position: 'fixed' as const,
    left: isSmallPhone 
      ? 16 
      : inputRect.left - (desktopWidth - inputRect.width) / 2, // Center the wider box above the input
    bottom: window.innerHeight - inputRect.top + 6, // attach to the top of the textarea since it will translateY upwards
    width: isSmallPhone ? window.innerWidth - 32 : desktopWidth,
    zIndex: 58
  }),
  
  // Dynamic styles
  getContainerStyle: (primaryColor: string, maxHeight: string = '240px') => ({
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight,
    overflowY: 'auto' as const,
    backdropFilter: 'blur(8px)',
    boxShadow: `0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px var(--color-${primaryColor}20)`
  }),
  
  getSuggestionStyle: (primaryColor: string, isSelected: boolean) => ({
    backgroundColor: isSelected 
      ? `var(--color-${primaryColor}30)` 
      : 'transparent',
    color: isSelected 
      ? `var(--color-${primaryColor})` 
      : undefined, // Let CSS classes handle default colors
    borderLeft: isSelected 
      ? `4px solid var(--color-${primaryColor})` 
      : '4px solid transparent',
    fontWeight: isSelected ? '700' : '500'
  }),
  
  // Animations
  containerAnimation: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: (suggestionsLength: number) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1,
      height: suggestionsLength * 48 + 16 // Animate height changes smoothly
    }),
    exit: { opacity: 0, y: 10, scale: 0.95 },
    transition: { 
      duration: 0.2, 
      ease: "easeOut",
      height: { duration: 0.3, ease: "easeInOut" } // Smooth height transitions
    }
  },
  
  suggestionAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }
} as const;
