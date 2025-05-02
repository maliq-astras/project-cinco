'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { CategoryType, ThemeColors, categoryColorMap, COLOR_MAPPING, CATEGORY_COLOR_MAPPING } from '../types';
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
  // If we're in high contrast mode, check if this color has a high contrast variable
  if (typeof window !== 'undefined' && document.documentElement.classList.contains('high-contrast')) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const matches = colorClass.match(/([a-z]+)-(\d+)/);
    
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const colorWeight = matches[2];
      
      // Check for high contrast CSS variable
      const varName = `--hc-${colorFamily}-${colorWeight}`;
      const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      
      if (computed) {
        return computed; // Return the RGB value from the CSS variable
      }
    }
  }
  
  // Fall back to the color map if no CSS variable exists
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
  

  return filterMap[colorClass] || filterMap['gray-500']; // default to gray
};

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider: React.FC<{ 
  children: ReactNode, 
  initialCategory?: CategoryType 
}> = ({ 
  children,
  initialCategory
}) => {
  // Get the current challenge category from the game store or use initialCategory if provided
  const challengeFromStore = useGameStore(state => state.gameState.challenge);
  const challenge = initialCategory ? { category: initialCategory } : challengeFromStore;
  
  // Server-side safe dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  
  // Only load preferences from localStorage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode));
      }
      
      const savedHighContrastMode = localStorage.getItem('highContrastMode');
      if (savedHighContrastMode) {
        setHighContrastMode(JSON.parse(savedHighContrastMode));
      }
    }
  }, []);
  
  // SSR safe - immediately set the fixed category when one is provided
  // This prevents flashing on initial render in special cases like the support page
  useEffect(() => {
    if (initialCategory && typeof window !== 'undefined') {
      const baseColors = categoryColorMap[initialCategory];
      const root = document.documentElement;
      const primaryRGB = getColorRGB(baseColors.primary);
      
      root.style.setProperty('--primary-color', baseColors.primary);
      root.style.setProperty('--color-' + baseColors.primary, `rgb(${primaryRGB})`);
      root.style.setProperty('--color-' + baseColors.primary + '-rgb', primaryRGB);
    }
  }, [initialCategory]);
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev;
      
      // Immediately apply dark mode class for better reactivity
      if (typeof document !== 'undefined') {
        if (newValue) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Immediately update CSS variables
        updateCssVariables(highContrastMode, newValue, challenge?.category || CategoryType.COUNTRIES);
      }
      
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
      
      // Immediately apply the high contrast class for better reactivity
      if (typeof document !== 'undefined') {
        if (newValue) {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
        
        // Immediately update CSS variables to avoid the gray flash
        updateCssVariables(newValue, darkMode, challenge?.category || CategoryType.COUNTRIES);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('highContrastMode', JSON.stringify(newValue));
      }
      
      return newValue;
    });
  };
  
  // Helper function to immediately update CSS variables
  const updateCssVariables = (isHighContrast: boolean, isDarkMode: boolean, categoryType: CategoryType) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const baseColors = categoryColorMap[categoryType] || defaultTheme;
    
    // Determine colors based on mode
    const updatedColors = {
      primary: 
        isHighContrast ? 
          (isDarkMode ? getHighContrastColor(categoryType, true) : getHighContrastColor(categoryType, false)) : 
          (isDarkMode ? baseColors.primary.replace('600', '500').replace('700', '600') : baseColors.primary),
      secondary: 
        isHighContrast ? 
          (isDarkMode ? getHighContrastSecondaryColor(categoryType, true) : getHighContrastSecondaryColor(categoryType, false)) : 
          (isDarkMode ? baseColors.secondary.replace('600', '500').replace('700', '600') : baseColors.secondary),
      accent: 
        isHighContrast ? 
          (isDarkMode ? getHighContrastAccentColor(categoryType, true) : getHighContrastAccentColor(categoryType, false)) : 
          (isDarkMode ? baseColors.accent.replace('600', '500').replace('700', '600') : baseColors.accent),
      light: isHighContrast ? 'white' : baseColors.light,
      dark: isHighContrast ? 'black' : baseColors.dark
    };
    
    // Set primary color variables
    root.style.setProperty('--primary-color', updatedColors.primary);
    root.style.setProperty('--secondary-color', updatedColors.secondary);
    root.style.setProperty('--accent-color', updatedColors.accent);
    
    // Set RGB variants for rgba() usage
    const primaryRGB = getColorRGB(updatedColors.primary);
    const secondaryRGB = getColorRGB(updatedColors.secondary);
    const accentRGB = getColorRGB(updatedColors.accent);
    
    root.style.setProperty('--primary-rgb', primaryRGB);
    root.style.setProperty('--secondary-rgb', secondaryRGB);
    root.style.setProperty('--accent-rgb', accentRGB);

    // For individual color/selector classes
    root.style.setProperty(`--color-${updatedColors.primary}-rgb`, primaryRGB);
    root.style.setProperty(`--color-${updatedColors.secondary}-rgb`, secondaryRGB);
    root.style.setProperty(`--color-${updatedColors.accent}-rgb`, accentRGB);
    
    // Apply the colors
    root.style.setProperty('--color-' + updatedColors.primary, `rgb(${primaryRGB})`);
    root.style.setProperty('--color-' + updatedColors.secondary, `rgb(${secondaryRGB})`);
    root.style.setProperty('--color-' + updatedColors.accent, `rgb(${accentRGB})`);
    root.style.setProperty('--color-' + updatedColors.light, `rgb(${getColorRGB(updatedColors.light)})`);
    root.style.setProperty('--color-' + updatedColors.dark, `rgb(${getColorRGB(updatedColors.dark)})`);
  };
  
  // Determine colors based on the challenge category
  const category = challenge?.category || CategoryType.COUNTRIES;
  const baseColors = categoryColorMap[category] || defaultTheme;
  
  // Create theme-adjusted colors for better consistency across light/dark modes and high contrast
  const colors = {
    primary: 
      highContrastMode ? 
        (darkMode ? getHighContrastColor(category, true) : getHighContrastColor(category, false)) : 
        (darkMode ? baseColors.primary.replace('600', '500').replace('700', '600') : baseColors.primary),
    secondary: 
      highContrastMode ? 
        (darkMode ? getHighContrastSecondaryColor(category, true) : getHighContrastSecondaryColor(category, false)) : 
        (darkMode ? baseColors.secondary.replace('600', '500').replace('700', '600') : baseColors.secondary),
    accent: 
      highContrastMode ? 
        (darkMode ? getHighContrastAccentColor(category, true) : getHighContrastAccentColor(category, false)) : 
        (darkMode ? baseColors.accent.replace('600', '500').replace('700', '600') : baseColors.accent),
    light: highContrastMode ? 'white' : baseColors.light,
    dark: highContrastMode ? 'black' : baseColors.dark
  };
  
  // Helper function to adjust any color class for current theme mode
  const getAdjustedColorClass = (colorClass: string): string => {
    if (highContrastMode) {
      // Extract color family and apply high contrast
      const matches = colorClass.match(/([a-z]+)-(\d+)/);
      if (matches && matches[1] && matches[2]) {
        const colorFamily = matches[1];
        const shade = matches[2];
        
        // Map Tailwind color name to high contrast name using our unified mapping
        const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
        
        if (darkMode) {
          // For dark mode, use lighter shades (300 range)
          const highContrastShade = 
            parseInt(shade) >= 600 ? '300' :  // For 600+, use 300
            parseInt(shade) >= 500 ? '300' :  // For 500+, use 300
            parseInt(shade) >= 400 ? '400' :  // For 400+, use 400
            '300';                            // Default to 300
            
          return `${highContrastFamily}-${highContrastShade}`;
        } else {
          // For light mode, use darker shades (900 range)
          const highContrastShade = 
            parseInt(shade) >= 700 ? '950' :  // For 700+, use 950
            parseInt(shade) >= 600 ? '900' :  // For 600+, use 900
            parseInt(shade) >= 500 ? '800' :  // For 500+, use 800
            '900';                            // Default to 900
            
          return `${highContrastFamily}-${highContrastShade}`;
        }
      }
    }
    
    if (!darkMode) return colorClass;
    return colorClass.replace('600', '500').replace('700', '600').replace('800', '700');
  };
  
  // Functions to get high contrast colors based on category
  function getHighContrastColor(category: CategoryType, isDarkMode: boolean): string {
    const colorMapping = CATEGORY_COLOR_MAPPING[category] || CATEGORY_COLOR_MAPPING[CategoryType.COUNTRIES];
    const highContrastFamily = colorMapping.highContrast;
    const shade = isDarkMode ? '300' : '900';
    return `${highContrastFamily}-${shade}`;
  }

  function getHighContrastSecondaryColor(category: CategoryType, isDarkMode: boolean): string {
    const colorMapping = CATEGORY_COLOR_MAPPING[category] || CATEGORY_COLOR_MAPPING[CategoryType.COUNTRIES];
    const highContrastFamily = colorMapping.highContrast;
    const shade = isDarkMode ? '200' : '800';
    return `${highContrastFamily}-${shade}`;
  }

  function getHighContrastAccentColor(category: CategoryType, isDarkMode: boolean): string {
    const colorMapping = CATEGORY_COLOR_MAPPING[category] || CATEGORY_COLOR_MAPPING[CategoryType.COUNTRIES];
    const highContrastFamily = colorMapping.highContrast;
    const shade = isDarkMode ? '400' : '950';
    return `${highContrastFamily}-${shade}`;
  }
  
  // Create a getColorFilter function that uses the current theme's primary color by default
  const getColorFilter = (colorClass?: string): string => {
    return getFilterForColor(colorClass || colors.primary);
  };
  
  // Update CSS variables when colors change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Set dark/high contrast classes
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      if (highContrastMode) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
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
  }, [colors, darkMode, highContrastMode]);
  
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