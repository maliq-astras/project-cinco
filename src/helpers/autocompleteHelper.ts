import { CategoryType } from '@/types';

// Language-specific imports - NEW CLEAN STRUCTURE
import { animalsSuggestions as animalsEn } from '@/data/autocomplete/animals/suggestions/en.js';
import { animalsNormalization as animalsDataEn } from '@/data/autocomplete/animals/normalization/en.js';
import { animalsSuggestions as animalsEs } from '@/data/autocomplete/animals/suggestions/es.js';
import { animalsNormalization as animalsDataEs } from '@/data/autocomplete/animals/normalization/es.js';

import { athletesSuggestions as athletesEn } from '@/data/autocomplete/athletes/suggestions/en.js';
import { athletesNormalization as athletesDataEn } from '@/data/autocomplete/athletes/normalization/en.js';
import { athletesSuggestions as athletesEs } from '@/data/autocomplete/athletes/suggestions/es.js';
import { athletesNormalization as athletesDataEs } from '@/data/autocomplete/athletes/normalization/es.js';

import { booksSuggestions as booksEn } from '@/data/autocomplete/books/suggestions/en.js';
import { booksNormalization as booksDataEn } from '@/data/autocomplete/books/normalization/en.js';
import { booksSuggestions as booksEs } from '@/data/autocomplete/books/suggestions/es.js';
import { booksNormalization as booksDataEs } from '@/data/autocomplete/books/normalization/es.js';

import { countriesSuggestions as countriesEn } from '@/data/autocomplete/countries/suggestions/en.js';
import { countriesNormalization as countriesDataEn } from '@/data/autocomplete/countries/normalization/en.js';
import { countriesSuggestions as countriesEs } from '@/data/autocomplete/countries/suggestions/es.js';
import { countriesNormalization as countriesDataEs } from '@/data/autocomplete/countries/normalization/es.js';

import { famousBrandsSuggestions as famousBrandsEn } from '@/data/autocomplete/famous-brands/suggestions/en.js';
import { famousBrandsNormalization as famousBrandsDataEn } from '@/data/autocomplete/famous-brands/normalization/en.js';
import { famousBrandsSuggestions as famousBrandsEs } from '@/data/autocomplete/famous-brands/suggestions/es.js';
import { famousBrandsNormalization as famousBrandsDataEs } from '@/data/autocomplete/famous-brands/normalization/es.js';

import { historicalFiguresSuggestions as historicalFiguresEn } from '@/data/autocomplete/historical-figures/suggestions/en.js';
import { historicalFiguresNormalization as historicalFiguresDataEn } from '@/data/autocomplete/historical-figures/normalization/en.js';
import { historicalFiguresSuggestions as historicalFiguresEs } from '@/data/autocomplete/historical-figures/suggestions/es.js';
import { historicalFiguresNormalization as historicalFiguresDataEs } from '@/data/autocomplete/historical-figures/normalization/es.js';

import { moviesSuggestions as moviesEn } from '@/data/autocomplete/movies/suggestions/en.js';
import { moviesNormalization as moviesDataEn } from '@/data/autocomplete/movies/normalization/en.js';
import { moviesSuggestions as moviesEs } from '@/data/autocomplete/movies/suggestions/es.js';
import { moviesNormalization as moviesDataEs } from '@/data/autocomplete/movies/normalization/es.js';

import { musicalArtistsSuggestions as musicalArtistsEn } from '@/data/autocomplete/musical-artists/suggestions/en.js';
import { musicalArtistsNormalization as musicalArtistsDataEn } from '@/data/autocomplete/musical-artists/normalization/en.js';
import { musicalArtistsSuggestions as musicalArtistsEs } from '@/data/autocomplete/musical-artists/suggestions/es.js';
import { musicalArtistsNormalization as musicalArtistsDataEs } from '@/data/autocomplete/musical-artists/normalization/es.js';

import { tvShowsSuggestions as tvShowsEn } from '@/data/autocomplete/tv-shows/suggestions/en.js';
import { tvShowsNormalization as tvShowsDataEn } from '@/data/autocomplete/tv-shows/normalization/en.js';
import { tvShowsSuggestions as tvShowsEs } from '@/data/autocomplete/tv-shows/suggestions/es.js';
import { tvShowsNormalization as tvShowsDataEs } from '@/data/autocomplete/tv-shows/normalization/es.js';

// Language type
export type Language = 'en' | 'es';

// New structure: category -> language -> { suggestions: string[], data: Record<string, string[]> }
const newCategorySuggestions: Partial<Record<CategoryType, Record<Language, { suggestions: string[], data: Record<string, string[]> }>>> = {
  [CategoryType.ANIMALS]: {
    en: { suggestions: animalsEn, data: animalsDataEn },
    es: { suggestions: animalsEs, data: animalsDataEs }
  },
  [CategoryType.ATHLETES]: {
    en: { suggestions: athletesEn, data: athletesDataEn },
    es: { suggestions: athletesEs, data: athletesDataEs }
  },
  [CategoryType.BOOKS]: {
    en: { suggestions: booksEn, data: booksDataEn },
    es: { suggestions: booksEs, data: booksDataEs }
  },
  [CategoryType.COUNTRIES]: {
    en: { suggestions: countriesEn, data: countriesDataEn },
    es: { suggestions: countriesEs, data: countriesDataEs }
  },
  [CategoryType.FAMOUS_BRANDS]: {
    en: { suggestions: famousBrandsEn, data: famousBrandsDataEn },
    es: { suggestions: famousBrandsEs, data: famousBrandsDataEs }
  },
  [CategoryType.HISTORICAL_FIGURES]: {
    en: { suggestions: historicalFiguresEn, data: historicalFiguresDataEn },
    es: { suggestions: historicalFiguresEs, data: historicalFiguresDataEs }
  },
  [CategoryType.MOVIES]: {
    en: { suggestions: moviesEn, data: moviesDataEn },
    es: { suggestions: moviesEs, data: moviesDataEs }
  },
  [CategoryType.MUSICAL_ARTISTS]: {
    en: { suggestions: musicalArtistsEn, data: musicalArtistsDataEn },
    es: { suggestions: musicalArtistsEs, data: musicalArtistsDataEs }
  },
  [CategoryType.TV_SHOWS]: {
    en: { suggestions: tvShowsEn, data: tvShowsDataEn },
    es: { suggestions: tvShowsEs, data: tvShowsDataEs }
  }
};

// All categories now use the new structure - no legacy needed

/**
 * Get autocomplete suggestions for a specific category and query
 * @param category - The current challenge category
 * @param query - The user's input query
 * @param maxSuggestions - Maximum number of suggestions to return (default: 5)
 * @param previousGuesses - Array of previous guesses to exclude from suggestions
 * @param language - Language for suggestions (default: 'en')
 * @returns Array of matching suggestions
 */
export function getAutocompleteSuggestions(
  category: CategoryType,
  query: string,
  maxSuggestions: number = 5,
  previousGuesses: string[] = [],
  language: Language = 'en'
): string[] {
  // Get suggestions from the new structure
  const categoryData = newCategorySuggestions[category]?.[language];
  const suggestions = categoryData?.suggestions || [];
  
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
  const filteredSuggestions = suggestions.filter(suggestion => {
    const normalizedSuggestion = suggestion.toLowerCase().trim();
    
    // Check if already guessed
    if (normalizedPreviousGuesses.includes(normalizedSuggestion)) {
      return false;
    }
    
    // Check if suggestion contains the query
    return normalizedSuggestion.includes(normalizedQuery);
  });
  
  // Sort by relevance (exact matches first, then starts with, then contains)
  const sortedSuggestions = filteredSuggestions.sort((a, b) => {
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
}

/**
 * Normalize a user guess to match database format
 * @param category - The current challenge category
 * @param userGuess - The user's guess/input
 * @param language - Language for normalization (default: 'en')
 * @returns Normalized guess that should match database format, or original guess if no normalization available
 */
export function normalizeGuess(
  category: CategoryType,
  userGuess: string,
  language: Language = 'en'
): string {
  // Get normalization data from the new structure
  const categoryData = newCategorySuggestions[category]?.[language];
  if (!categoryData) {
    return userGuess; // Return original if no normalization available
  }
  
  const { data } = categoryData;
  const normalizedInput = userGuess.toLowerCase().trim();
  
  // Check if the exact guess exists as a key in the normalization data (canonical name)
  const exactMatch = Object.keys(data).find(key => 
    key.toLowerCase() === normalizedInput
  );
  if (exactMatch) {
    return exactMatch; // Return the canonical name if user typed it exactly
  }
  
  // If not, iterate through the normalization data to find variations
  for (const canonicalName in data) {
    const variations = data[canonicalName];
    if (Array.isArray(variations) && variations.some(variation => 
      variation.toLowerCase().trim() === normalizedInput
    )) {
      return canonicalName; // Return the canonical name if a variation matches
    }
  }
  
  return userGuess; // Return original if no match found
}

/**
 * Check if a category has autocomplete suggestions available
 * @param category - The category to check
 * @param language - Language to check (default: 'en')
 * @returns Boolean indicating if suggestions are available
 */
export function hasAutocompleteSuggestions(category: CategoryType, language: Language = 'en'): boolean {
  const categoryData = newCategorySuggestions[category]?.[language];
  return categoryData ? categoryData.suggestions.length > 0 : false;
}

/**
 * Get the total number of suggestions available for a category
 * @param category - The category to check
 * @param language - Language to check (default: 'en')
 * @returns Number of available suggestions
 */
export function getSuggestionCount(category: CategoryType, language: Language = 'en'): number {
  const categoryData = newCategorySuggestions[category]?.[language];
  return categoryData ? categoryData.suggestions.length : 0;
}

/**
 * Get a random sample of suggestions for a category (useful for testing/preview)
 * @param category - The category to sample from
 * @param sampleSize - Number of random suggestions to return (default: 10)
 * @param language - Language for suggestions (default: 'en')
 * @returns Array of random suggestions
 */
export function getRandomSuggestions(
  category: CategoryType,
  sampleSize: number = 10,
  language: Language = 'en'
): string[] {
  const categoryData = newCategorySuggestions[category]?.[language];
  const suggestions = categoryData?.suggestions || [];
  
  if (suggestions.length <= sampleSize) {
    return [...suggestions];
  }
  
  // Fisher-Yates shuffle algorithm to get random sample
  const shuffled = [...suggestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, sampleSize);
}