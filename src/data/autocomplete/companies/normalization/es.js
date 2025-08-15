// Normalization data (grouped catch-all variations)
// Maps user input variations to the official company name
// IMPORTANT: All accent variations are normalized to prevent wrong answers
export const companiesNormalization = {
  // Challenge companies - common variations and accent normalization
  "McDonald's": [
    "McDonalds", // Without apostrophe
    "Mickey D's",
    "Mickey Ds",
    "McD's",
    "McDs",
    "Arcos Dorados" // Spanish nickname for golden arches
  ],

  "Coca-Cola": [
    "Coke",
    "Coca Cola", // Without hyphen
    "Coca-Cola Clásica",
    "Coca-Cola Clasica", // Without accent
    "Coca Cola Clasica" // Without hyphen or accent
  ],

  "Starbucks": [
    "Starbucks Coffee",
    "SBUX"
  ],

  // Technology - accent normalization and abbreviations
  "Google": [
    "Alphabet", // Parent company
    "GOOGL"
  ],

  "Microsoft": [
    "MSFT",
    "MS"
  ],

  "Apple": [
    "AAPL",
    "Manzana" // Spanish translation (though not commonly used)
  ],

  "Amazon": [
    "AMZN",
    "Amazonas" // Spanish variation
  ],

  "Meta": [
    "Facebook", // Former name, still commonly used
    "FB"
  ],

  "Tesla": [
    "TSLA"
  ],

  "Netflix": [
    "NFLX"
  ],

  "YouTube": [
    "Youtube" // Common misspelling
  ],

  "PlayStation": [
    "PS",
    "Sony PlayStation",
    "Playstation" // Common misspelling
  ],

  "Xbox": [
    "Microsoft Xbox",
    "X-Box" // With hyphen
  ],

  // Automotive - accent normalization
  "Mercedes-Benz": [
    "Mercedes",
    "Benz",
    "Mercedes Benz" // Without hyphen
  ],

  "BMW": [
    "Bayerische Motoren Werke" // Full German name
  ],

  "Volkswagen": [
    "VW"
  ],

  "Rolls-Royce": [
    "Rolls Royce" // Without hyphen
  ],

  "Land Rover": [
    "Landrover" // One word
  ],

  "Lamborghini": [
    "Lambo" // Common nickname
  ],

  "Citroën": [
    "Citroen" // Without accent
  ],

  // Food & Beverage - comprehensive accent normalization
  "KFC": [
    "Kentucky Fried Chicken" // Original name
  ],

  "Burger King": [
    "BK"
  ],

  "Pizza Hut": [
    "Pizzahut" // One word
  ],

  "Taco Bell": [
    "Tacobell" // One word
  ],

  "Dunkin'": [
    "Dunkin Donuts", // Former name
    "Dunkin' Donuts",
    "DD"
  ],

  "Chick-fil-A": [
    "Chick Fil A", // Without hyphens
    "Chickfila", // One word
    "CFA"
  ],

  "In-N-Out": [
    "In N Out", // Without hyphens
    "In and Out"
  ],

  "Papa John's": [
    "Papa Johns" // Without apostrophe
  ],

  "Little Caesars": [
    "Little Caesar's", // With apostrophe
    "Little Caesars Pizza"
  ],

  "Carl's Jr.": [
    "Carls Jr", // Without apostrophe and period
    "Carl's Junior"
  ],

  "Jack in the Box": [
    "Jack-in-the-Box" // With hyphens
  ],

  "Dr Pepper": [
    "Dr. Pepper", // With period
    "Doctor Pepper"
  ],

  "7UP": [
    "Seven Up",
    "7-Up" // With hyphen
  ],

  "Mountain Dew": [
    "Mtn Dew" // Abbreviated version
  ],

  "Kit Kat": [
    "KitKat" // One word
  ],

  "M&M's": [
    "M&Ms", // Without apostrophe
    "MMs", // Without ampersand
    "M and Ms"
  ],

  "3 Musketeers": [
    "Three Musketeers",
    "Tres Mosqueteros" // Spanish translation
  ],

  "Reese's": [
    "Reeses" // Without apostrophe
  ],

  "Hershey's Kisses": [
    "Hersheys Kisses", // Without apostrophe
    "Kisses"
  ],

  "5 Gum": [
    "Five Gum"
  ],

  "Nestlé": [
    "Nestle" // Without accent
  ],

  "Hermès": [
    "Hermes" // Without accent
  ],

  // Fashion & Luxury - comprehensive accent normalization
  "Louis Vuitton": [
    "LV"
  ],

  "Dolce & Gabbana": [
    "D&G",
    "Dolce and Gabbana"
  ],

  "Saint Laurent": [
    "YSL",
    "Yves Saint Laurent" // Former full name
  ],

  "Calvin Klein": [
    "CK"
  ],

  "Tommy Hilfiger": [
    "Tommy"
  ],

  "Ralph Lauren": [
    "RL"
  ],

  "Polo Ralph Lauren": [
    "Polo"
  ],

  "Hugo Boss": [
    "Boss"
  ],

  "Abercrombie & Fitch": [
    "A&F",
    "Abercrombie and Fitch"
  ],

  "Forever 21": [
    "Forever21" // One word
  ],

  "H&M": [
    "H and M",
    "Hennes & Mauritz" // Full name
  ],

  "Urban Outfitters": [
    "UO"
  ],

  "J.Crew": [
    "J Crew" // Without period
  ],

  "Saks Fifth Avenue": [
    "Saks"
  ],

  "Aéropostale": [
    "Aeropostale" // Without accent
  ],

  // Sports & Athletic - accent normalization
  "Under Armour": [
    "UnderArmour", // One word
    "UA"
  ],

  "New Balance": [
    "NB"
  ],

  "The North Face": [
    "North Face", // Without "The"
    "TNF"
  ],

  "Dick's Sporting Goods": [
    "Dicks Sporting Goods", // Without apostrophe
    "Dick's",
    "Dicks"
  ],

  "Foot Locker": [
    "Footlocker" // One word
  ],

  "Finish Line": [
    "Finishline" // One word
  ],

  "Lady Foot Locker": [
    "Lady Footlocker" // One word
  ],

  // Beauty & Personal Care - comprehensive accent normalization
  "L'Oréal": [
    "Loreal", // Without apostrophe and accent
    "L'Oreal" // Without accent
  ],

  "Estée Lauder": [
    "Estee Lauder" // Without accents
  ],

  "Lancôme": [
    "Lancome" // Without accent
  ],

  "Johnson & Johnson": [
    "J&J",
    "Johnson and Johnson"
  ],

  "Procter & Gamble": [
    "P&G",
    "Procter and Gamble"
  ],

  "Head & Shoulders": [
    "Head and Shoulders"
  ],

  "TRESemmé": [
    "Tresemme" // Without accents
  ],

  // Home & Lifestyle - accent normalization
  "Home Depot": [
    "The Home Depot" // With "The"
  ],

  "Sam's Club": [
    "Sams Club" // Without apostrophe
  ],

  "Best Buy": [
    "BestBuy" // One word
  ],

  "Office Depot": [
    "OfficeDepot" // One word
  ],

  "RadioShack": [
    "Radio Shack" // Two words
  ],

  // Airlines - accent normalization
  "American Airlines": [
    "AA"
  ],

  "United Airlines": [
    "United"
  ],

  "Southwest": [
    "Southwest Airlines"
  ],

  "JetBlue": [
    "Jet Blue" // Two words
  ],

  "Alaska Airlines": [
    "Alaska Air"
  ],

  "Spirit Airlines": [
    "Spirit"
  ],

  "Frontier Airlines": [
    "Frontier"
  ],

  "British Airways": [
    "BA"
  ],

  "Air France": [
    "AF"
  ],

  "All Nippon Airways": [
    "ANA"
  ],

  "Japan Airlines": [
    "JAL"
  ],

  "Aeroméxico": [
    "Aeromexico" // Without accent
  ],

  // Financial Services - accent normalization
  "American Express": [
    "Amex",
    "AmEx"
  ],

  "JPMorgan Chase": [
    "Chase",
    "JP Morgan",
    "JPMorgan"
  ],

  "Bank of America": [
    "BofA",
    "BoA"
  ],

  "Wells Fargo": [
    "WF"
  ],

  "Goldman Sachs": [
    "GS"
  ],

  "Morgan Stanley": [
    "MS"
  ],

  "Charles Schwab": [
    "Schwab"
  ],

  "TD Ameritrade": [
    "TDA"
  ],

  "Telefónica": [
    "Telefonica" // Without accent
  ],

  // Entertainment & Media - accent normalization
  "Warner Bros.": [
    "Warner Brothers",
    "WB"
  ],

  "Universal Studios": [
    "Universal"
  ],

  "20th Century Studios": [
    "20th Century Fox" // Former name
  ],

  "DreamWorks": [
    "Dream Works" // Two words
  ],

  "DC Comics": [
    "DC"
  ],

  "Amazon Prime Video": [
    "Prime Video",
    "Amazon Prime"
  ],

  "Disney+": [
    "Disney Plus"
  ],

  "Paramount+": [
    "Paramount Plus"
  ],

  "Apple TV+": [
    "Apple TV Plus"
  ],

  "Univisión": [
    "Univision" // Without accent
  ],

  // Gaming - accent normalization
  "Electronic Arts": [
    "EA"
  ],

  "Take-Two Interactive": [
    "Take-Two",
    "Take Two"
  ],

  "Rockstar Games": [
    "Rockstar"
  ],

  "Blizzard Entertainment": [
    "Blizzard"
  ],

  "Riot Games": [
    "Riot"
  ],

  "CD Projekt": [
    "CD Projekt Red" // Subsidiary
  ],

  "Square Enix": [
    "SquareEnix" // One word
  ],

  // Telecommunications - comprehensive accent normalization
  "AT&T": [
    "AT and T",
    "American Telephone and Telegraph" // Original name
  ],

  "T-Mobile": [
    "T Mobile", // Without hyphen
    "TMobile" // One word
  ]
};
