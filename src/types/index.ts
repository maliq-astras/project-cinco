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
  category: T;
  factType: CategoryFactTypeMap[T];  // Now TypeScript knows T is a valid key for CategoryFactTypeMap
  content: string;
}

// For Challenge, we need to handle mixed categories
export interface Challenge {
  challengeId: string;
  date: string;
  category: CategoryType;
  facts: Array<Fact<CategoryType>>;
  answer: string;
  alternatives: string[];
}

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