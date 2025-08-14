export const autocompleteStyles = {
  // Position and layout
  getPosition: (inputRect: DOMRect, isSmallPhone: boolean, desktopWidth: number) => ({
    position: 'fixed' as const,
    left: isSmallPhone 
      ? 16 
      : inputRect.left - (desktopWidth - inputRect.width) / 2, // Center the wider box above the input
    bottom: window.innerHeight - inputRect.top + 6, // attach to the top of the textarea since it will translateY upwards
    width: isSmallPhone ? window.innerWidth - 32 : desktopWidth,
    zIndex: 58
  }),

  // Container styles
  container: "bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden",
  
  // Suggestion item styles
  suggestionButton: "w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 focus:outline-none text-gray-900 dark:text-gray-100",
  suggestionText: "block text-sm font-medium truncate",
  
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
