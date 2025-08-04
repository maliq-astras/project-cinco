// src/config/factMetadata.ts
import { CategoryType } from '@/types';

export const factMetadata = {
  [CategoryType.COUNTRIES]: {
    "Language(s)": {
      description: "The country's official languages. May include secondary languages, dialects, and regional variations.",
      icon: "language",
      helpText: "Not just the language name, but interesting facts about usage or status"
    },
    "Flag": {
      description: "The country's flag design, colors, symbolism, or history.",
      icon: "flag",
      helpText: "Colors, symbols, and patterns on the national flag"
    },
    "Notable City": {
      description: "A major city in the mystery country.",
      icon: "location-city",
      helpText: "Facts about a significant city without naming it directly"
    },
    "Political History": {
      description: "Political system, governance, and major historical political events.",
      icon: "history-edu",
      helpText: "Details about government structure and political developments"
    },
    "Economy": {
      description: "Economic data or details about major industries & exports.",
      icon: "business",
      helpText: "Details about economic drivers and exports"
    },
    "Culture & Tradition": {
      description: "Cultural practices, customs, festivals, cuisine, or other distinctive traditions.",
      icon: "celebration",
      helpText: "Distinctive cultural elements that define the country"
    },
    "Geography & Border": {
      description: "The country's physical location, neighboring countries, and major landforms.",
      icon: "terrain",
      helpText: "Mountains, rivers, coastlines, and neighboring countries"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.ANIMALS]: {
    "Habitat": {
      description: "An animal's natural environment and geographical distribution.",
      icon: "forest",
      helpText: "Natural environment and geographical distribution"
    },
    "Diet": {
      description: "What this animal eats and its feeding habits",
      icon: "restaurant",
      helpText: "Feeding habits and dietary preferences"
    },
    "Physical Characteristic": {
      description: "Distinctive physical features, size, weight, and appearance.",
      icon: "visibility",
      helpText: "Unique physical attributes, dimensions, and adaptations"
    },
    "Evolutionary History": {
      description: "Animal's evolutionary background and related species.",
      icon: "account-tree",
      helpText: "How this animal evolved and what it's related to"
    },
    "Social Behavior": {
      description: "How these animals interact with each other in their natural habitat.",
      icon: "people",
      helpText: "Social structures, communication, or solitary behavior"
    },
    "Reproduction": {
      description: "Mating rituals, gestation periods, or parental care in the animal's natural habitat.",
      icon: "child-care",
      helpText: "How the animal reproduces and raises young"
    },
    "Interspecies Relationships": {
      description: "Symbiotic relationships, interactions with humans, or connections with other species.",
      icon: "connect-without-contact",
      helpText: "How this animal interacts with other species in its environment"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.MOVIES]: {
    "Behind the Scenes": {
      description: "Production stories, challenges, innovations, or creative decisions.",
      icon: "behind-the-scenes",
      helpText: "Interesting facts about how the film was made"
    },
    "Premiere": {
      description: "Time period or major events that coincide with the film's release.",
      icon: "premiere",
      helpText: "The decade or period when the film came out"
    },
    "Character(s)": {
      description: "A memorable character from the film",
      icon: "movie-character",
      helpText: "Description of a character without naming them"
    },
    "Genre": {
      description: "The type or style of film",
      icon: "movie-genre",
      helpText: "What kind of movie this is"
    },
    "Critical Reception": {
      description: "The film's ratings, critical reviews, or awards.",
      icon: "crit-reception",
      helpText: "Ratings, reviews, or awards the film received"
    },
    "Box Office": {
      description: "Financial performance, ticket sales, and revenue figures.",
      icon: "box-office",
      helpText: "How well the movie performed financially"
    },
    "Famous Line": {
      description: "Memorable quotes or dialogue from the movie.",
      icon: "famous-line",
      helpText: "Iconic lines that viewers remember from the film"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "wildcard",
      helpText: "Something surprising or unusual about the movie"
    }
  },

  [CategoryType.BOOKS]: {
    "Author": {
      description: "Who wrote this book",
      icon: "author",
      helpText: "Information about the author without naming them directly"
    },
    "Illustration/Cover Design": {
      description: "Notable cover art, illustrations, or distinctive visual elements.",
      icon: "illustration",
      helpText: "Visual elements associated with famous editions of the book"
    },
    "Character(s)": {
      description: "A memorable character from the book",
      icon: "character-book",
      helpText: "Description of a character without naming them"
    },
    "Genre": {
      description: "The book's genre, subgenre, or category.",
      icon: "genre-book",
      helpText: "What kind of book this is"
    },
    "Publication Date": {
      description: "When the book was first published or released.",
      icon: "publication",
      helpText: "The year or period when the book first appeared"
    },
    "Plot": {
      description: "The plot, theme or setting of the book.",
      icon: "plot",
      helpText: "The story of the book"
    },
    "Famous Lines": {
      description: "Memorable passages, opening lines, or quotes from the book.",
      icon: "book-quote",
      helpText: "Recognizable words or phrases from the text"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "wildcard",
      helpText: "Something surprising or unusual about the book"
    }
  },

  [CategoryType.MUSICAL_ARTISTS]: {
    "Genre": {
      description: "The type or style of music this artist creates.",
      icon: "music-genre",
      helpText: "What kind of music this artist makes"
    },
    "Background": {
      description: "The artist's background, influences, or life before fame.",
      icon: "background-musician",
      helpText: "Information about their origins and early life"
    },
    "Iconic Song": {
      description: "A popular or critically acclaimed song by this artist.",
      icon: "iconic-song",
      helpText: "Information about a notable song without naming it directly"
    },
    "Debut": {
      description: "When the artist first appeared on the music scene.",
      icon: "debut",
      helpText: "The year or period when they first became known"
    },
    "Achievements": {
      description: "Awards and nominations received by the artist",
      icon: "grammy",
      helpText: "Awards, nominations, or recognition the artist has received"
    },
    "Collaborations": {
      description: "Other artists or musicians the artist has worked with",
      icon: "collab",
      helpText: "Information about collaborators without naming them"
    },
    "Chart Performance": {
      description: "The artist's sales or charts & streaming metrics.",
      icon: "charts",
      helpText: "How well the artist's music performed on the charts or streams"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "wildcard",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.ATHLETES]: {
    "Personal Life": {
      description: "The athlete's personal life, relationships, or background.",
      icon: "personal-life",
      helpText: "Information about their personal life"
    },
    "Affiliations": {
      description: "Major accomplishments or records.",
      icon: "affiliations",
      helpText: "Important achievements or records they hold"
    },
    "Era": {
      description: "The time period the athlete was most active or popular.",
      icon: "time",
      helpText: "The year or period when they were active"
    },
    "Nationality": {  
      description: "The country they were born in or are most associated with.",
      icon: "nationality",
      helpText: "The country they were born in or are most associated with" 
    },
    "Physique": {
      description: "Physical characteristics, height, weight, etc.",
      icon: "physique",
      helpText: "Height, weight, or other physical attributes"
    },
    "Stats": {
      description: "Notable career statistics or records broken",
      icon: "stats",
      helpText: "Statistics about their performance"
    },
    "Achievements": {
      description: "Championships, awards or medals won.",
      icon: "achievements",
      helpText: "Notable accomplishments or milestones"
    },  
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "wildcard",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.HISTORICAL_FIGURES]: {  
    "Occupation": {
      description: "Their occupation, role, or field of expertise.",
      icon: "occupation",
      helpText: "Their occupation"
    },
    "Background": {
      description: "Their early life, family, and formative experiences.",
      icon: "childhood",
      helpText: "Information about their origins and early years"
    },
    "Nationality": {
      description: "The country they were born in or are most associated with.",
      icon: "nationality-globe",
      helpText: "The country they were born in or are most associated with" 
    },
    "Legacy": {
      description: "Their legacy or impact on history.",
      icon: "legacy",
      helpText: "Their legacy or impact"
    },
    "Physical Appearance": {
      description: "Physical appearance, height, weight, or other physical details.",
      icon: "appearance",
      helpText: "Physical appearance"
    },
    "Famous Quotes": {
      description: "Memorable sayings or written passages attributed to them.",
      icon: "quote",
      helpText: "Words they're known for saying or writing"
    },
    "Life's Conclusion": {
      description: "Circumstances surrounding the end of their life.",
      icon: "demise",
      helpText: "How their life story ended"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "wildcard",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.FAMOUS_BRANDS]: {
    "Industry": {
      description: "The industry the brand is in.",
      icon: "industry",
      helpText: "The industry the brand is in"
    },
    "Origin": { 
      description: "The country, date, and story of the brand's founding.",
      icon: "origin",
      helpText: "How and where the brand was established"
    },
    "Logo": {
      description: "The logo of the brand, its design, colors, or symbolism.",
      icon: "company-logo",
      helpText: "The visual identity of the brand"
    },  
    "Signature Product": {
      description: "The signature product of the brand, its design, colors, or symbolism.",
      icon: "product",
      helpText: "The most recognizable product associated with the brand"
    },
    "Target Audience": {
      description: "The demographic or customer base the brand primarily serves.",
      icon: "target-audience",
      helpText: "Who the brand's products are designed for"
    },
    "Tagline/Catchphrase": {
      description: "Famous slogans or marketing phrases associated with the brand.",
      icon: "slogan",
      helpText: "Memorable phrases used in their advertising"
    },  
    "HQ Location": { 
      description: "The location of the brand's current headquarters.",
      icon: "headquarters",
      helpText: "Where the brand is based today"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",
      icon: "wildcard",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.TV_SHOWS]: {
    "Genre": {
      description: "The genre of the show, its subgenre, or category.",
      icon: "tv-genre",
      helpText: "The genre of the show"
    },
    "Debut": {
      description: "The debut of the show, its first episode, or the time period it was first aired.",
      icon: "tv-debut",
      helpText: "The debut of the show"
    },
    "Character(s)": { 
      description: "A memorable character from the show, its role, or background.",
      icon: "character-tv",
      helpText: "Description of a character without naming them"
    },
    "Season Structure": { 
      description: "Number of seasons, episodes per season, or format evolution.",
      icon: "tv-seasons",
      helpText: "How the series was structured and evolved"
    },
    "Iconic Episode": {
      description: "The most critically acclaimed or popular episode of the series.",
      icon: "tv-episode",
      helpText: "A standout episode from the show's run"
    },
    "Network/Platform": {
      description: "The network or platform that airs the show, its streaming service, or other distribution channels.",
      icon: "tv-network",
      helpText: "The network or platform that airs the show"
    },
    "Visual Style": {
      description: "The visual style of the show, its cinematography, or visual effects.",
      icon: "tv-visual",
      helpText: "The distinctive look or visual approach of the show"
    },
    "Wildcard": {
      description: "Unique fun fact of an unknown variety",    
      icon: "wildcard",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  }
};