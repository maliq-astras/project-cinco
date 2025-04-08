// src/config/factMetadata.ts
import { CategoryType } from '@/types';

export const factMetadata = {
  [CategoryType.COUNTRIES]: {
    "Language(s)": {
      description: "Information about languages spoken in this country",
      icon: "language",
      helpText: "Not just the language name, but interesting facts about usage or status"
    },
    "Flag": {
      description: "Details about the country's flag design",
      icon: "flag",
      helpText: "Colors, symbols, and patterns on the national flag"
    },
    "Cities": {
      description: "Information about significant cities",
      icon: "location-city",
      helpText: "Facts about major cities without naming them directly"
    },
    "Economy": {
      description: "Economic information about major industries",
      icon: "business",
      helpText: "Details about economic drivers and exports"
    },
    "Demographics": {
      description: "Population statistics and demographics",
      icon: "groups",
      helpText: "Size, distribution, and makeup of the population"
    },
    "Origin": {
      description: "Historical information about the country's formation",
      icon: "history-edu",
      helpText: "When and how the country was established or gained independence"
    },
    "Geography & Climate": {
      description: "Natural features and border information",
      icon: "terrain",
      helpText: "Mountains, rivers, coastlines, and neighboring countries"
    },
    "Wildcard": {
      description: "Unique or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.ANIMALS]: {
    "Habitat": {
      description: "Where this animal lives",
      icon: "forest",
      helpText: "Natural environment and geographical distribution"
    },
    "Ecology": {
      description: "What this animal eats and its role in the ecosystem",
      icon: "restaurant",
      helpText: "Feeding habits and position in the food chain"
    },
    "Rare Features": {
      description: "Distinctive physical features",
      icon: "visibility",
      helpText: "Unique physical attributes or adaptations"
    },
    "Size/Weight": {
      description: "Physical dimensions",
      icon: "straighten",
      helpText: "How large or small the animal is relative to others"
    },
    "Evolutionary History": {
      description: "Evolutionary background and related species",
      icon: "account-tree",
      helpText: "How this animal evolved and what it's related to"
    },
    "Social Behavior": {
      description: "How these animals interact with each other",
      icon: "people",
      helpText: "Social structures, communication, or solitary behavior"
    },
    "Reproduction": {
      description: "Breeding and offspring information",
      icon: "child-care",
      helpText: "How the animal reproduces and raises young"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.MOVIES]: {
    "Director": {
      description: "Who directed this film",
      icon: "movie",
      helpText: "Information about the filmmaker without naming them directly"
    },
    "Premiere": {
      description: "When this movie was released",
      icon: "date-range",
      helpText: "The decade or period when the film came out"
    },
    "Character(s)": {
      description: "A memorable character from the film",
      icon: "person",
      helpText: "Description of a character without naming them"
    },
    "Genre": {
      description: "The type or style of film",
      icon: "category",
      helpText: "What kind of movie this is"
    },
    "Critical Reception": {
      description: "How critics responded to the film",
      icon: "star",
      helpText: "Ratings, reviews, or awards the film received"
    },
    "Box Office": {
      description: "Commercial success information",
      icon: "attach-money",
      helpText: "How well the movie performed financially"
    },
    "Production": {
      description: "Company that made the film",
      icon: "business",
      helpText: "Information about who produced the movie"
    },
    "Wildcard": {
      description: "Interesting behind-the-scenes fact",
      icon: "stars",
      helpText: "Something surprising or unusual about the movie"
    }
  },

  [CategoryType.BOOKS]: {
    "Author": {
      description: "Who wrote this book",
      icon: "book",
      helpText: "Information about the author without naming them directly"
    },
    "Publication": {
      description: "When this book was published",
      icon: "date-range",
      helpText: "The year or period when the book was released"
    },
    "Character(s)": {
      description: "A memorable character from the book",
      icon: "person",
      helpText: "Description of a character without naming them"
    },
    "Genre": {
      description: "The type or style of book",
      icon: "category",
      helpText: "What kind of book this is"
    },
    "Critical Reception": {
      description: "How critics responded to the book",
      icon: "star",
      helpText: "Ratings, reviews, or awards the book received"
    },
    "Plot": {
      description: "The plot of the book",
      icon: "attach-money",
      helpText: "The story of the book"
    },
    "Narrative Style": {
      description: "The style of writing in the book",
      icon: "business",
      helpText: "The way the story is told"
    },
    "Wildcard": {
      description: "Interesting behind-the-scenes fact",
      icon: "stars",
      helpText: "Something surprising or unusual about the book"
    }
  },

  [CategoryType.MUSICAL_ARTISTS]: {
    "Genre": {
      description: "The type or style of music",
      icon: "music",
      helpText: "What kind of music this artist makes"
    },
    "Background": {
      description: "A popular or critically acclaimed album",
      icon: "album",
      helpText: "Information about a notable album without naming it"
    },
    "Songs & Albums": {
      description: "A popular or critically acclaimed album",
      icon: "album",
      helpText: "Information about a notable album without naming it"
    },
    "Era": {
      description: "When this album was released",
      icon: "date-range",
      helpText: "The year or period when the album came out"
    },
    "Achievements": {
      description: "Awards and nominations received by the artist",
      icon: "star",
      helpText: "Awards, nominations, or recognition the artist has received"
    },
    "Collaborations": {
      description: "Other artists or musicians the artist has worked with",
      icon: "people",
      helpText: "Information about collaborators without naming them"
    },
    "Chart Performance": {
      description: "The artist's performance on the charts",
      icon: "star",
      helpText: "How well the artist's music performed on the charts"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.ATHLETES]: {
    "Personal Life": {
      description: "Information about their personal life",
      icon: "person",
      helpText: "Information about their personal life"
    },
    "Affiliations": {
      description: "Major accomplishments or records",
      icon: "trophy",
      helpText: "Important achievements or records they hold"
    },
    "Era": {
      description: "When they were active",
      icon: "date-range",
      helpText: "The year or period when they were active"
    },
    "Nationality": {  
      description: "The country they are associated with",
      icon: "flag",
      helpText: "The country they were born in or are most associated with" 
    },
    "Physique": {
      description: "Physical characteristics",
      icon: "straighten",
      helpText: "Height, weight, or other physical attributes"
    },
    "Stats": {
      description: "Statistics about their performance",
      icon: "star",
      helpText: "Statistics about their performance"
    },
    "Achievements": {
      description: "Key moments or achievements in their career",
      icon: "star",
      helpText: "Notable accomplishments or milestones"
    },  
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.HISTORICAL_FIGURES]: {  
    "Occupation": {
      description: "Their occupation",
      icon: "business",
      helpText: "Their occupation"
    },
    "Important Dates": {
      description: "Important dates in their life",
      icon: "date-range",
      helpText: "Important dates in their life"
    },
    "Nationality": {
      description: "The country they are associated with",
      icon: "flag",
      helpText: "The country they were born in or are most associated with" 
    },
    "Legacy": {
      description: "Their legacy or impact",
      icon: "star",
      helpText: "Their legacy or impact"
    },
    "Physical Appearance": {
      description: "Physical appearance",
      icon: "straighten",
      helpText: "Physical appearance"
    },
    "Background": {
      description: "Their background",
      icon: "person",
      helpText: "Their background"
    },
    "Personal Life": {
      description: "Information about their personal life",
      icon: "person",
      helpText: "Information about their personal life"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.FAMOUS_BRANDS]: {
    "Industry": {
      description: "The industry the brand is in",
      icon: "business",
      helpText: "The industry the brand is in"
    },
    "Origin": { 
      description: "The country the brand was founded in",
      icon: "flag",
      helpText: "The country the brand was founded in"
    },
    "Logo": {
      description: "The logo of the brand",
      icon: "logo",
      helpText: "The logo of the brand"
    },  
    "Signature Product": {
      description: "The signature product of the brand",
      icon: "product-hunt",
      helpText: "The signature product of the brand"
    },
    "Financials": {
      description: "The financial information of the brand",
      icon: "attach-money",
      helpText: "The financial information of the brand"
    },
    "Brand Culture": {
      description: "The culture of the brand",
      icon: "people",
      helpText: "The culture of the brand"
    },  
    "Location": { 
      description: "The location of the brand",
      icon: "location-city",
      helpText: "The location of the brand"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.TV_SHOWS]: {
    "Genre": {
      description: "The genre of the show",
      icon: "category",
      helpText: "The genre of the show"
    },
    "Debut": {
      description: "The debut of the show",
      icon: "date-range",
      helpText: "The debut of the show"
    },
    "Production": {
      description: "The production company of the show",
      icon: "business",
      helpText: "The production company of the show"
    },
    "Character(s)": { 
      description: "A memorable character from the show",
      icon: "person",
      helpText: "Description of a character without naming them"
    },
    "Reception": {
      description: "The reception of the show",
      icon: "star",
      helpText: "The reception of the show"
    },
    "Network/Platform": {
      description: "The network or platform that airs the show",
      icon: "tv",
      helpText: "The network or platform that airs the show"
    },
    "Visual Style": {
      description: "The visual style of the show",
      icon: "palette",
      helpText: "The visual style of the show"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",    
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  }
};  