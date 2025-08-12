// Normalization data (grouped catch-all variations)
// Maps user input variations to the official country name
export const countriesNormalization = {
  // United States - common abbreviations and variations
  "United States of America": [
    "United States",
    "USA",
    "U.S.A.",
    "U.S.A",
    "US",
    "U.S.",
    "U.S",
    "America"
  ],

  // United Kingdom - official name and common variations
  "United Kingdom": [
    "United Kingdom of Great Britain and Northern Ireland",
    "UK",
    "U.K.",
    "U.K",
    "Great Britain",
    "Britain"
  ],

  // Major Countries - common abbreviations
  "Russia": [
    "Russian Federation"
  ],
  
  "China": [
    "People's Republic of China",
    "PRC"
  ],

  // Netherlands - common but incorrect name
  "Netherlands": [
    "Holland" // Common but technically incorrect
  ],

  // Myanmar - former name
  "Myanmar": [
    "Burma" // Former name still commonly used
  ],

  // Czech Republic - new short name
  "Czech Republic": [
    "Czechia" // New short name
  ],

  // South Korea vs North Korea
  "South Korea": [
    "Republic of Korea",
    "Korea" // Commonly refers to South Korea
  ],
  
  "North Korea": [
    "Democratic People's Republic of Korea",
    "DPRK"
  ],

  // Taiwan - official name
  "Taiwan": [
    "Republic of China" // Official name
  ],

  // UAE - abbreviations
  "United Arab Emirates": [
    "UAE",
    "U.A.E.",
    "Emirates"
  ],

  // PNG - abbreviation
  "Papua New Guinea": [
    "PNG"
  ],

  // CAR - abbreviation
  "Central African Republic": [
    "CAR"
  ],

  // Congo countries - disambiguation
  "Democratic Republic of the Congo": [
    "DRC",
    "Congo" // Usually refers to DRC
  ],
  
  "Republic of the Congo": [
    "Congo-Brazzaville"
  ],

  // Ivory Coast - official French name
  "Ivory Coast": [
    "Côte d'Ivoire", // Official French name
    "Cote d'Ivoire" // Without accent
  ],

  // São Tomé and Príncipe - accent variations
  "São Tomé and Príncipe": [
    "Sao Tome and Principe" // Without accents
  ],

  // Eswatini - former name
  "Eswatini": [
    "Swaziland" // Former name
  ],

  // Cape Verde - Portuguese name
  "Cape Verde": [
    "Cabo Verde" // Official Portuguese name
  ],

  // Vietnam - official UN spelling
  "Vietnam": [
    "Viet Nam" // Official UN spelling
  ],

  // Micronesia - full name
  "Micronesia": [
    "Federated States of Micronesia"
  ],

  // Iran - official name
  "Iran": [
    "Islamic Republic of Iran"
  ],

  // Syria - official name
  "Syria": [
    "Syrian Arab Republic"
  ],

  // Macedonia - former name
  "North Macedonia": [
    "Macedonia" // Former name
  ],

  // Simple variations (countries with straightforward alternatives)
  "Vatican City": ["Vatican"],
  "Hong Kong": ["HK"],
  "Macau": ["Macao"],
  "Saint Lucia": ["St. Lucia"],
  "Saint Vincent and the Grenadines": ["St. Vincent and the Grenadines"],
  "Saint Kitts and Nevis": ["St. Kitts and Nevis"],
  "Bosnia and Herzegovina": ["Bosnia"],
  "Trinidad and Tobago": ["T&T"],
  "Antigua and Barbuda": ["Antigua"],
  "Marshall Islands": ["Marshalls"],
  "Solomon Islands": ["Solomons"],
  "Dominican Republic": ["DR"],
  "El Salvador": ["Salvador"],
  "Costa Rica": ["CR"],
  "New Zealand": ["NZ"],
  "South Africa": ["RSA"],
  "Saudi Arabia": ["KSA"]
};
