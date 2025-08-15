import { CSSProperties } from 'react';

export const navDropdownMenuStyles = {
  // Base dropdown menu styles, using responsive positioning for all screen sizes
  menuContainer: "absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-black border-2 z-50",
  
  // Menu container base style (border color will be set with primary color)
  menuContainerStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`
  }),
  
  // Menu item styles
  menuItem: "w-full text-left flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
  
  // Menu item container style (text color will be set with primary color)
  menuItemStyle: (primaryColor: string): CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: `var(--color-${primaryColor})`,
    width: '100%'
  }),
  
  // Text container to ensure proper spacing with arrow
  textContainer: {
    flex: '1',
    marginRight: '8px'
  },
  
  // Fixed-size container for arrows to ensure consistent sizing
  arrowContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20px',
    height: '20px',
    flexShrink: 0
  },
  
  // Arrow icon size
  arrowIcon: "w-4 h-4"
} as const; 