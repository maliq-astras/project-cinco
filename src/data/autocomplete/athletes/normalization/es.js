// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish athlete name
// IMPORTANT: All accent variations are normalized to prevent wrong answers
export const athletesNormalization = {
  // Challenge athletes - most keep English names
  "Derek Jeter": [
    "Jeter",
    "El Capitán", // Spanish nickname
    "El Capitán" // With accent
  ],
  
  "Tiger Woods": [
    "Tiger",
    "Tigre Woods", // Spanish translation
    "Eldrick Woods"
  ],
  
  "Michael Phelps": [
    "Phelps",
    "La Bala de Baltimore",
    "El Pez Volador"
  ],
  
  "Cristiano Ronaldo": [
    "Cristiano",
    "CR7",
    "Ronaldo"
  ],

  // Basketball - iconic single name normalizations
  "LeBron James": [
    "LeBron", // Normalize single to full
    "Rey James",
    "El Rey",
    "El Elegido"
  ],
  
  "Michael Jordan": [
    "Jordan", // Normalize single to full
    "MJ",
    "Su Majestad Aérea", // His Airness in Spanish
    "Air Jordan"
  ],
  
  "Kobe Bryant": [
    "Kobe", // Normalize single to full
    "La Mamba Negra",
    "Mamba"
  ],
  
  "Shaquille O'Neal": [
    "Shaq", // Normalize nickname to full
    "El Gran Aristóteles",
    "Superman",
    "El Diesel"
  ],
  
  "Stephen Curry": [
    "Steph Curry", // Normalize to Stephen
    "Steph",
    "Chef Curry"
  ],
  
  "Magic Johnson": [
    "Magic",
    "Earvin Johnson",
    "Mágico Johnson" // Spanish translation
  ],

  // Spanish/Latin Soccer Stars - accent normalization
  "Raúl González": [
    "Raul Gonzalez", // Without accents
    "Raúl", // Normalize single to full
    "Raul", // Without accent
    "El Ángel de Madrid",
    "El Angel de Madrid" // Without accent
  ],
  
  "Iker Casillas": [
    "Casillas", // Normalize to full name
    "San Iker",
    "El Santo"
  ],
  
  "Fernando Torres": [
    "Torres", // Normalize to full name
    "El Niño",
    "El Nino" // Without accent
  ],
  
  "Gerard Piqué": [
    "Gerard Pique", // Without accent
    "Piqué", // Normalize to full
    "Pique" // Without accent
  ],
  
  "Luis Suárez": [
    "Luis Suarez", // Without accent
    "Suárez", // Normalize to full
    "Suarez", // Without accent
    "El Pistolero"
  ],
  
  "James Rodríguez": [
    "James Rodriguez", // Without accent
    "James",
    "El Nuevo Pibe de Oro"
  ],
  
  "Javier Hernández": [
    "Javier Hernandez", // Without accent
    "Chicharito", // Normalize nickname to full
    "Chícharo",
    "Chicharo" // Without accent
  ],
  
  "Hugo Sánchez": [
    "Hugo Sanchez", // Without accent
    "El Pentapichichi"
  ],
  
  "Rafael Márquez": [
    "Rafael Marquez", // Without accent
    "Rafa Márquez",
    "Rafa Marquez", // Without accent
    "El Káiser de Michoacán",
    "El Kaiser de Michoacan" // Without accents
  ],

  // Global Soccer - accent normalization
  "Pelé": [
    "Pele", // Without accent
    "Edson Arantes do Nascimento", // Normalize full name to Pelé
    "O Rei",
    "El Rey del Fútbol",
    "El Rey del Futbol" // Without accent
  ],
  
  "Diego Maradona": [
    "Maradona", // Normalize to full name
    "El Pibe de Oro",
    "D10S",
    "La Mano de Dios"
  ],
  
  "Lionel Messi": [
    "Messi", // Normalize to full name
    "Leo Messi",
    "La Pulga",
    "El GOAT"
  ],
  
  "Andrés Iniesta": [
    "Andres Iniesta", // Without accent
    "Iniesta",
    "El Cerebro",
    "Don Andrés",
    "Don Andres" // Without accent
  ],
  
  "Zinedine Zidane": [
    "Zidane", // Normalize to full name
    "Zizou"
  ],
  
  "David Beckham": [
    "Beckham", // Normalize to full name
    "Becks"
  ],

  // Tennis - accent normalization
  "Rafael Nadal": [
    "Rafa", // Normalize nickname to full
    "Nadal",
    "El Rey de la Arcilla",
    "Rafa Nadal"
  ],
  
  "Carlos Alcaraz": [
    "Alcaraz",
    "Carlitos"
  ],
  
  "Garbiñe Muguruza": [
    "Garbine Muguruza", // Without accent
    "Muguruza"
  ],
  
  "Pablo Carreño": [
    "Pablo Carreno", // Without accent
    "Carreño",
    "Carreno" // Without accent
  ],

  // Golf - Spanish players with accents
  "Sergio García": [
    "Sergio Garcia", // Without accent
    "García", // Normalize to full
    "Garcia", // Without accent
    "El Niño"
  ],
  
  "José María Olazábal": [
    "Jose Maria Olazabal", // Without accents
    "Olazábal",
    "Olazabal", // Without accent
    "Chema"
  ],
  
  "Seve Ballesteros": [
    "Ballesteros",
    "Severiano Ballesteros"
  ],

  // Boxing - Mexican/Spanish fighters
  "Julio César Chávez": [
    "Julio Cesar Chavez", // Without accents
    "Chávez", // Normalize to full
    "Chavez", // Without accent
    "JC Chávez",
    "JC Chavez", // Without accent
    "El César del Boxeo",
    "El Cesar del Boxeo" // Without accents
  ],
  
  "Saúl Álvarez": [
    "Saul Alvarez", // Without accents
    "Canelo Álvarez", // Normalize nickname to include last name
    "Canelo Alvarez", // Without accent
    "Canelo", // Keep as distinct option
    "El Canelo"
  ],
  
  "Juan Manuel Márquez": [
    "Juan Manuel Marquez", // Without accent
    "Márquez",
    "Marquez", // Without accent
    "Dinamita Márquez",
    "Dinamita Marquez" // Without accent
  ],
  
  "Salvador Sánchez": [
    "Salvador Sanchez", // Without accent
    "Sal Sánchez",
    "Sal Sanchez" // Without accent
  ],

  // Auto Racing - Spanish/Latin drivers
  "Fernando Alonso": [
    "Alonso", // Normalize to full name
    "El Samurai",
    "Nano"
  ],
  
  "Carlos Sainz": [
    "Sainz", // Normalize to full name
    "El Matador"
  ],
  
  "Sergio Pérez": [
    "Sergio Perez", // Without accent
    "Pérez", // Normalize to full
    "Perez", // Without accent
    "Checo Pérez", // Normalize to Sergio
    "Checo Perez", // Without accent
    "Checo"
  ],

  // Global Athletes - Spanish nicknames
  "Muhammad Ali": [
    "Ali", // Normalize to full name
    "Cassius Clay", // Birth name
    "El Más Grande",
    "El Mas Grande" // Without accent
  ],
  
  "Mike Tyson": [
    "Tyson", // Normalize to full name
    "Iron Mike",
    "Hierro Mike" // Spanish translation
  ],
  
  "Usain Bolt": [
    "Bolt",
    "Rayo",
    "El Hombre Más Rápido",
    "El Hombre Mas Rapido" // Without accents
  ],
  
  "Wayne Gretzky": [
    "Gretzky",
    "El Gran Uno", // The Great One in Spanish
    "99"
  ],

  // Pedro Martínez - accent normalization
  "Pedro Martínez": [
    "Pedro Martinez", // Without accent
    "Martínez",
    "Martinez", // Without accent
    "Pedro"
  ],

  // Simple accent normalizations for common Spanish names
  "José": ["Jose"],
  "María": ["Maria"],
  "Jesús": ["Jesus"],
  "Ángel": ["Angel"],
  "Andrés": ["Andres"],
  "Nicolás": ["Nicolas"],
  "Sebastián": ["Sebastian"],
  "Adrián": ["Adrian"],
  "Iván": ["Ivan"],
  "Rubén": ["Ruben"],
  "Ramón": ["Ramon"],
  "Hernán": ["Hernan"],
  "Julián": ["Julian"],
  "Fabián": ["Fabian"],
  "Damián": ["Damian"],
  "Cristián": ["Cristian"],
  
  // Common last names with accents
  "García": ["Garcia"],
  "Martínez": ["Martinez"],
  "Rodríguez": ["Rodriguez"],
  "González": ["Gonzalez"],
  "Hernández": ["Hernandez"],
  "López": ["Lopez"],
  "Sánchez": ["Sanchez"],
  "Pérez": ["Perez"],
  "Gómez": ["Gomez"],
  "Jiménez": ["Jimenez"],
  "Ruíz": ["Ruiz"],
  "Díaz": ["Diaz"],
  "Álvarez": ["Alvarez"],
  "Vázquez": ["Vazquez"],
  "Gutiérrez": ["Gutierrez"],

  // Simple single name normalizations (same as English but with Spanish context)
  "Larry Bird": ["Bird"],
  "Magic Johnson": ["Magic", "Mágico"],
  "Joe Frazier": ["Frazier"],
  "George Foreman": ["Foreman"],
  "Rocky Marciano": ["Marciano"],
  "Joe Louis": ["Louis"],
  "Bobby Orr": ["Orr"],
  "Tony Hawk": ["Hawk"],
  "Kelly Slater": ["Slater"],
  "Shaun White": ["White"]
};
