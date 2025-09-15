import { CategoryType } from '@/types';

// Language type
export type Language = 'en' | 'es';

// Dynamic import cache to avoid repeated imports
interface AutocompleteData {
  suggestions: string[];
  data: Record<string, string[]>;
}

const importCache = new Map<string, Promise<AutocompleteData>>();

/**
 * Dynamically import autocomplete data for a specific category and language
 */
async function importAutocompleteData(category: CategoryType, language: Language) {
  const cacheKey = `${category}-${language}`;
  
  if (importCache.has(cacheKey)) {
    return importCache.get(cacheKey);
  }

  const categoryName = category.toLowerCase().replace('_', '-');
  
  const importPromise = Promise.all([
    import(`@/data/autocomplete/${categoryName}/suggestions/${language}.js`),
    import(`@/data/autocomplete/${categoryName}/normalization/${language}.js`)
  ]).then(([suggestionsModule, normalizationModule]) => ({
    suggestions: suggestionsModule[`${categoryName.replace('-', '')}Suggestions`] || suggestionsModule.default,
    data: normalizationModule[`${categoryName.replace('-', '')}Normalization`] || normalizationModule.default
  }));

  importCache.set(cacheKey, importPromise);
  return importPromise;
}

/**
 * Get autocomplete suggestions for a specific category and query
 * @param category - The current challenge category
 * @param query - The user's input query
 * @param maxSuggestions - Maximum number of suggestions to return (default: 5)
 * @param previousGuesses - Array of previous guesses to exclude from suggestions
 * @param language - Language for suggestions (default: 'en')
 * @returns Array of matching suggestions
 */
export async function getAutocompleteSuggestions(
  category: CategoryType,
  query: string,
  maxSuggestions: number = 5,
  previousGuesses: string[] = [],
  language: Language = 'en'
): Promise<string[]> {
  try {
    const { suggestions } = await importAutocompleteData(category, language);
    
    // Normalize the query for case-insensitive matching
    const normalizedQuery = query.toLowerCase().trim();
    
    // Return empty array if query is too short
    if (normalizedQuery.length < 2) {
      return [];
    }
    
    // Normalize previous guesses for comparison
    const normalizedPreviousGuesses = previousGuesses.map(guess => 
      guess.toLowerCase().trim()
    );
    
    // Filter suggestions based on query and exclude previous guesses
    const filteredSuggestions = suggestions.filter((suggestion: string) => {
      const normalizedSuggestion = suggestion.toLowerCase().trim();
      
      // Check if already guessed
      if (normalizedPreviousGuesses.includes(normalizedSuggestion)) {
        return false;
      }
      
      // Check if suggestion contains the query
      return normalizedSuggestion.includes(normalizedQuery);
    });
    
    // Sort by relevance (exact matches first, then starts with, then contains)
    const sortedSuggestions = filteredSuggestions.sort((a: string, b: string) => {
      const aNorm = a.toLowerCase();
      const bNorm = b.toLowerCase();
      
      // Exact match (case insensitive)
      if (aNorm === normalizedQuery && bNorm !== normalizedQuery) return -1;
      if (bNorm === normalizedQuery && aNorm !== normalizedQuery) return 1;
      
      // Starts with query
      const aStartsWith = aNorm.startsWith(normalizedQuery);
      const bStartsWith = bNorm.startsWith(normalizedQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (bStartsWith && !aStartsWith) return 1;
      
      // Alphabetical order for similar relevance
      return a.localeCompare(b);
    });
    
    // Return limited number of suggestions
    return sortedSuggestions.slice(0, maxSuggestions);
  } catch (error) {
    console.error('Error loading autocomplete data:', error);
    return [];
  }
}

/**
 * Normalize a user guess to match database format
 * @param category - The current challenge category
 * @param userGuess - The user's guess/input
 * @param language - Language for normalization (default: 'en')
 * @returns Normalized guess that should match database format, or original guess if no normalization available
 */
export async function normalizeGuess(
  category: CategoryType,
  userGuess: string,
  language: Language = 'en'
): Promise<string> {
  try {
    const { data } = await importAutocompleteData(category, language);
    const normalizedInput = userGuess.toLowerCase().trim();
    
    // Check if the exact guess exists as a key in the normalization data (canonical name)
    const exactMatch = Object.keys(data).find((key: string) => 
      key.toLowerCase().trim() === normalizedInput
    );
    if (exactMatch) {
      return exactMatch; // Return the canonical name if user typed it exactly
    }
    
    // If not, iterate through the normalization data to find variations
    for (const canonicalName in data) {
      const variations = data[canonicalName];
      if (Array.isArray(variations) && variations.some((variation: string) => 
        variation.toLowerCase().trim() === normalizedInput
      )) {
        return canonicalName; // Return the canonical name if a variation matches
      }
    }
    
    return userGuess; // Return original if no match found
  } catch (error) {
    console.error('Error loading normalization data:', error);
    return userGuess;
  }
}

/**
 * Check if a category has autocomplete suggestions available
 * @param category - The category to check
 * @param language - Language to check (default: 'en')
 * @returns Boolean indicating if suggestions are available
 */
export async function hasAutocompleteSuggestions(category: CategoryType, language: Language = 'en'): Promise<boolean> {
  try {
    const { suggestions } = await importAutocompleteData(category, language);
    return Array.isArray(suggestions) && suggestions.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get the total number of suggestions available for a category
 * @param category - The category to check
 * @param language - Language to check (default: 'en')
 * @returns Number of available suggestions
 */
export async function getSuggestionCount(category: CategoryType, language: Language = 'en'): Promise<number> {
  try {
    const { suggestions } = await importAutocompleteData(category, language);
    return Array.isArray(suggestions) ? suggestions.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Get a random sample of suggestions for a category (useful for testing/preview)
 * @param category - The category to sample from
 * @param sampleSize - Number of random suggestions to return (default: 10)
 * @param language - Language for suggestions (default: 'en')
 * @returns Array of random suggestions
 */
export async function getRandomSuggestions(
  category: CategoryType,
  sampleSize: number = 10,
  language: Language = 'en'
): Promise<string[]> {
  try {
    const { suggestions } = await importAutocompleteData(category, language);
    
    if (!Array.isArray(suggestions) || suggestions.length <= sampleSize) {
      return [...(suggestions || [])];
    }
    
    // Fisher-Yates shuffle algorithm to get random sample
    const shuffled = [...suggestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, sampleSize);
  } catch (error) {
    console.error('Error loading suggestions:', error);
    return [];
  }
}

