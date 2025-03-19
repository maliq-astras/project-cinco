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
export type CountryFactType = "Official Language(s)" | "Flag Colors & Features" | "Notable City" | "Largest Industry" | "Population & Demographic Info" | "Origin/Founding" | "Geographic Features & Border Info" | "Wildcard";
export type AnimalFactType = "Habitat & Global Presence" | "Diet & Ecological Role" | "Physical Characteristic" | "Size/Weight" | "Evolutionary History & Relationships" | "Social Behavior" | "Reproduction" | "Wildcard";
export type MovieFactType = "Director" | "Release Era" | "Notable Character" | "Genre" | "Critical Reception/Awards" | "Box Office Performance" | "Production Studio" | "Wildcard";
export type BookFactType = "Author" | "Publication Date" | "Notable Character" | "Genre" | "Critical Reception/Awards" | "Sales & Popularity" | "Publishing House" | "Wildcard";
export type MusicalArtistFactType = "Genre" | "Notable Album" | "Release Date" | "Awards & Nominations" | "Collaborators" | "Wildcard";
export type AthleteFactType = "Sport" | "Achievements" | "Team" | "Physical Attributes" | "Career Highlights" | "Wildcard";
export type HistoricalFigureFactType = "Notable Achievement" | "Era" | "Associated Country" | "Contribution" | "Personal Life" | "Wildcard";
export type FamousBrandFactType = "Founder" | "Founding Year" | "Product" | "Headquarters Location" | "Year Founded" | "Wildcard";
export type TvShowFactType = "Creator" | "Premiere Date" | "Notable Character" | "Genre" | "Awards & Nominations" | "Network" | "Wildcard";
// Define other fact types similarly...

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
  // Map other categories similarly...
}

// Create a generic Fact interface
export interface Fact<T extends CategoryType> {
  category: T; // This is a required field
  factType: CategoryFactTypeMap[T];  // Now TypeScript knows T is a valid key for CategoryFactTypeMap
  content: string;
}

// For Challenge, we need to handle mixed categories
export interface Challenge {
  challengeId: string;
  date: string;
  category: CategoryType;
  facts: Fact<CategoryType>[];
  answer: string;
  alternatives: string[];
}

export interface UserGuess {
  guess: string;
  isCorrect: boolean;
  timestamp: Date;
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