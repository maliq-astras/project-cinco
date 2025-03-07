/**
 * Icon mapping utility for fact types across different categories
 */

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

// Helper function to get the appropriate filter for each icon type
export function getIconFilter(iconName: string): string {
  // Different blue gradient filters for different icons - always use gradients
  switch(iconName) {
    case 'languages':
      return 'brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(1800%) hue-rotate(230deg) brightness(95%) contrast(95%)';
    case 'flag':
      return 'brightness(0) saturate(100%) invert(40%) sepia(85%) saturate(1500%) hue-rotate(210deg) brightness(100%) contrast(95%)';
    case 'cityscape':
      return 'brightness(0) saturate(100%) invert(50%) sepia(90%) saturate(1200%) hue-rotate(200deg) brightness(100%) contrast(95%)';
    case 'economy':
      return 'brightness(0) saturate(100%) invert(45%) sepia(95%) saturate(1600%) hue-rotate(195deg) brightness(100%) contrast(95%)';
    case 'demographics':
      return 'brightness(0) saturate(100%) invert(35%) sepia(70%) saturate(2000%) hue-rotate(220deg) brightness(95%) contrast(100%)';
    case 'history':
      return 'brightness(0) saturate(100%) invert(30%) sepia(75%) saturate(1900%) hue-rotate(215deg) brightness(90%) contrast(95%)';
    case 'geography':
      return 'brightness(0) saturate(100%) invert(45%) sepia(85%) saturate(1400%) hue-rotate(190deg) brightness(100%) contrast(95%)';
    default: // wildcard
      return 'brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(1700%) hue-rotate(205deg) brightness(95%) contrast(95%)';
  }
}

// Combined function for getting fact icons - returns information needed to render the icon
export function getFactIcon(factType: string, isRevealed: boolean = false, size: number = 32, category: string = 'countries'): {
  iconName: string;
  filter: string;
  isRevealed: boolean;
  size: number;
} {
  const iconName = getIconForFactType(factType, category);
  const filter = getIconFilter(iconName);
  
  return {
    iconName,
    filter,
    isRevealed,
    size
  };
} 