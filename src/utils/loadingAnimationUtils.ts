import { CategoryType } from '../types';
import { COLOR_MAPPING } from '../types';

// Sample categories to cycle through
export const SAMPLE_CATEGORIES = [
  'COUNTRIES',
  'MOVIES',
  'ANIMALS',
  'BOOKS',
  'ATHLETES',
  'MUSICAL ARTISTS',
  'HISTORICAL FIGURES',
  'TV SHOWS',
  'FAMOUS BRANDS'
];

// Map category names to CategoryType enum values
export const categoryNameToType: Record<string, CategoryType> = {
  'COUNTRIES': CategoryType.COUNTRIES,
  'MOVIES': CategoryType.MOVIES,
  'ANIMALS': CategoryType.ANIMALS,
  'BOOKS': CategoryType.BOOKS,
  'ATHLETES': CategoryType.ATHLETES,
  'MUSICAL ARTISTS': CategoryType.MUSICAL_ARTISTS,
  'HISTORICAL FIGURES': CategoryType.HISTORICAL_FIGURES,
  'TV SHOWS': CategoryType.TV_SHOWS,
  'FAMOUS BRANDS': CategoryType.FAMOUS_BRANDS
};

// Fisher-Yates shuffle algorithm to randomize array
export const shuffleArray = (array: string[]): string[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to convert tailwind color class to RGB values
export const getColorRGB = (colorClass: string): string => {
  // Check if high contrast mode is active
  if (typeof window !== 'undefined' && document.documentElement.classList.contains('high-contrast')) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const matches = colorClass.match(/([a-z]+)-(\d+)/);
    
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const colorShade = matches[2];
      
      // Map using the unified color mapping system
      const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
      
      // Determine high contrast shade based on dark mode
      const hcShade = isDarkMode ? 
        (parseInt(colorShade) >= 600 ? '300' : 
         parseInt(colorShade) >= 500 ? '300' :
         parseInt(colorShade) >= 400 ? '400' : '300') : 
        (parseInt(colorShade) >= 700 ? '950' : 
         parseInt(colorShade) >= 600 ? '900' :
         parseInt(colorShade) >= 500 ? '800' : '900');
      
      // Try to get color from CSS variable
      const varName = `--hc-${highContrastFamily}-${hcShade}`;
      const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      
      if (computed) {
        return computed;
      }
    }
  }
  
  // This is a simplified mapping of tailwind colors to RGB values
  const colorMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': '37, 99, 235',
    'blue-500': '59, 130, 246',
    'blue-400': '96, 165, 250',
    'blue-700': '29, 78, 216',
    
    // Emerald (Animals)
    'emerald-600': '5, 150, 105',
    'emerald-500': '16, 185, 129',
    'emerald-400': '52, 211, 153',
    'emerald-700': '4, 120, 87',
    
    // Violet (Movies)
    'violet-600': '124, 58, 237',
    'violet-500': '139, 92, 246',
    'violet-400': '167, 139, 250',
    'violet-700': '109, 40, 217',
    
    // Orange (Books)
    'orange-600': '234, 88, 12',
    'orange-500': '249, 115, 22',
    'orange-400': '251, 146, 60',
    'orange-700': '194, 65, 12',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': '192, 38, 211',
    'fuchsia-500': '217, 70, 239',
    'fuchsia-400': '232, 121, 249',
    'fuchsia-700': '162, 28, 175',
    
    // Red (Athletes)
    'red-600': '220, 38, 38',
    'red-500': '239, 68, 68',
    'red-400': '248, 113, 113',
    'red-700': '185, 28, 28',
    
    // Amber (Historical Figures)
    'amber-600': '217, 119, 6',
    'amber-500': '245, 158, 11',
    'amber-400': '251, 191, 36',
    'amber-300': '252, 211, 77',
    
    // Teal (Famous Brands)
    'teal-600': '13, 148, 136',
    'teal-500': '20, 184, 166',
    'teal-400': '45, 212, 191',
    'teal-300': '94, 234, 212',
    
    // Indigo (TV Shows)
    'indigo-600': '79, 70, 229',
    'indigo-500': '99, 102, 241',
    'indigo-400': '129, 140, 248',
    'indigo-300': '165, 180, 252'
  };
  
  // If the color isn't directly in the map, try to derive it
  if (!colorMap[colorClass]) {
    const [colorName, shade] = colorClass.split('-');
    // Try different shades if the exact one isn't available
    const alternativeShades = ['600', '500', '400', '700'];
    for (const altShade of alternativeShades) {
      const alternative = `${colorName}-${altShade}`;
      if (colorMap[alternative]) {
        return colorMap[alternative];
      }
    }
  }
  
  return colorMap[colorClass] || '59, 130, 246'; // Default to blue-500
}; 