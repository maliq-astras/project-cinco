// Define game outcome types
export type GameOutcome = 'standard-win' | 'final-five-win' | 'loss-final-five-wrong' | 'loss-final-five-time' | 'loss-time';

// Define the available categories
export enum CategoryType {
  COUNTRIES = "Countries",
  ANIMALS = "Animals",
  MOVIES = "Movies",
  BOOKS = "Books",
  MUSICAL_ARTISTS = "Musical Artists",
  ATHLETES = "Athletes",
  HISTORICAL_FIGURES = "Historical Figures",
  FAMOUS_BRANDS = "Famous Brands",
  TV_SHOWS = "TV Shows"
}

// Define theme colors for each category
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
}

// Define unified color mapping object for consistent handling of colors
export const COLOR_MAPPING = {
  // Map each Tailwind color to its high contrast equivalent
  blue: 'blue',
  emerald: 'green',
  violet: 'purple',
  orange: 'orange',
  fuchsia: 'pink',
  red: 'red',
  amber: 'yellow',
  teal: 'cyan',
  indigo: 'indigo',
};

// Map categories to both their Tailwind color and high contrast color
export const CATEGORY_COLOR_MAPPING: Record<CategoryType, { tailwind: string, highContrast: string }> = {
  [CategoryType.COUNTRIES]: { tailwind: 'blue', highContrast: 'blue' },
  [CategoryType.ANIMALS]: { tailwind: 'emerald', highContrast: 'green' },
  [CategoryType.MOVIES]: { tailwind: 'violet', highContrast: 'purple' },
  [CategoryType.BOOKS]: { tailwind: 'orange', highContrast: 'orange' },
  [CategoryType.MUSICAL_ARTISTS]: { tailwind: 'fuchsia', highContrast: 'pink' },
  [CategoryType.ATHLETES]: { tailwind: 'red', highContrast: 'red' },
  [CategoryType.HISTORICAL_FIGURES]: { tailwind: 'amber', highContrast: 'yellow' },
  [CategoryType.FAMOUS_BRANDS]: { tailwind: 'teal', highContrast: 'cyan' },
  [CategoryType.TV_SHOWS]: { tailwind: 'indigo', highContrast: 'indigo' }
};

// Map categories to their colors
export const categoryColorMap: Record<CategoryType, ThemeColors> = {
  [CategoryType.COUNTRIES]: {
    primary: 'blue-600',
    secondary: 'blue-500',
    accent: 'blue-700',
    light: 'blue-100',
    dark: 'blue-800'
  },
  [CategoryType.ANIMALS]: {
    primary: 'emerald-600',
    secondary: 'emerald-500',
    accent: 'emerald-700',
    light: 'emerald-100',
    dark: 'emerald-800'
  },
  [CategoryType.MOVIES]: {
    primary: 'violet-600',
    secondary: 'violet-500',
    accent: 'violet-700',
    light: 'violet-100',
    dark: 'violet-800'
  },
  [CategoryType.BOOKS]: {
    primary: 'orange-600',
    secondary: 'orange-500',
    accent: 'orange-700',
    light: 'orange-100',
    dark: 'orange-800'
  },
  [CategoryType.MUSICAL_ARTISTS]: {
    primary: 'fuchsia-600',
    secondary: 'fuchsia-500',
    accent: 'fuchsia-700',
    light: 'fuchsia-100',
    dark: 'fuchsia-800'
  },
  [CategoryType.ATHLETES]: {
    primary: 'red-600',
    secondary: 'red-500',
    accent: 'red-700',
    light: 'red-100',
    dark: 'red-800'
  },
  [CategoryType.HISTORICAL_FIGURES]: {
    primary: 'amber-500',
    secondary: 'amber-400',
    accent: 'amber-600',
    light: 'amber-100',
    dark: 'amber-700'
  },
  [CategoryType.FAMOUS_BRANDS]: {
    primary: 'teal-500',
    secondary: 'teal-400',
    accent: 'teal-600',
    light: 'teal-100',
    dark: 'teal-700'
  },
  [CategoryType.TV_SHOWS]: {
    primary: 'indigo-500',
    secondary: 'indigo-400',
    accent: 'indigo-600',
    light: 'indigo-100',
    dark: 'indigo-700'
  }
};

// Define fact types for each category
export type CountryFactType = "Language(s)" | "Flag" | "Notable City" | "Political History" | "Economy" | "Culture & Tradition" | "Geography & Border" | "Wildcard";
export type AnimalFactType = "Habitat" | "Diet" | "Physical Characteristic" | "Evolutionary History" | "Social Behavior" | "Reproduction" | "Interspecies Relationships" | "Wildcard";
export type MovieFactType = "Behind the Scenes" | "Premiere" | "Character(s)" | "Genre" | "Critical Reception" | "Box Office" | "Famous Line" | "Wildcard";
export type BookFactType = "Author" | "Illustration/Cover Design" | "Character(s)" | "Genre" | "Publication Date" | "Plot" | "Famous Lines" | "Wildcard";
export type MusicalArtistFactType = "Genre" | "Background" | "Iconic Song" | "Debut" | "Achievements" | "Collaborations" | "Chart Performance" | "Wildcard";
export type AthleteFactType = "Personal Life" | "Affiliations" | "Era" | "Nationality" | "Physique" | "Stats" | "Achievements" | "Wildcard";
export type HistoricalFigureFactType = "Occupation" | "Background" | "Nationality" | "Legacy" | "Physical Appearance" | "Famous Quotes" | "Life's Conclusion" | "Wildcard";
export type FamousBrandFactType = "Industry" | "Origin" | "Logo" | "Signature Product" | "Target Audience" | "Tagline/Catchphrase" | "HQ Location" | "Brand Culture" | "Wildcard";
export type TvShowFactType = "Genre" | "Debut" | "Character(s)" | "Season Structure" | "Iconic Episode" | "Network/Platform" | "Visual Style" | "Wildcard";

// Map categories to their fact types
export type CategoryFactTypeMap = {
  [CategoryType.COUNTRIES]: CountryFactType;
  [CategoryType.ANIMALS]: AnimalFactType;
  [CategoryType.MOVIES]: MovieFactType;
  [CategoryType.BOOKS]: BookFactType;
  [CategoryType.MUSICAL_ARTISTS]: MusicalArtistFactType;
  [CategoryType.ATHLETES]: AthleteFactType;
  [CategoryType.HISTORICAL_FIGURES]: HistoricalFigureFactType;
  [CategoryType.FAMOUS_BRANDS]: FamousBrandFactType;
  [CategoryType.TV_SHOWS]: TvShowFactType;
}

// Create a generic Fact interface
export interface Fact<T extends CategoryType> {
  category: T;
  factType: CategoryFactTypeMap[T];
  content: {
    en: string;
    es: string;
  } | string; // Allow either an object with languages or a direct string
}

// For Challenge, we need to handle mixed categories
export interface Challenge {
  challengeId: string;
  date: string;
  category: CategoryType;
  facts: Fact<CategoryType>[];
  answer: {
    en: string;
    es: string;
  };
  alternatives: {
    en: string[];
    es: string[];
  };
}

export interface UserGuess {
  guess: string;
  isCorrect: boolean;
  timestamp: Date;
  isFinalFiveGuess?: boolean;
  isHidden?: boolean; // Used to track correct answers found after game over that shouldn't show in history
}

export interface UserProgress {
  userId: string;
  challengeId: string;
  date: string;
  revealedFacts: number[];
  guesses: UserGuess[];
  solved: boolean;
  usedFinal5: boolean;
  timeSpent?: number; // in seconds
}