/**
 * Icon mapping utility for fact types across different categories
 */
import { useTheme } from '../contexts/ThemeContext';

// Define a type for icon mappings
type IconMapping = { [key: string]: string };

// Universal fallback icon for any category
const WILDCARD_ICON = 'wildcard';

// Icon mapping for countries category
const countryIcons: IconMapping = {
  'Language(s)': 'languages',
  'Flag': 'flag',
  'Notable City': 'cityscape',
  'Political History': 'history',
  'Economy': 'economy',
  'Culture & Tradition': 'culture',
  'Geography & Border': 'geography',
  'Wildcard': 'wildcard'
};

// Animal fact types icon mapping
const animalIcons: IconMapping = {
  'Habitat': 'habitat',
  'Diet': 'ecological-role',
  'Physical Characteristic': 'characteristic',
  'Evolutionary History': 'evolution',
  'Social Behavior': 'socialanimal',
  'Reproduction': 'reproduction',
  'Interspecies Relationships': 'relationship',
  'Wildcard': 'wildcard'
};

// Famous brands fact types icon mapping
const famousBrandIcons: IconMapping = {
  'Industry': 'industry',
  'Origin': 'origin',
  'Logo': 'company-logo',
  'Signature Product': 'product',
  'Target Audience': 'target-audience',
  'Tagline/Catchphrase': 'slogan',
  'HQ Location': 'headquarters',
  'Wildcard': 'wildcard'
};

// Athletes fact types icon mapping
const athleteIcons: IconMapping = {
  'Personal Life': 'personal-life',
  'Affiliations': 'affiliations',
  'Era': 'time', 
  'Nationality': 'nationality',
  'Physique': 'physique',
  'Stats': 'stats',
  'Achievements': 'achievements',
  'Wildcard': 'wildcard'
};

// Historical figures fact types icon mapping
const historicalFigureIcons: IconMapping = {
  'Occupation': 'occupation',
  'Early Life': 'childhood',
  'Nationality': 'nationality-globe',
  'Legacy': 'legacy',
  'Physical Appearance': 'appearance',
  'Famous Quotes': 'quote',
  'Demise': 'demise',
  'Wildcard': 'wildcard'
};

// Musical artists fact types icon mapping
const musicalArtistIcons: IconMapping = {
  'Genre': 'music-genre',
  'Background': 'background-musician',
  'Iconic Song': 'iconic-song',
  'Debut': 'debut',
  'Achievements': 'grammy',
  'Collaborations': 'collab',
  'Chart Performance': 'charts',
  'Wildcard': 'wildcard'
};

// Add mappings for other categories as they are implemented
const movieIcons: IconMapping = {
  'Director': 'director',
  'Premiere': 'release-date',
  'Character(s)': 'character',
  'Genre': 'genre',
  'Critical Reception': 'awards',
  'Box Office': 'boxoffice',
  'Production': 'studio',
  'Wildcard': 'wildcard'
};

// Map category names to their icon mappings
const categoryIconMappings: { [key: string]: IconMapping } = {
  'countries': countryIcons,
  'animals': animalIcons,
  'movies': movieIcons,
  'famous brands': famousBrandIcons,
  'athletes': athleteIcons,
  'historical figures': historicalFigureIcons,
  'musical artists': musicalArtistIcons,
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