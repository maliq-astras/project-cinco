// src/config/factMetadata.ts
import { CategoryType } from '@/types';

export const factMetadata = {
  [CategoryType.COUNTRIES]: {
    "Official Language(s)": {
      description: "Information about languages spoken in this country",
      icon: "language",
      helpText: "Not just the language name, but interesting facts about usage or status"
    },
    "Flag Colors & Features": {
      description: "Details about the country's flag design",
      icon: "flag",
      helpText: "Colors, symbols, and patterns on the national flag"
    },
    "Notable City": {
      description: "Information about a significant city",
      icon: "location-city",
      helpText: "Facts about major cities without naming them directly"
    },
    "Largest Industry": {
      description: "Economic information about major industries",
      icon: "business",
      helpText: "Details about economic drivers and exports"
    },
    "Population & Demographic Info": {
      description: "Population statistics and demographics",
      icon: "groups",
      helpText: "Size, distribution, and makeup of the population"
    },
    "Origin/Founding": {
      description: "Historical information about the country's formation",
      icon: "history-edu",
      helpText: "When and how the country was established or gained independence"
    },
    "Geographic Features & Border Info": {
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
    "Habitat & Global Presence": {
      description: "Where this animal lives",
      icon: "forest",
      helpText: "Natural environment and geographical distribution"
    },
    "Diet & Ecological Role": {
      description: "What this animal eats and its role in the ecosystem",
      icon: "restaurant",
      helpText: "Feeding habits and position in the food chain"
    },
    "Physical Characteristic": {
      description: "Distinctive physical features",
      icon: "visibility",
      helpText: "Unique physical attributes or adaptations"
    },
    "Size/Weight": {
      description: "Physical dimensions",
      icon: "straighten",
      helpText: "How large or small the animal is relative to others"
    },
    "Evolutionary History & Relationships": {
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
    "Release Era": {
      description: "When this movie was released",
      icon: "date-range",
      helpText: "The decade or period when the film came out"
    },
    "Notable Character": {
      description: "A memorable character from the film",
      icon: "person",
      helpText: "Description of a character without naming them"
    },
    "Genre": {
      description: "The type or style of film",
      icon: "category",
      helpText: "What kind of movie this is"
    },
    "Critical Reception/Awards": {
      description: "How critics responded to the film",
      icon: "star",
      helpText: "Ratings, reviews, or awards the film received"
    },
    "Box Office Performance": {
      description: "Commercial success information",
      icon: "attach-money",
      helpText: "How well the movie performed financially"
    },
    "Production Studio": {
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
    "Publication Date": {
      description: "When this book was published",
      icon: "date-range",
      helpText: "The year or period when the book was released"
    },
    "Notable Character": {
      description: "A memorable character from the book",
      icon: "person",
      helpText: "Description of a character without naming them"
    },
    "Genre": {
      description: "The type or style of book",
      icon: "category",
      helpText: "What kind of book this is"
    },
    "Critical Reception/Awards": {
      description: "How critics responded to the book",
      icon: "star",
      helpText: "Ratings, reviews, or awards the book received"
    },
    "Sales & Popularity": {
      description: "Commercial success information",
      icon: "attach-money",
      helpText: "How well the book sold or was received"
    },
    "Publishing House": {
      description: "Company that published the book",
      icon: "business",
      helpText: "Information about who published the book"
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
    "Notable Album": {
      description: "A popular or critically acclaimed album",
      icon: "album",
      helpText: "Information about a notable album without naming it"
    },
    "Release Date": {
      description: "When this album was released",
      icon: "date-range",
      helpText: "The year or period when the album came out"
    },
    "Awards & Nominations": {
      description: "Awards and nominations received by the artist",
      icon: "star",
      helpText: "Awards, nominations, or recognition the artist has received"
    },
    "Collaborators": {
      description: "Other artists or musicians the artist has worked with",
      icon: "people",
      helpText: "Information about collaborators without naming them"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.ATHLETES]: {
    "Sport": {
      description: "The sport this athlete plays",
      icon: "sports-soccer",
      helpText: "What sport they compete in"
    },
    "Achievements": {
      description: "Major accomplishments or records",
      icon: "trophy",
      helpText: "Important achievements or records they hold"
    },
    "Team": {
      description: "The team they play for",
      icon: "groups",
      helpText: "The professional or national team they represent"
    },
    "Physical Attributes": {
      description: "Physical characteristics",
      icon: "straighten",
      helpText: "Height, weight, or other physical attributes"
    },
    "Career Highlights": {
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
    "Notable Achievement": {
      description: "A significant achievement or contribution",
      icon: "star",
      helpText: "Notable accomplishments or milestones"
    },
    "Associated Country": {
      description: "The country they are associated with",
      icon: "flag",
      helpText: "The country they were born in or are most associated with" 
    },
    "Contribution": {
      description: "Their major contribution or impact",
      icon: "star",
      helpText: "What they are known for or their most important work"
    },  
    "Personal Life": {
      description: "Personal information",
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
    "Founder": {
      description: "The founder of the brand",
      icon: "person",
      helpText: "Information about the founder without naming them directly"
    },
    "Founding Year": {
      description: "The year the brand was founded",
      icon: "date-range",
      helpText: "The year or period when the brand was established"
    },  
    "Product": {
      description: "The product or service the brand offers",
      icon: "product-hunt",
      helpText: "What the brand is known for or their most popular item"
    },      
    "Headquarters Location": {
      description: "The location of the brand's headquarters",
      icon: "location-city",
      helpText: "Where the brand is headquartered"
    },                      
    "Year Founded": {   
      description: "The year the brand was founded",
      icon: "date-range",
      helpText: "The year or period when the brand was established"
    },
    "Wildcard": {
      description: "Surprising or unusual fact",
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  },

  [CategoryType.TV_SHOWS]: {
    "Creator": {
      description: "The creator of the show",
      icon: "person",
      helpText: "Information about the creator without naming them directly"
    },
    "Premiere Date": {
      description: "The date the show premiered",
      icon: "date-range",
      helpText: "The year or period when the show first aired"      
    },
    "Notable Character": {
      description: "A memorable character from the show",
      icon: "person",
      helpText: "Description of a character without naming them"
    },  
    "Genre": {
      description: "The type or style of show",
      icon: "category",
      helpText: "What kind of show this is"
    },      
    "Awards & Nominations": {
      description: "Awards and nominations received by the show",
      icon: "star",
      helpText: "Awards, nominations, or recognition the show has received"
    },  
    "Network": {
      description: "The network that airs the show",
      icon: "tv",
      helpText: "The network or channel that broadcasts the show"
    },  
    "Wildcard": {
      description: "Surprising or unusual fact",    
      icon: "stars",
      helpText: "An interesting fact that doesn't fit other categories"
    }
  }
};  