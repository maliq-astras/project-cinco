'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { CategoryType, ThemeColors, categoryColorMap } from '../types';
import { useGameStore } from '../store/gameStore';

// Default theme (Countries - blue)
const defaultTheme: ThemeColors = categoryColorMap[CategoryType.COUNTRIES];

// Create the context
interface ThemeContextType {
  colors: ThemeColors; // Adjusted colors for current theme mode
  category: CategoryType | null;
  getColorFilter: (colorClass?: string) => string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  getAdjustedColorClass: (colorClass: string) => string;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme,
  category: null,
  getColorFilter: () => '',
  darkMode: false,
  toggleDarkMode: () => {},
  highContrastMode: false,
  toggleHighContrastMode: () => {},
  getAdjustedColorClass: (colorClass) => colorClass,
});

// Helper function to convert tailwind color class to RGB values
const getColorRGB = (colorClass: string): string => {
  // This is a simplified mapping of tailwind colors to RGB values
  const colorMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': '37, 99, 235',
    'blue-500': '59, 130, 246',
    'blue-700': '29, 78, 216',
    'blue-400': '96, 165, 250',
    
    // Emerald (Animals)
    'emerald-600': '5, 150, 105',
    'emerald-500': '16, 185, 129',
    'emerald-700': '4, 120, 87',
    'emerald-400': '52, 211, 153',
    
    // Violet (Movies)
    'violet-600': '124, 58, 237',
    'violet-500': '139, 92, 246',
    'violet-700': '109, 40, 217',
    'violet-400': '167, 139, 250',
    
    // Orange (Books)
    'orange-600': '234, 88, 12',
    'orange-500': '249, 115, 22',
    'orange-700': '194, 65, 12',
    'orange-400': '251, 146, 60',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': '192, 38, 211',
    'fuchsia-500': '217, 70, 239',
    'fuchsia-700': '162, 28, 175',
    'fuchsia-400': '232, 121, 249',
    
    // Red (Athletes)
    'red-600': '220, 38, 38',
    'red-500': '239, 68, 68',
    'red-700': '185, 28, 28',
    'red-400': '248, 113, 113',
    
    // Amber (Historical Figures)
    'amber-500': '245, 158, 11',
    'amber-400': '251, 191, 36',
    'amber-600': '217, 119, 6',
    'amber-300': '252, 211, 77',
    
    // Teal (Famous Brands)
    'teal-500': '20, 184, 166',
    'teal-400': '45, 212, 191',
    'teal-600': '13, 148, 136',
    'teal-300': '94, 234, 212',
    
    // Indigo (TV Shows)
    'indigo-500': '99, 102, 241',
    'indigo-400': '129, 140, 248',
    'indigo-600': '79, 70, 229',
    'indigo-300': '165, 180, 252'
  };

  // return a gray that works for both light and dark mode
  return colorMap[colorClass] || '128, 128, 128';
};

// Helper function to get CSS filter for a specific color
const getFilterForColor = (colorClass: string): string => {
  const filterMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': 'invert(40%) sepia(85%) saturate(1500%) hue-rotate(210deg) brightness(100%) contrast(95%)',
    
    // Emerald (Animals)
    'emerald-600': 'invert(39%) sepia(49%) saturate(1080%) hue-rotate(118deg) brightness(95%) contrast(101%)',
    
    // Violet (Movies)
    'violet-600': 'invert(33%) sepia(37%) saturate(3462%) hue-rotate(247deg) brightness(96%) contrast(93%)',
    
    // Orange (Books)
    'orange-600': 'invert(48%) sepia(82%) saturate(1523%) hue-rotate(360deg) brightness(103%) contrast(97%)',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': 'invert(26%) sepia(67%) saturate(6373%) hue-rotate(293deg) brightness(91%) contrast(96%)',
    
    // Red (Athletes)
    'red-600': 'invert(13%) sepia(90%) saturate(4235%) hue-rotate(356deg) brightness(95%) contrast(124%)',
    
    // Amber (Historical Figures)
    'amber-500': 'invert(72%) sepia(32%) saturate(6908%) hue-rotate(8deg) brightness(103%) contrast(103%)',
    
    // Teal (Famous Brands)
    'teal-500': 'invert(55%) sepia(53%) saturate(933%) hue-rotate(131deg) brightness(90%) contrast(101%)',
    
    // Indigo (TV Shows)
    'indigo-500': 'invert(36%) sepia(11%) saturate(6145%) hue-rotate(224deg) brightness(88%) contrast(91%)',
  };
  
  return filterMap[colorClass] || filterMap['blue-600']; // Default to blue filter
};

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get the current challenge category from the game store
  const challenge = useGameStore(state => state.gameState.challenge);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode preference is saved in localStorage
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode');
      return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    }
    return false;
  });
  
  // High contrast mode state
  const [highContrastMode, setHighContrastMode] = useState(() => {
    // Check if high contrast mode preference is saved in localStorage
    if (typeof window !== 'undefined') {
      const savedHighContrastMode = localStorage.getItem('highContrastMode');
      return savedHighContrastMode ? JSON.parse(savedHighContrastMode) : false;
    }
    return false;
  });
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', JSON.stringify(newValue));
      }
      return newValue;
    });
  };
  
  // Toggle high contrast mode function
  const toggleHighContrastMode = () => {
    setHighContrastMode((prev: boolean) => {
      const newValue = !prev;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('highContrastMode', JSON.stringify(newValue));
      }
      return newValue;
    });
  };
  
  // Determine colors based on the challenge category
  const category = challenge?.category || CategoryType.COUNTRIES;
  const baseColors = categoryColorMap[category] || defaultTheme;
  
  // Create theme-adjusted colors for better consistency across light/dark modes and high contrast
  const colors = {
    primary: 
      highContrastMode ? 
        (darkMode ? 'blue-300' : 'blue-900') : // Use high contrast colors
        (darkMode ? baseColors.primary.replace('600', '500').replace('700', '600') : baseColors.primary),
    secondary: 
      highContrastMode ? 
        (darkMode ? 'yellow-300' : 'purple-900') : // Use high contrast colors
        (darkMode ? baseColors.secondary.replace('600', '500').replace('700', '600') : baseColors.secondary),
    accent: 
      highContrastMode ? 
        (darkMode ? 'green-300' : 'red-900') : // Use high contrast colors
        (darkMode ? baseColors.accent.replace('600', '500').replace('700', '600') : baseColors.accent),
    light: highContrastMode ? 'white' : baseColors.light,
    dark: highContrastMode ? 'black' : baseColors.dark
  };
  
  // Helper function to adjust any color class for current theme mode
  const getAdjustedColorClass = (colorClass: string): string => {
    if (highContrastMode) {
      // Apply high contrast transformations to color classes
      if (darkMode) {
        return colorClass.replace(/blue-\d+/, 'blue-300')
                       .replace(/emerald-\d+/, 'green-300')
                       .replace(/violet-\d+/, 'purple-300')
                       .replace(/orange-\d+/, 'yellow-300')
                       .replace(/fuchsia-\d+/, 'pink-300')
                       .replace(/red-\d+/, 'red-300')
                       .replace(/amber-\d+/, 'yellow-300')
                       .replace(/teal-\d+/, 'cyan-300')
                       .replace(/indigo-\d+/, 'blue-300');
      } else {
        return colorClass.replace(/blue-\d+/, 'blue-900')
                       .replace(/emerald-\d+/, 'green-900')
                       .replace(/violet-\d+/, 'purple-900')
                       .replace(/orange-\d+/, 'yellow-900')
                       .replace(/fuchsia-\d+/, 'pink-900')
                       .replace(/red-\d+/, 'red-900')
                       .replace(/amber-\d+/, 'amber-900')
                       .replace(/teal-\d+/, 'cyan-900')
                       .replace(/indigo-\d+/, 'blue-900');
      }
    }
    
    if (!darkMode) return colorClass;
    return colorClass.replace('600', '500').replace('700', '600').replace('800', '700');
  };
  
  // Create a getColorFilter function that uses the current theme's primary color by default
  const getColorFilter = (colorClass?: string): string => {
    return getFilterForColor(colorClass || colors.primary);
  };
  
  // Update CSS variables when colors change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Set primary color variables
      root.style.setProperty('--primary-color', colors.primary);
      root.style.setProperty('--secondary-color', colors.secondary);
      root.style.setProperty('--accent-color', colors.accent);
      
      // Set RGB variants for rgba() usage
      const primaryRGB = getColorRGB(colors.primary);
      const secondaryRGB = getColorRGB(colors.secondary);
      const accentRGB = getColorRGB(colors.accent);
      
      root.style.setProperty('--primary-rgb', primaryRGB);
      root.style.setProperty('--secondary-rgb', secondaryRGB);
      root.style.setProperty('--accent-rgb', accentRGB);

      // For individual color/selector classes
      root.style.setProperty(`--color-${colors.primary}-rgb`, primaryRGB);
      root.style.setProperty(`--color-${colors.secondary}-rgb`, secondaryRGB);
      root.style.setProperty(`--color-${colors.accent}-rgb`, accentRGB);
      
      // Apply the colors
      root.style.setProperty('--color-' + colors.primary, `rgb(${primaryRGB})`);
      root.style.setProperty('--color-' + colors.secondary, `rgb(${secondaryRGB})`);
      root.style.setProperty('--color-' + colors.accent, `rgb(${accentRGB})`);
      root.style.setProperty('--color-' + colors.light, `rgb(${getColorRGB(colors.light)})`);
      root.style.setProperty('--color-' + colors.dark, `rgb(${getColorRGB(colors.dark)})`);
      
      // Apply additional CSS variable for dark mode specific styling
      if (darkMode) {
        root.style.setProperty('--dark-mode-bg', '0, 0, 0'); // Pure black
        root.style.setProperty('--dark-mode-card-bg', '17, 17, 17'); // Very dark gray
      }
    }
  }, [colors, darkMode]);
  
  // Apply the dark mode class to html element when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Apply high contrast class to html element when highContrastMode changes
  useEffect(() => {
    if (highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrastMode]);
  
  const value = {
    colors,
    category,
    getColorFilter,
    darkMode,
    toggleDarkMode,
    highContrastMode,
    toggleHighContrastMode,
    getAdjustedColorClass
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 