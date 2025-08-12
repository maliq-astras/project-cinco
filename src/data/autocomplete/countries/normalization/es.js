// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish country name
// IMPORTANT: All accent variations are normalized to prevent wrong answers
export const countriesNormalization = {
  // Challenge countries - accent normalization
  "Canadá": [
    "Canada" // Without accent
  ],
  
  "Japón": [
    "Japon" // Without accent
  ],
  
  "México": [
    "Mexico" // Without accent
  ],
  
  "Sudáfrica": [
    "Sudafrica" // Without accent
  ],

  // Estados Unidos - common abbreviations and variations
  "Estados Unidos de América": [
    "Estados Unidos de America", // Without accent
    "Estados Unidos",
    "EE.UU.",
    "EEUU",
    "EUA",
    "América",
    "America" // Without accent
  ],

  // Reino Unido - official name and common variations
  "Reino Unido": [
    "Reino Unido de Gran Bretaña e Irlanda del Norte",
    "Reino Unido de Gran Bretana e Irlanda del Norte", // Without accent
    "Gran Bretaña",
    "Gran Bretana" // Without accent
  ],

  // Major Countries - accent normalization
  "Rusia": [
    "Federación Rusa",
    "Federacion Rusa" // Without accent
  ],
  
  "China": [
    "República Popular China",
    "Republica Popular China" // Without accent
  ],

  // European Countries - comprehensive accent normalization
  "España": [
    "Espana" // Without accent
  ],
  
  "Países Bajos": [
    "Paises Bajos", // Without accent
    "Holanda" // Common but technically incorrect
  ],
  
  "Bélgica": [
    "Belgica" // Without accent
  ],
  
  "Hungría": [
    "Hungria" // Without accent
  ],
  
  "Turquía": [
    "Turquia" // Without accent
  ],

  // Asian Countries - accent normalization
  "Corea del Sur": [
    "República de Corea",
    "Republica de Corea", // Without accent
    "Corea" // Commonly refers to South Korea
  ],
  
  "Corea del Norte": [
    "República Popular Democrática de Corea",
    "Republica Popular Democratica de Corea" // Without accents
  ],
  
  "Taiwán": [
    "Taiwan", // Without accent
    "República de China",
    "Republica de China" // Without accent
  ],
  
  "Kazajistán": [
    "Kazajistan" // Without accent
  ],
  
  "Uzbekistán": [
    "Uzbekistan" // Without accent
  ],
  
  "Kirguistán": [
    "Kirguistan" // Without accent
  ],
  
  "Tayikistán": [
    "Tayikistan" // Without accent
  ],
  
  "Turkmenistán": [
    "Turkmenistan" // Without accent
  ],
  
  "Afganistán": [
    "Afganistan" // Without accent
  ],
  
  "Pakistán": [
    "Pakistan" // Without accent
  ],
  
  "Bangladés": [
    "Bangladesh" // Without accent
  ],
  
  "Bután": [
    "Butan" // Without accent
  ],
  
  "Brunéi": [
    "Brunei" // Without accent
  ],

  // Middle Eastern Countries - accent normalization
  "Arabia Saudí": [
    "Arabia Saudi", // Without accent
    "Arabia Saudita" // Alternative
  ],
  
  "Irán": [
    "Iran", // Without accent
    "República Islámica de Irán",
    "Republica Islamica de Iran" // Without accents
  ],
  
  "Líbano": [
    "Libano" // Without accent
  ],
  
  "Baréin": [
    "Bahrain" // Without accent
  ],
  
  "Emiratos Árabes Unidos": [
    "Emiratos Arabes Unidos", // Without accent
    "EAU"
  ],
  
  "Omán": [
    "Oman" // Without accent
  ],

  // African Countries - accent normalization
  "Kenia": [
    "Kenya" // Alternative spelling
  ],
  
  "Etiopía": [
    "Etiopia" // Without accent
  ],
  
  "Túnez": [
    "Tunez" // Without accent
  ],
  
  "Sudán": [
    "Sudan" // Without accent
  ],
  
  "Sudán del Sur": [
    "Sudan del Sur" // Without accent
  ],
  
  "Níger": [
    "Niger" // Without accent
  ],
  
  "Malí": [
    "Mali" // Without accent
  ],
  
  "Benín": [
    "Benin" // Without accent
  ],
  
  "Camerún": [
    "Camerun" // Without accent
  ],
  
  "República Centroafricana": [
    "Republica Centroafricana" // Without accent
  ],
  
  "República Democrática del Congo": [
    "Republica Democratica del Congo", // Without accents
    "RDC",
    "Congo" // Usually refers to DRC
  ],
  
  "República del Congo": [
    "Republica del Congo", // Without accent
    "Congo-Brazzaville"
  ],
  
  "Gabón": [
    "Gabon" // Without accent
  ],
  
  "Santo Tomé y Príncipe": [
    "Santo Tome y Principe" // Without accents
  ],

  // South American Countries - accent normalization
  "Perú": [
    "Peru" // Without accent
  ],
  
  "Panamá": [
    "Panama" // Without accent
  ],

  // Caribbean Countries - accent normalization
  "Haití": [
    "Haiti" // Without accent
  ],
  
  "República Dominicana": [
    "Republica Dominicana" // Without accent
  ],
  
  "Santa Lucía": [
    "Santa Lucia" // Without accent
  ],
  
  "San Cristóbal y Nieves": [
    "San Cristobal y Nieves" // Without accent
  ],

  // Oceania Countries - accent normalization
  "Nueva Zelanda": [
    "Nueva Zelandia" // Alternative
  ],
  
  "Papúa Nueva Guinea": [
    "Papua Nueva Guinea" // Without accent
  ],
  
  "Fiyi": [
    "Fiji" // Alternative spelling
  ],
  
  "Islas Salomón": [
    "Islas Salomon" // Without accent
  ],

  // Other countries - accent normalization
  "Mónaco": [
    "Monaco" // Without accent
  ],

  // Myanmar - former name
  "Myanmar": [
    "Birmania" // Former name still commonly used
  ],

  // Czech Republic - new short name
  "República Checa": [
    "Republica Checa", // Without accent
    "Chequia" // New short name
  ],

  // UAE - abbreviations
  "Emiratos Árabes Unidos": [
    "Emiratos Arabes Unidos", // Without accent
    "EAU"
  ],

  // PNG - abbreviation
  "Papúa Nueva Guinea": [
    "Papua Nueva Guinea", // Without accent
    "PNG"
  ],

  // Ivory Coast - official French name
  "Costa de Marfil": [
    "Côte d'Ivoire", // Official French name
    "Cote d'Ivoire" // Without accent
  ],

  // Eswatini - former name
  "Esuatini": [
    "Suazilandia" // Former name
  ],

  // Macedonia - former name
  "Macedonia del Norte": [
    "Macedonia" // Former name
  ],

  // Simple variations (countries with straightforward alternatives)
  "Ciudad del Vaticano": ["Vaticano"],
  "Botsuana": ["Botswana"],
  "Zimbabue": ["Zimbabwe"],
  "Mauricio": ["Mauritius"],
  "Comoras": ["Comoros"],
  "Surinam": ["Suriname"],
  "Belice": ["Belize"],
  "Chipre": ["Cyprus"]
};
