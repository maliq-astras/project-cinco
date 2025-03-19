/**
 * Icon mapping utility for fact types across different categories
 */
import { useTheme } from '../context/ThemeContext';

// Define a type for icon mappings
type IconMapping = { [key: string]: string };

// Universal fallback icon for any category
const WILDCARD_ICON = 'wildcard';

// Icon mapping for countries category
const countryIcons: IconMapping = {
  'Official Language(s)': 'languages',
  'Flag Colors & Features': 'flag',
  'Notable City': 'cityscape',
  'Largest Industry': 'economy',
  'Population & Demographic Info': 'demographics',
  'Origin/Founding': 'history',
  'Geographic Features & Border Info': 'geography',
  'Wildcard': 'wildcard'
};

// Animal fact types icon mapping
const animalIcons: IconMapping = {
  'Habitat & Global Presence': 'habitat',
  'Diet & Ecological Role': 'ecological-role',
  'Physical Characteristic': 'characteristic',
  'Size/Weight': 'sizeweight',
  'Evolutionary History & Relationships': 'evolution',
  'Social Behavior': 'socialanimal',
  'Reproduction': 'reproduction',
  'Wildcard': 'wildcard'
};

// Add mappings for other categories as they are implemented
const movieIcons: IconMapping = {
  'Director': 'director',
  'Release Era': 'release-date',
  'Notable Character': 'character',
  'Genre': 'genre',
  'Critical Reception/Awards': 'awards',
  'Box Office Performance': 'boxoffice',
  'Production Studio': 'studio',
  'Wildcard': 'wildcard'
};

// Map category names to their icon mappings
const categoryIconMappings: { [key: string]: IconMapping } = {
  'countries': countryIcons,
  'animals': animalIcons,
  'movies': movieIcons,
  // Add more categories as you implement them
};

// Main lookup function that handles all categories
export function getIconForFactType(factType: string, category: string = 'countries'): string {
  // Normalize the category name to lowercase
  const normalizedCategory = category.toLowerCase();
  
  // Get the appropriate category map
  const categoryMap = categoryIconMappings[normalizedCategory] || countryIcons;
  
  // Look up the icon in the selected category or return wildcard
  return categoryMap[factType] || WILDCARD_ICON;
}

// Note: This function now needs to be used within a React component context
// since it uses the useTheme hook
export function useIconFilter() {
  const { getColorFilter } = useTheme();
  
  // Return a function that gets the filter for a specific category
  return (category: string = 'countries'): string => {
    // Map category to its primary color class
    const categoryColorMap: Record<string, string> = {
      'countries': 'blue-600',
      'animals': 'emerald-600',
      'movies': 'violet-600',
      'books': 'orange-600',
      'musical artists': 'fuchsia-600',
      'athletes': 'red-600',
      'historical figures': 'amber-500',
      'famous brands': 'teal-500',
      'tv shows': 'indigo-500',
    };
    
    // Normalize the category name
    const normalizedCategory = category.toLowerCase();
    
    // Get the color class for this category
    const colorClass = categoryColorMap[normalizedCategory] || 'blue-600';
    
    // Return the filter
    return getColorFilter(colorClass);
  };
}

// Combined function for getting fact icons - returns information needed to render the icon
export function getFactIcon(factType: string, isRevealed: boolean = false, size: number = 32, category: string = 'countries'): {
  iconName: string;
  isRevealed: boolean;
  size: number;
  category: string;
} {
  const iconName = getIconForFactType(factType, category);
  
  return {
    iconName,
    isRevealed,
    size,
    category
  };
} 