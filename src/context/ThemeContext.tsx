'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { CategoryType, ThemeColors, categoryColorMap } from '../types';
import { useGameStore } from '../store/gameStore';

// Default theme (Countries - blue)
const defaultTheme: ThemeColors = categoryColorMap[CategoryType.COUNTRIES];

// Create the context
interface ThemeContextType {
  colors: ThemeColors;
  category: CategoryType | null;
  getColorFilter: (colorClass?: string) => string; // New function to get CSS filter
}

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme,
  category: null,
  getColorFilter: () => '' // Default empty filter
});

// Helper function to convert tailwind color class to RGB values
const getColorRGB = (colorClass: string): string => {
  // This is a simplified mapping of tailwind colors to RGB values
  const colorMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': '37, 99, 235',
    'blue-500': '59, 130, 246',
    'blue-700': '29, 78, 216',
    
    // Emerald (Animals)
    'emerald-600': '5, 150, 105',
    'emerald-500': '16, 185, 129',
    'emerald-700': '4, 120, 87',
    
    // Violet (Movies)
    'violet-600': '124, 58, 237',
    'violet-500': '139, 92, 246',
    'violet-700': '109, 40, 217',
    
    // Orange (Books)
    'orange-600': '234, 88, 12',
    'orange-500': '249, 115, 22',
    'orange-700': '194, 65, 12',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': '192, 38, 211',
    'fuchsia-500': '217, 70, 239',
    'fuchsia-700': '162, 28, 175',
    
    // Red (Athletes)
    'red-600': '220, 38, 38',
    'red-500': '239, 68, 68',
    'red-700': '185, 28, 28',
    
    // Amber (Historical Figures)
    'amber-500': '245, 158, 11',
    'amber-400': '251, 191, 36',
    'amber-600': '217, 119, 6',
    
    // Teal (Famous Brands)
    'teal-500': '20, 184, 166',
    'teal-400': '45, 212, 191',
    'teal-600': '13, 148, 136',
    
    // Indigo (TV Shows)
    'indigo-500': '99, 102, 241',
    'indigo-400': '129, 140, 248',
    'indigo-600': '79, 70, 229'
  };
  
  return colorMap[colorClass] || '37, 99, 235'; // Default to blue-600
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
  
  // Determine colors based on the challenge category
  const category = challenge?.category || CategoryType.COUNTRIES;
  const colors = categoryColorMap[category] || defaultTheme;
  
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
      root.style.setProperty('--primary-rgb', getColorRGB(colors.primary));
      root.style.setProperty('--secondary-rgb', getColorRGB(colors.secondary));
      root.style.setProperty('--accent-rgb', getColorRGB(colors.accent));
      
      // Set direct color variables for each color
      root.style.setProperty('--color-' + colors.primary, `rgb(${getColorRGB(colors.primary)})`);
      root.style.setProperty('--color-' + colors.secondary, `rgb(${getColorRGB(colors.secondary)})`);
      root.style.setProperty('--color-' + colors.accent, `rgb(${getColorRGB(colors.accent)})`);
      root.style.setProperty('--color-' + colors.light, `rgb(${getColorRGB(colors.light)})`);
      root.style.setProperty('--color-' + colors.dark, `rgb(${getColorRGB(colors.dark)})`);
    }
  }, [colors]);
  
  const value = {
    colors,
    category,
    getColorFilter
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 