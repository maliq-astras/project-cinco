// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish historical figure name
// IMPORTANT: All accent variations are normalized to prevent wrong answers
export const historyNormalization = {
  // Challenge figures - accent normalization and variations
  "Abraham Lincoln": [
    "Abe Lincoln",
    "Lincoln",
    "El Gran Emancipador"
  ],

  "Albert Einstein": [
    "Einstein"
  ],

  "Alexander Hamilton": [
    "Hamilton"
  ],

  "Amelia Earhart": [
    "Earhart"
  ],

  "Cleopatra": [
    "Cleopatra VII",
    "Reina Cleopatra"
  ],

  "Frida Kahlo": [
    "Kahlo"
  ],

  "Juana de Arco": [
    "Joan of Arc", // English name
    "Juana",
    "La Doncella de Orleans",
    "Santa Juana"
  ],

  "Leonardo da Vinci": [
    "da Vinci",
    "Leonardo",
    "El Maestro del Renacimiento"
  ],

  "Rosa Parks": [
    "Parks",
    "La Madre del Movimiento de Derechos Civiles"
  ],

  "Winston Churchill": [
    "Churchill"
  ],

  // Ancient World Leaders - comprehensive accent normalization
  "Julio César": [
    "Julio Cesar", // Without accent
    "César",
    "Cesar", // Without accent
    "Julius Caesar", // English name
    "Cayo Julio César",
    "Cayo Julio Cesar" // Without accent
  ],

  "Augusto": [
    "César Augusto",
    "Cesar Augusto", // Without accent
    "Octavio",
    "Augustus", // English name
    "Emperador Augusto"
  ],

  "Marco Aurelio": [
    "El Emperador Filósofo",
    "El Emperador Filosofo", // Without accent
    "Marcus Aurelius" // English name
  ],

  "Alejandro Magno": [
    "Alejandro",
    "Alexander the Great", // English name
    "Alejandro III de Macedonia"
  ],

  "Aníbal": [
    "Anibal", // Without accent
    "Hannibal" // English name
  ],

  "Tutankamón": [
    "Tutankamon", // Without accent
    "Rey Tut",
    "Tut",
    "Tutankhamun" // English name
  ],

  "Ramsés II": [
    "Ramses II", // Without accent
    "Ramsés el Grande",
    "Ramses el Grande", // Without accent
    "Ozimandias"
  ],

  "Ciro el Grande": [
    "Ciro",
    "Cyrus the Great" // English name
  ],

  "Nabucodonosor II": [
    "Nabucodonosor",
    "Rey Nabucodonosor",
    "Nebuchadnezzar II" // English name
  ],

  "Akenatón": [
    "Akenaton", // Without accent
    "Akhenaten" // English name
  ],

  // Medieval Figures - accent normalization
  "Carlomagno": [
    "Carlos el Grande",
    "Charlemagne" // English name
  ],

  "Guillermo el Conquistador": [
    "Guillermo I",
    "William the Conqueror" // English name
  ],

  "Ricardo Corazón de León": [
    "Ricardo Corazon de Leon", // Without accents
    "Ricardo I",
    "Richard the Lionheart" // English name
  ],

  "Gengis Kan": [
    "Temujin",
    "El Gran Kan",
    "Genghis Khan" // English name
  ],

  "Kublai Kan": [
    "Kublai Khan" // English name
  ],

  "Tomás de Aquino": [
    "Tomas de Aquino", // Without accent
    "Aquino",
    "Santo Tomás de Aquino",
    "Santo Tomas de Aquino", // Without accent
    "Thomas Aquinas" // English name
  ],

  "Francisco de Asís": [
    "Francisco de Asis", // Without accent
    "San Francisco",
    "Francis of Assisi" // English name
  ],

  // Renaissance & Early Modern - accent normalization
  "Miguel Ángel": [
    "Miguel Angel", // Without accent
    "Michelangelo" // English/Italian name
  ],

  "Cristóbal Colón": [
    "Cristobal Colon", // Without accents
    "Colón",
    "Colon", // Without accent
    "Christopher Columbus" // English name
  ],

  "Fernando de Magallanes": [
    "Magallanes",
    "Ferdinand Magellan" // English name
  ],

  "Hernán Cortés": [
    "Hernan Cortes", // Without accents
    "Cortés",
    "Cortes", // Without accent
    "Hernando Cortés",
    "Hernando Cortes" // Without accent
  ],

  "Américo Vespucio": [
    "Americo Vespucio", // Without accent
    "Amerigo Vespucci" // English/Italian name
  ],

  // Scientific Revolution & Enlightenment - accent normalization
  "Nicolás Copérnico": [
    "Nicolas Copernico", // Without accents
    "Copérnico",
    "Copernico", // Without accent
    "Nicolaus Copernicus" // English name
  ],

  "René Descartes": [
    "Rene Descartes", // Without accent
    "Descartes"
  ],

  // French Revolution & Napoleonic Era - accent normalization
  "Napoleón Bonaparte": [
    "Napoleon Bonaparte", // Without accent
    "Napoleón",
    "Napoleon", // Without accent
    "Bonaparte",
    "El Pequeño Cabo",
    "Emperador Napoleón",
    "Emperador Napoleon" // Without accent
  ],

  "María Antonieta": [
    "Maria Antonieta", // Without accent
    "La Austriaca",
    "Reina María Antonieta",
    "Reina Maria Antonieta", // Without accent
    "Marie Antoinette" // English name
  ],

  "Luis XVI": [
    "Rey Luis XVI",
    "Louis XVI" // English name
  ],

  "Marqués de Lafayette": [
    "Marques de Lafayette", // Without accent
    "Lafayette"
  ],

  "Barón von Steuben": [
    "Baron von Steuben", // Without accent
    "von Steuben"
  ],

  // 19th Century World Leaders - accent normalization
  "Káiser Guillermo II": [
    "Kaiser Guillermo II", // Without accent
    "Guillermo II",
    "El Káiser",
    "El Kaiser", // Without accent
    "Kaiser Wilhelm II" // English name
  ],

  "Reina Victoria": [
    "Victoria",
    "La Emperatriz de la India",
    "Queen Victoria" // English name
  ],

  "Nicolás II": [
    "Nicolas II", // Without accent
    "El Último Zar",
    "El Ultimo Zar", // Without accent
    "Zar Nicolás",
    "Zar Nicolas", // Without accent
    "Nicholas II" // English name
  ],

  "Alejandro II": [
    "El Zar Liberador",
    "Alexander II" // English name
  ],

  // Scientists & Inventors - accent normalization
  "Tomás Edison": [
    "Tomas Edison", // Without accent
    "Edison",
    "El Mago de Menlo Park",
    "Thomas Edison" // English name
  ],

  // 20th Century World Leaders - accent normalization
  "León Trotsky": [
    "Leon Trotsky", // Without accent
    "Trotsky"
  ],

  // Civil Rights & Social Leaders - accent normalization
  "César Chávez": [
    "Cesar Chavez", // Without accents
    "Chávez",
    "Chavez" // Without accent
  ],

  "Martín Lutero": [
    "Martin Lutero", // Without accent
    "Lutero",
    "Martin Luther" // English name
  ],

  // Latin American Leaders - comprehensive accent normalization
  "Simón Bolívar": [
    "Simon Bolivar", // Without accents
    "Bolívar",
    "Bolivar", // Without accent
    "El Libertador"
  ],

  "José de San Martín": [
    "Jose de San Martin", // Without accents
    "San Martín",
    "San Martin" // Without accent
  ],

  "Benito Juárez": [
    "Benito Juarez", // Without accent
    "Juárez",
    "Juarez" // Without accent
  ],

  "Porfirio Díaz": [
    "Porfirio Diaz", // Without accent
    "Díaz",
    "Diaz" // Without accent
  ],

  "José Martí": [
    "Jose Marti", // Without accents
    "Martí",
    "Marti" // Without accent
  ],

  "Rubén Darío": [
    "Ruben Dario", // Without accents
    "Darío",
    "Dario" // Without accent
  ],

  "Gabriel García Márquez": [
    "Gabriel Garcia Marquez", // Without accents
    "García Márquez",
    "Garcia Marquez", // Without accents
    "Gabo"
  ],

  // Religious & Spiritual Leaders - accent normalization
  "Jesucristo": [
    "Jesús",
    "Jesus", // Without accent
    "Cristo",
    "Jesús de Nazaret",
    "Jesus de Nazaret", // Without accent
    "Jesus Christ" // English name
  ],

  "Moisés": [
    "Moises", // Without accent
    "Profeta Moisés",
    "Profeta Moises", // Without accent
    "Moses" // English name
  ],

  "Mahoma": [
    "El Profeta",
    "Profeta Mahoma",
    "Muhammad" // English name
  ],

  "Confucio": [
    "Kong Qiu",
    "Confucius" // English name
  ],

  "Teresa de Ávila": [
    "Teresa de Avila", // Without accent
    "Santa Teresa"
  ],

  "Juan de la Cruz": [
    "San Juan de la Cruz",
    "John of the Cross" // English name
  ],

  "Tomás de Kempis": [
    "Tomas de Kempis", // Without accent
    "Thomas à Kempis" // English name
  ],

  "Ignacio de Loyola": [
    "San Ignacio",
    "Ignatius of Loyola" // English name
  ],

  "Juan Calvino": [
    "Calvino",
    "John Calvin" // English name
  ],

  "Madre Teresa": [
    "Teresa",
    "Santa Teresa de Calcuta",
    "Mother Teresa" // English name
  ],

  "Papa Juan Pablo II": [
    "Juan Pablo II",
    "Karol Wojtyła",
    "Karol Wojtyla", // Without accent
    "Pope John Paul II" // English name
  ],

  "Papa Juan XXIII": [
    "Juan XXIII",
    "Pope John XXIII" // English name
  ],

  // Additional common variations
  "Mahatma Gandhi": [
    "Gandhi",
    "El Mahatma"
  ],

  "Nelson Mandela": [
    "Mandela",
    "Madiba"
  ],

  "Che Guevara": [
    "Guevara",
    "Che",
    "Ernesto Guevara"
  ],

  "Eva Perón": [
    "Evita",
    "Perón",
    "Peron" // Without accent
  ],

  "Fidel Castro": [
    "Castro"
  ]
};
