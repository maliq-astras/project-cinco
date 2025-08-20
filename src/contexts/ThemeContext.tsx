'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CategoryType, ThemeColors, categoryColorMap, COLOR_MAPPING, CATEGORY_COLOR_MAPPING } from '../types';
import { useGameStore } from '../store/gameStore';
import { useThemeDOM } from '../hooks/useThemeDOM';

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

// Helper function to convert tailwind color class to HSL values
const getColorHSL = (colorClass: string): string => {
  // HSL mapping for tailwind colors
  const hslMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': '221.2 83.2% 53.3%',
    'blue-500': '217.2 91.2% 59.8%',
    'blue-700': '215.4 16.3% 46.9%',
    'blue-400': '213.9 93.3% 67.5%',
    
    // Emerald (Animals)
    'emerald-600': '160.1 84.1% 39.4%',
    'emerald-500': '158.1 64.4% 41.8%',
    'emerald-700': '161.4 93.9% 30.4%',
    'emerald-400': '158.9 64.4% 51.8%',
    
    // Violet (Movies)
    'violet-600': '262.1 83.3% 57.8%',
    'violet-500': '271.5 81.3% 55.9%',
    'violet-700': '263.4 70% 50.4%',
    'violet-400': '271.5 81.3% 65.9%',
    
    // Orange (Books)
    'orange-600': '24.6 95% 53.1%',
    'orange-500': '32.1 94.6% 43.7%',
    'orange-700': '24.6 95% 43.1%',
    'orange-400': '32.1 94.6% 53.7%',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': '291.7 70.7% 58.8%',
    'fuchsia-500': '292.2 84.1% 67.1%',
    'fuchsia-700': '291.1 93.2% 47.8%',
    'fuchsia-400': '292.2 84.1% 77.1%',
    
    // Red (Athletes)
    'red-600': '0 84.2% 60.2%',
    'red-500': '0 84.2% 70.2%',
    'red-700': '0 84.2% 50.2%',
    'red-400': '0 84.2% 80.2%',
    
    // Amber (Historical Figures)
    'amber-500': '43.4 96.4% 56.3%',
    'amber-400': '43.4 96.4% 66.3%',
    'amber-600': '43.4 96.4% 46.3%',
    'amber-300': '43.4 96.4% 76.3%',
    
    // Teal (Famous Brands)
    'teal-500': '173.4 58.3% 39.1%',
    'teal-400': '173.4 58.3% 49.1%',
    'teal-600': '173.4 58.3% 29.1%',
    'teal-300': '173.4 58.3% 59.1%',
    
    // Indigo (TV Shows)
    'indigo-500': '238.7 83.5% 66.7%',
    'indigo-400': '238.7 83.5% 76.7%',
    'indigo-600': '238.7 83.5% 56.7%',
    'indigo-300': '238.7 83.5% 86.7%'
  };

  return hslMap[colorClass] || '0 0% 50%'; // default to gray
};

// Helper function to convert tailwind color class to RGB values
const getColorRGB = (colorClass: string): string => {
  // If we're in high contrast mode, check if this color has a high contrast variable
  const { isBrowser, hasClass, getCSSProperty } = useThemeDOM();
  
  if (isBrowser && hasClass('high-contrast')) {
    const isDarkMode = hasClass('dark');
    const matches = colorClass.match(/([a-z]+)-(\d+)/);
    
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const colorWeight = matches[2];
      
      // Check for high contrast CSS variable
      const varName = `--hc-${colorFamily}-${colorWeight}`;
      const computed = getCSSProperty(varName);
      
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
    
    // Fuchsia (Musicians)
    'fuchsia-600': 'invert(26%) sepia(67%) saturate(6373%) hue-rotate(293deg) brightness(91%) contrast(96%)',
    
    // Red (Athletes)
    'red-600': 'invert(13%) sepia(90%) saturate(4235%) hue-rotate(356deg) brightness(95%) contrast(124%)',
    
    // Amber (History)
    'amber-500': 'invert(72%) sepia(32%) saturate(6908%) hue-rotate(8deg) brightness(103%) contrast(103%)',
    
    // Teal (Companies)
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
  
  // Use the theme DOM hook
  const { isBrowser, addClass, removeClass, setCSSProperty } = useThemeDOM();

  // Load saved preferences from localStorage on mount
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
    if (initialCategory && isBrowser) {
      const baseColors = categoryColorMap[initialCategory];
      const primaryRGB = getColorRGB(baseColors.primary);
      
      setCSSProperty('--primary-color', baseColors.primary);
      setCSSProperty('--color-' + baseColors.primary, `rgb(${primaryRGB})`);
      setCSSProperty('--color-' + baseColors.primary + '-rgb', primaryRGB);
    }
  }, [initialCategory, isBrowser, setCSSProperty]);
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev;
      
      // Immediately apply dark mode class for better reactivity
      if (isBrowser) {
        if (newValue) {
          addClass('dark');
        } else {
          removeClass('dark');
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
      if (isBrowser) {
        if (newValue) {
          addClass('high-contrast');
        } else {
          removeClass('high-contrast');
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
    if (!isBrowser) return;
    
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
    setCSSProperty('--primary-color', updatedColors.primary);
    setCSSProperty('--secondary-color', updatedColors.secondary);
    setCSSProperty('--accent-color', updatedColors.accent);
    
    // Set HSL variables for CSS usage
    const primaryHSL = getColorHSL(updatedColors.primary);
    const secondaryHSL = getColorHSL(updatedColors.secondary);
    const accentHSL = getColorHSL(updatedColors.accent);
    
    setCSSProperty('--primary', primaryHSL);
    setCSSProperty('--secondary', secondaryHSL);
    setCSSProperty('--accent', accentHSL);

    // Set RGB variants for rgba() usage
    const primaryRGB = getColorRGB(updatedColors.primary);
    const secondaryRGB = getColorRGB(updatedColors.secondary);
    const accentRGB = getColorRGB(updatedColors.accent);
    
    setCSSProperty('--primary-rgb', primaryRGB);
    setCSSProperty('--secondary-rgb', secondaryRGB);
    setCSSProperty('--accent-rgb', accentRGB);

    // For individual color/selector classes
    setCSSProperty(`--color-${updatedColors.primary}-rgb`, primaryRGB);
    setCSSProperty(`--color-${updatedColors.secondary}-rgb`, secondaryRGB);
    setCSSProperty(`--color-${updatedColors.accent}-rgb`, accentRGB);
    
    // Apply the colors
    setCSSProperty('--color-' + updatedColors.primary, `rgb(${primaryRGB})`);
    setCSSProperty('--color-' + updatedColors.secondary, `rgb(${secondaryRGB})`);
    setCSSProperty('--color-' + updatedColors.accent, `rgb(${accentRGB})`);
    setCSSProperty('--color-' + updatedColors.light, `rgb(${getColorRGB(updatedColors.light)})`);
    setCSSProperty('--color-' + updatedColors.dark, `rgb(${getColorRGB(updatedColors.dark)})`);
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
    if (isBrowser) {
      // Set dark/high contrast classes
      if (darkMode) {
        addClass('dark');
      } else {
        removeClass('dark');
      }
      
      if (highContrastMode) {
        addClass('high-contrast');
      } else {
        removeClass('high-contrast');
      }
      
      // Set primary color variables
      setCSSProperty('--primary-color', colors.primary);
      setCSSProperty('--secondary-color', colors.secondary);
      setCSSProperty('--accent-color', colors.accent);
      
      // Set HSL variables for CSS usage
      const primaryHSL = getColorHSL(colors.primary);
      const secondaryHSL = getColorHSL(colors.secondary);
      const accentHSL = getColorHSL(colors.accent);
      
      setCSSProperty('--primary', primaryHSL);
      setCSSProperty('--secondary', secondaryHSL);
      setCSSProperty('--accent', accentHSL);
      
      // Set RGB variants for rgba() usage
      const primaryRGB = getColorRGB(colors.primary);
      const secondaryRGB = getColorRGB(colors.secondary);
      const accentRGB = getColorRGB(colors.accent);
      
      setCSSProperty('--primary-rgb', primaryRGB);
      setCSSProperty('--secondary-rgb', secondaryRGB);
      setCSSProperty('--accent-rgb', accentRGB);

      // For individual color/selector classes
      setCSSProperty(`--color-${colors.primary}-rgb`, primaryRGB);
      setCSSProperty(`--color-${colors.secondary}-rgb`, secondaryRGB);
      setCSSProperty(`--color-${colors.accent}-rgb`, accentRGB);
      
      // Apply the colors
      setCSSProperty('--color-' + colors.primary, `rgb(${primaryRGB})`);
      setCSSProperty('--color-' + colors.secondary, `rgb(${secondaryRGB})`);
      setCSSProperty('--color-' + colors.accent, `rgb(${accentRGB})`);
      setCSSProperty('--color-' + colors.light, `rgb(${getColorRGB(colors.light)})`);
      setCSSProperty('--color-' + colors.dark, `rgb(${getColorRGB(colors.dark)})`);
      
      // Apply additional CSS variable for dark mode specific styling
      if (darkMode) {
        setCSSProperty('--dark-mode-bg', '0, 0, 0'); // Pure black
        setCSSProperty('--dark-mode-card-bg', '17, 17, 17'); // Very dark gray
      }
    }
  }, [colors, darkMode, highContrastMode, isBrowser, addClass, removeClass, setCSSProperty]);
  
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