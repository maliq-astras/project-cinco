// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish TV show name
// IMPORTANT: All accent variations normalized + English titles recognized + abbreviations
export const tvShowsNormalization = {
  // Challenge shows - English titles + accent normalization
  "American Horror Story": [
    "Historia de Horror Americana",
    "AHS"
  ],

  "Avatar: El Último Maestro Aire": [
    "Avatar: El Ultimo Maestro Aire", // Without accent
    "Avatar",
    "ATLA",
    "El Último Maestro Aire",
    "El Ultimo Maestro Aire", // Without accent
    "Avatar: The Last Airbender",
    "The Last Airbender"
  ],

  "Grey's Anatomy": [
    "Anatomía de Grey",
    "Anatomia de Grey", // Without accent
    "GA"
  ],

  "Loki": [
    "Marvel's Loki"
  ],

  "Lost": [
    "Perdidos"
  ],

  "Gambito de Dama": [
    "The Queen's Gambit",
    "Queens Gambit"
  ],

  "Bob Esponja": [
    "SpongeBob SquarePants",
    "Spongebob",
    "SpongeBob"
  ],

  "Ted Lasso": [
    "Ted Lasso Show"
  ],

  "Los Simpson": [
    "The Simpsons",
    "Simpsons"
  ],

  "Westworld": [
    "Mundo del Oeste"
  ],

  // Classic Sitcoms with Spanish titles + English recognition
  "Friends": [
    "Amigos",
    "F.R.I.E.N.D.S."
  ],

  "Seinfeld": [
    "The Seinfeld Show"
  ],

  "The Office": [
    "La Oficina"
  ],

  "El Príncipe del Rap": [
    "The Fresh Prince of Bel-Air",
    "Fresh Prince",
    "El Principe del Rap" // Without accent
  ],

  "Tres por Tres": [
    "Full House",
    "Fullhouse"
  ],

  "Cosas de Casa": [
    "Family Matters"
  ],

  "Dos Hombres y Medio": [
    "Two and a Half Men",
    "2.5 Men",
    "2 and a Half Men"
  ],

  "Cómo Conocí a Vuestra Madre": [
    "Como Conoci a Vuestra Madre", // Without accents
    "How I Met Your Mother",
    "HIMYM"
  ],

  "The Big Bang Theory": [
    "La Teoría del Big Bang",
    "La Teoria del Big Bang", // Without accent
    "BBT",
    "TBBT"
  ],

  "Parks and Recreation": [
    "Parques y Recreación",
    "Parques y Recreacion", // Without accent
    "Parks and Rec",
    "P&R"
  ],

  "It's Always Sunny in Philadelphia": [
    "Siempre Hay Sol en Filadelfia",
    "Always Sunny",
    "IASIP"
  ],

  "Los Años Maravillosos": [
    "Los Anos Maravillosos", // Without tilde
    "The Wonder Years"
  ],

  "Malcolm el de en Medio": [
    "Malcolm in the Middle",
    "Malcolm",
    "MITM"
  ],

  "Lo Que Hacemos en las Sombras": [
    "What We Do in the Shadows",
    "WWDITS"
  ],

  "Brooklyn Nine-Nine": [
    "Brooklyn Nueve-Nueve",
    "Brooklyn 99",
    "B99"
  ],

  "Padre de Familia": [
    "Family Guy",
    "FG"
  ],

  "Rick y Morty": [
    "Rick and Morty",
    "R&M"
  ],

  "El Rey de la Colina": [
    "King of the Hill",
    "KOTH"
  ],

  "Beavis y Butt-Head": [
    "Beavis and Butt-Head",
    "Beavis and Butthead"
  ],

  // Drama Series with Spanish titles
  "Breaking Bad": [
    "Metástasis",
    "Metastasis", // Without accent
    "BB",
    "BrBa"
  ],

  "Better Call Saul": [
    "Mejor Llama a Saul",
    "BCS"
  ],

  "Los Soprano": [
    "The Sopranos",
    "Sopranos"
  ],

  "Juego de Tronos": [
    "Game of Thrones",
    "GOT"
  ],

  "Héroes": [
    "Heroes", // Without accent
    "Heroes TV Show"
  ],

  "El Ala Oeste de la Casa Blanca": [
    "The West Wing",
    "West Wing",
    "TWW"
  ],

  "Expediente X": [
    "The X-Files",
    "X-Files",
    "XFiles"
  ],

  "La Ley y el Orden": [
    "Law & Order",
    "Law and Order",
    "L&O"
  ],

  "CSI: Las Vegas": [
    "CSI: Crime Scene Investigation",
    "CSI"
  ],

  "CSI: Nueva York": [
    "CSI: NY",
    "CSI New York"
  ],

  "Mentes Criminales": [
    "Criminal Minds",
    "CM"
  ],

  "El Mentalista": [
    "The Mentalist",
    "Mentalist"
  ],

  "Dr. House": [
    "House",
    "House MD"
  ],

  "Urgencias": [
    "ER",
    "Emergency Room"
  ],

  "Hijos de la Anarquía": [
    "Hijos de la Anarquia", // Without accent
    "Sons of Anarchy",
    "SOA"
  ],

  "A Dos Metros Bajo Tierra": [
    "Six Feet Under",
    "SFU"
  ],

  "Sexo en Nueva York": [
    "Sex and the City",
    "SATC"
  ],

  "Los Tudor": [
    "The Tudors",
    "Tudors"
  ],

  "Vikingos": [
    "Vikings"
  ],

  // Reality TV with Spanish titles
  "Supervivientes": [
    "Survivor"
  ],

  "Gran Hermano": [
    "Big Brother",
    "BB"
  ],

  "La Voz": [
    "The Voice",
    "Voice"
  ],

  "Bailando con las Estrellas": [
    "Dancing with the Stars",
    "DWTS"
  ],

  "El Precio Justo": [
    "The Price Is Right",
    "Price is Right",
    "TPIR"
  ],

  "La Ruleta de la Fortuna": [
    "Wheel of Fortune",
    "WOF"
  ],

  "¡Jeopardy!": [
    "Jeopardy!",
    "Jeopardy"
  ],

  "¿Quién Quiere Ser Millonario?": [
    "Who Wants to Be a Millionaire",
    "Quien Quiere Ser Millonario", // Without accents
    "WWTBAM"
  ],

  "La Isla del Amor": [
    "Love Island",
    "LI"
  ],

  "Al Día con las Kardashian": [
    "Al Dia con las Kardashian", // Without accent
    "Keeping Up with the Kardashians",
    "KUWTK"
  ],

  // Kids Shows with Spanish titles
  "Plaza Sésamo": [
    "Plaza Sesamo", // Without accent
    "Sesame Street",
    "SS"
  ],

  "Las Pistas de Blue": [
    "Blue's Clues",
    "Blues Clues"
  ],

  "Dora la Exploradora": [
    "Dora the Explorer",
    "Dora"
  ],

  "¡Vamos, Diego, Vamos!": [
    "Vamos, Diego, Vamos", // Without exclamations
    "Go, Diego, Go!",
    "Go Diego Go"
  ],

  "Los Padrinos Mágicos": [
    "Los Padrinos Magicos", // Without accent
    "The Fairly OddParents",
    "Fairly OddParents",
    "FOP"
  ],

  "¡Oye, Arnold!": [
    "Oye, Arnold", // Without exclamations
    "Hey Arnold!",
    "Hey Arnold"
  ],

  "La Leyenda de Korra": [
    "The Legend of Korra",
    "Legend of Korra",
    "LOK",
    "Korra"
  ],

  "Las Tortugas Ninja": [
    "Teenage Mutant Ninja Turtles",
    "TMNT"
  ],

  "Jóvenes Titanes": [
    "Jovenes Titanes", // Without accent
    "Teen Titans",
    "TT"
  ],

  "Batman: La Serie Animada": [
    "Batman: The Animated Series",
    "Batman TAS",
    "BTAS"
  ],

  "Superman: La Serie Animada": [
    "Superman: The Animated Series",
    "Superman TAS",
    "STAS"
  ],

  "Batman del Futuro": [
    "Batman Beyond",
    "BB"
  ],

  "Liga de la Justicia": [
    "Justice League",
    "JL"
  ],

  "Liga de la Justicia Ilimitada": [
    "Justice League Unlimited",
    "JLU"
  ],

  "He-Man y los Amos del Universo": [
    "He-Man and the Masters of the Universe",
    "He-Man",
    "MOTU"
  ],

  "My Little Pony: La Magia de la Amistad": [
    "My Little Pony: Friendship Is Magic",
    "MLP FIM"
  ],

  "Las Chicas Superpoderosas": [
    "Powerpuff Girls",
    "PPG"
  ],

  "El Laboratorio de Dexter": [
    "Dexter's Laboratory",
    "Dexters Laboratory",
    "DL"
  ],

  "Ed, Edd y Eddy": [
    "Ed, Edd n Eddy",
    "Ed Edd n Eddy",
    "EEE"
  ],

  "Coraje el Perro Cobarde": [
    "Courage the Cowardly Dog",
    "CTCD"
  ],

  "Las Sombrías Aventuras de Billy y Mandy": [
    "Las Sombrias Aventuras de Billy y Mandy", // Without accent
    "The Grim Adventures of Billy & Mandy",
    "Billy and Mandy"
  ],

  "La Mansión Foster para Amigos Imaginarios": [
    "La Mansion Foster para Amigos Imaginarios", // Without accent
    "Foster's Home for Imaginary Friends",
    "Fosters Home",
    "FHFIF"
  ],

  "Ben 10: Fuerza Alienígena": [
    "Ben 10: Fuerza Alienigena", // Without accent
    "Ben 10: Alien Force",
    "Ben 10 AF"
  ],

  "Hora de Aventura": [
    "Adventure Time",
    "AT"
  ],

  "Un Show Más": [
    "Un Show Mas", // Without accent
    "Regular Show",
    "RS"
  ],

  "El Increíble Mundo de Gumball": [
    "El Increible Mundo de Gumball", // Without accent
    "The Amazing World of Gumball",
    "Gumball",
    "TAWOG"
  ],

  "Somos Osos": [
    "We Bare Bears",
    "WBB"
  ],

  "Tío Grandpa": [
    "Tio Grandpa", // Without accent
    "Uncle Grandpa",
    "UG"
  ],

  "Star vs. Las Fuerzas del Mal": [
    "Star vs. The Forces of Evil",
    "Star vs Forces of Evil",
    "SVTFOE"
  ],

  "Eso es Tan Raven": [
    "That's So Raven",
    "TSR"
  ],

  "Zack y Cody: Gemelos en Acción": [
    "Zack y Cody: Gemelos en Accion", // Without accent
    "The Suite Life of Zack & Cody",
    "Suite Life",
    "TSLOZC"
  ],

  "Zack y Cody: Gemelos a Bordo": [
    "The Suite Life on Deck",
    "Suite Life on Deck",
    "TSLOD"
  ],

  "Los Hechiceros de Waverly Place": [
    "Wizards of Waverly Place",
    "WOWP"
  ],

  "Buena Suerte Charlie": [
    "Good Luck Charlie",
    "GLC"
  ],

  // Star Trek with Spanish titles
  "Star Trek: La Serie Original": [
    "Star Trek: The Original Series",
    "TOS",
    "Star Trek TOS"
  ],

  "Star Trek: La Nueva Generación": [
    "Star Trek: La Nueva Generacion", // Without accent
    "Star Trek: The Next Generation",
    "TNG",
    "Star Trek TNG"
  ],

  "Star Trek: Espacio Profundo Nueve": [
    "Star Trek: Deep Space Nine",
    "DS9",
    "Star Trek DS9"
  ],

  // Netflix Originals with Spanish titles
  "La Casa de Papel": [
    "Money Heist"
  ],

  "Élite": [
    "Elite", // Without accent
    "Netflix Elite"
  ],

  "Los Bridgerton": [
    "Bridgerton",
    "BG"
  ],

  "Emily en París": [
    "Emily en Paris", // Without accent
    "Emily in Paris",
    "EIP"
  ],

  "El Príncipe Dragón": [
    "El Principe Dragon", // Without accents
    "The Dragon Prince",
    "Dragon Prince",
    "TDP"
  ],

  "She-Ra y las Princesas del Poder": [
    "She-Ra and the Princesses of Power",
    "She-Ra",
    "SPOP"
  ],

  "Kipo y la Era de las Bestias Mágicas": [
    "Kipo y la Era de las Bestias Magicas", // Without accent
    "Kipo and the Age of Wonderbeasts",
    "Kipo"
  ],

  "El Cuento de la Criada": [
    "The Handmaid's Tale",
    "Handmaids Tale",
    "THT"
  ],

  "La Maravillosa Sra. Maisel": [
    "The Marvelous Mrs. Maisel",
    "Mrs. Maisel",
    "TMMM"
  ],

  // Spanish/Latin Shows with accent normalization
  "El Chavo del Ocho": [
    "Chavo del Ocho",
    "El Chavo"
  ],

  "El Chapulín Colorado": [
    "El Chapulin Colorado", // Without accent
    "Chapulín Colorado",
    "Chapulin Colorado" // Without accent
  ],

  "La Casa de las Flores": [
    "House of Flowers"
  ],

  "Luis Miguel: La Serie": [
    "Luis Miguel: La Serie"
  ],

  "Selena: La Serie": [
    "Selena: The Series"
  ],

  "Hernán": [
    "Hernan" // Without accent
  ],

  "Las Chicas del Cable": [
    "Cable Girls"
  ],

  "Paquita Salas": [
    "PS"
  ],

  "Valeria": [
    "Netflix Valeria"
  ],

  "Yo Soy Betty, la Fea": [
    "Betty la Fea",
    "Ugly Betty"
  ],

  "Pasión de Gavilanes": [
    "Pasion de Gavilanes" // Without accent
  ],

  "Café con Aroma de Mujer": [
    "Cafe con Aroma de Mujer" // Without accent
  ],

  "El Patrón del Mal": [
    "El Patron del Mal", // Without accent
    "Pablo Escobar: El Patrón del Mal",
    "Pablo Escobar: El Patron del Mal" // Without accent
  ],

  "La Niña": [
    "La Nina" // Without tilde
  ],

  "Bolívar": [
    "Bolivar" // Without accent
  ],

  "Aquí no Hay Quien Viva": [
    "Aqui no Hay Quien Viva" // Without accent
  ],

  "Cuéntame Cómo Pasó": [
    "Cuentame Como Paso" // Without accents
  ],

  "Física o Química": [
    "Fisica o Quimica" // Without accents
  ],

  "Médico de Familia": [
    "Medico de Familia" // Without accent
  ],

  "Aída": [
    "Aida" // Without accent
  ],

  "Periodistas": [
    "Journalists"
  ],

  "Policías": [
    "Policias" // Without accent
  ],

  "Águila Roja": [
    "Aguila Roja" // Without accent
  ],

  "Víctor Ros": [
    "Victor Ros" // Without accent
  ],

  "Néboa": [
    "Neboa" // Without accent
  ],

  "Antidisturbios": [
    "Riot Police"
  ],

  // Additional common abbreviations and variations
  "American Horror Story": [
    "AHS"
  ],

  "Breaking Bad": [
    "BB"
  ],

  "Game of Thrones": [
    "GOT"
  ],

  "The Walking Dead": [
    "TWD"
  ],

  "Stranger Things": [
    "ST"
  ],

  "Orange Is the New Black": [
    "OITNB"
  ],

  "House of Cards": [
    "HOC"
  ],

  "Better Call Saul": [
    "BCS"
  ],

  "The Big Bang Theory": [
    "TBBT"
  ],

  "How I Met Your Mother": [
    "HIMYM"
  ],

  "It's Always Sunny in Philadelphia": [
    "IASIP"
  ],

  "Brooklyn Nine-Nine": [
    "B99"
  ],

  "Parks and Recreation": [
    "P&R"
  ],

  "The Office": [
    "Office"
  ],

  "Saturday Night Live": [
    "SNL"
  ],

  "Law & Order: SVU": [
    "SVU"
  ],

  "Criminal Minds": [
    "CM"
  ],

  "CSI: Crime Scene Investigation": [
    "CSI"
  ],

  "NCIS": [
    "Naval Criminal Investigative Service"
  ],

  "Grey's Anatomy": [
    "GA"
  ],

  "The X-Files": [
    "X-Files"
  ],

  "Star Trek: The Next Generation": [
    "TNG"
  ],

  "Star Trek: Deep Space Nine": [
    "DS9"
  ],

  "The Simpsons": [
    "Simpsons"
  ],

  "Family Guy": [
    "FG"
  ],

  "South Park": [
    "SP"
  ],

  "Rick and Morty": [
    "R&M"
  ],

  "Adventure Time": [
    "AT"
  ],

  "Regular Show": [
    "RS"
  ],

  "Steven Universe": [
    "SU"
  ],

  "Gravity Falls": [
    "GF"
  ],

  "Avatar: The Last Airbender": [
    "ATLA"
  ],

  "The Legend of Korra": [
    "LOK"
  ],

  "Teen Titans": [
    "TT"
  ],

  "Justice League": [
    "JL"
  ],

  "Batman: The Animated Series": [
    "BTAS"
  ],

  "Teenage Mutant Ninja Turtles": [
    "TMNT"
  ],

  "The Fairly OddParents": [
    "FOP"
  ],

  "SpongeBob SquarePants": [
    "Spongebob"
  ],

  "Powerpuff Girls": [
    "PPG"
  ],

  "Dexter's Laboratory": [
    "DL"
  ],

  "Ed, Edd n Eddy": [
    "EEE"
  ],

  "Courage the Cowardly Dog": [
    "CTCD"
  ],

  "Foster's Home for Imaginary Friends": [
    "FHFIF"
  ],

  "The Amazing World of Gumball": [
    "TAWOG"
  ],

  "We Bare Bears": [
    "WBB"
  ],

  "Star vs. The Forces of Evil": [
    "SVTFOE"
  ],

  "The Loud House": [
    "TLH"
  ],

  "iCarly": [
    "i Carly"
  ],

  "Drake & Josh": [
    "Drake and Josh"
  ],

  "That's So Raven": [
    "TSR"
  ],

  "The Suite Life of Zack & Cody": [
    "TSLOZC"
  ],

  "Hannah Montana": [
    "HM"
  ],

  "Wizards of Waverly Place": [
    "WOWP"
  ],

  "Good Luck Charlie": [
    "GLC"
  ],

  "Sesame Street": [
    "SS"
  ],

  "Blue's Clues": [
    "Blues Clues"
  ],

  "Dora the Explorer": [
    "Dora"
  ],

  "PAW Patrol": [
    "Paw Patrol"
  ],

  "My Little Pony: Friendship Is Magic": [
    "MLP FIM"
  ],

  "Ben 10": [
    "B10"
  ],

  "Young Justice": [
    "YJ"
  ],

  "Generator Rex": [
    "GR"
  ],

  "The Price Is Right": [
    "TPIR"
  ],

  "Wheel of Fortune": [
    "WOF"
  ],

  "Jeopardy!": [
    "Jeopardy"
  ],

  "Who Wants to Be a Millionaire": [
    "WWTBAM"
  ],

  "Dancing with the Stars": [
    "DWTS"
  ],

  "America's Got Talent": [
    "AGT"
  ],

  "American Idol": [
    "AI"
  ],

  "The Voice": [
    "Voice"
  ],

  "Big Brother": [
    "BB"
  ],

  "Survivor": [
    "CBS Survivor"
  ],

  "The Amazing Race": [
    "TAR"
  ],

  "Project Runway": [
    "PR"
  ],

  "Top Chef": [
    "TC"
  ],

  "Hell's Kitchen": [
    "HK"
  ],

  "MasterChef": [
    "MC"
  ],

  "The Great British Bake Off": [
    "GBBO"
  ],

  "Keeping Up with the Kardashians": [
    "KUWTK"
  ],

  "The Real Housewives of Atlanta": [
    "RHOA"
  ],

  "The Real Housewives of Beverly Hills": [
    "RHOBH"
  ],

  "Jersey Shore": [
    "JS"
  ],

  "The Real World": [
    "TRW"
  ],

  "Teen Mom": [
    "TM"
  ],

  "16 and Pregnant": [
    "16 & Pregnant"
  ],

  "Catfish: The TV Show": [
    "Catfish"
  ],

  "Are You the One?": [
    "AYTO"
  ],

  "Love Island": [
    "LI"
  ],

  "Too Hot to Handle": [
    "THTH"
  ],

  "The Circle": [
    "Circle"
  ],

  "Selling Sunset": [
    "SS"
  ],

  "Say Yes to the Dress": [
    "SYTTD"
  ],

  "What Not to Wear": [
    "WNTW"
  ],

  "Property Brothers": [
    "PB"
  ],

  "House Hunters": [
    "HH"
  ],

  "Fixer Upper": [
    "FU"
  ],

  "Flip or Flop": [
    "FOF"
  ],

  "This Old House": [
    "TOH"
  ],

  "Trading Spaces": [
    "TS"
  ],

  "Queer Eye": [
    "QE"
  ],

  "The Tonight Show Starring Jimmy Fallon": [
    "Tonight Show"
  ],

  "The Late Show with Stephen Colbert": [
    "Late Show"
  ],

  "Jimmy Kimmel Live!": [
    "JKL"
  ],

  "Late Night with Seth Meyers": [
    "Late Night"
  ],

  "The Daily Show": [
    "TDS"
  ],

  "The Colbert Report": [
    "TCR"
  ],

  "Last Week Tonight with John Oliver": [
    "LWT"
  ],

  "Real Time with Bill Maher": [
    "Real Time"
  ],

  "The Ellen DeGeneres Show": [
    "Ellen Show"
  ],

  "The Oprah Winfrey Show": [
    "Oprah"
  ],

  "Good Morning America": [
    "GMA"
  ],

  "Today": [
    "Today Show"
  ],

  "The View": [
    "View"
  ],

  "Judge Judy": [
    "JJ"
  ],

  "The People's Court": [
    "Peoples Court"
  ],

  "Dr. Phil": [
    "Phil McGraw"
  ],

  "The Dr. Oz Show": [
    "Dr. Oz"
  ],

  "Maury": [
    "Maury Povich"
  ],

  "The Jerry Springer Show": [
    "Jerry Springer"
  ]
};
