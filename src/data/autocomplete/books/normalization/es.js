// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish book title
// IMPORTANT: All accent variations are normalized to prevent wrong answers
export const booksNormalization = {
  // Harry Potter Series - accent normalization and title variations
  "Harry Potter y la Piedra Filosofal": [
    "La Piedra Filosofal",
    "Piedra Filosofal"
  ],
  
  "Harry Potter y la Cámara Secreta": [
    "Harry Potter y la Camara Secreta", // Without accent
    "La Cámara Secreta",
    "La Camara Secreta", // Without accent
    "Cámara Secreta",
    "Camara Secreta" // Without accent
  ],
  
  "Harry Potter y el Prisionero de Azkaban": [
    "El Prisionero de Azkaban",
    "Prisionero de Azkaban"
  ],
  
  "Harry Potter y el Cáliz de Fuego": [
    "Harry Potter y el Caliz de Fuego", // Without accent
    "El Cáliz de Fuego",
    "El Caliz de Fuego", // Without accent
    "Cáliz de Fuego",
    "Caliz de Fuego" // Without accent
  ],
  
  "Harry Potter y la Orden del Fénix": [
    "Harry Potter y la Orden del Fenix", // Without accent
    "La Orden del Fénix",
    "La Orden del Fenix", // Without accent
    "Orden del Fénix",
    "Orden del Fenix" // Without accent
  ],
  
  "Harry Potter y el Misterio del Príncipe": [
    "Harry Potter y el Misterio del Principe", // Without accent
    "El Misterio del Príncipe",
    "El Misterio del Principe", // Without accent
    "Misterio del Príncipe",
    "Misterio del Principe" // Without accent
  ],
  
  "Harry Potter y las Reliquias de la Muerte": [
    "Las Reliquias de la Muerte",
    "Reliquias de la Muerte"
  ],

  // Lord of the Rings variations
  "La Comunidad del Anillo": [
    "Comunidad del Anillo"
  ],
  
  "Las Dos Torres": [
    "Dos Torres"
  ],
  
  "El Retorno del Rey": [
    "Retorno del Rey"
  ],
  
  "El Hobbit": [
    "Hobbit"
  ],

  // Narnia variations with accents
  "El Príncipe Caspian": [
    "El Principe Caspian", // Without accent
    "Príncipe Caspian",
    "Principe Caspian" // Without accent
  ],
  
  "La Travesía del Viajero del Alba": [
    "La Travesia del Viajero del Alba", // Without accent
    "Travesía del Viajero del Alba",
    "Travesia del Viajero del Alba" // Without accent
  ],
  
  "La Silla de Plata": [
    "Silla de Plata"
  ],
  
  "El Caballo y el Muchacho": [
    "Caballo y el Muchacho"
  ],
  
  "El Sobrino del Mago": [
    "Sobrino del Mago"
  ],
  
  "La Última Batalla": [
    "La Ultima Batalla", // Without accent
    "Última Batalla",
    "Ultima Batalla" // Without accent
  ],

  // Percy Jackson variations with accents
  "El Ladrón del Rayo": [
    "El Ladron del Rayo", // Without accent
    "Ladrón del Rayo",
    "Ladron del Rayo" // Without accent
  ],
  
  "El Mar de los Monstruos": [
    "Mar de los Monstruos"
  ],
  
  "La Maldición del Titán": [
    "La Maldicion del Titan", // Without accents
    "Maldición del Titán",
    "Maldicion del Titan" // Without accents
  ],
  
  "La Batalla del Laberinto": [
    "Batalla del Laberinto"
  ],
  
  "El Último Héroe del Olimpo": [
    "El Ultimo Heroe del Olimpo", // Without accents
    "Último Héroe del Olimpo",
    "Ultimo Heroe del Olimpo" // Without accents
  ],

  // Twilight Series - accent normalization
  "Crepúsculo": [
    "Crepusculo" // Without accent
  ],

  // Classic Literature - accent variations
  "Matar a un Ruiseñor": [
    "Matar a un Ruisenor" // Without accent
  ],
  
  "El Guardián entre el Centeno": [
    "El Guardian entre el Centeno" // Without accent
  ],
  
  "Alguien Voló sobre el Nido del Cuco": [
    "Alguien Volo sobre el Nido del Cuco" // Without accent
  ],
  
  "El Señor de las Moscas": [
    "El Senor de las Moscas", // Without accent
    "Señor de las Moscas",
    "Senor de las Moscas" // Without accent
  ],

  // Shakespeare - accent variations
  "Sueño de una Noche de Verano": [
    "Sueno de una Noche de Verano" // Without accent
  ],
  
  "Julio César": [
    "Julio Cesar" // Without accent
  ],
  
  "Como Gustéis": [
    "Como Gusteis" // Without accent
  ],

  // Jane Austen - accent variations
  "La Abadía de Northanger": [
    "La Abadia de Northanger", // Without accent
    "Abadía de Northanger",
    "Abadia de Northanger" // Without accent
  ],
  
  "Persuasión": [
    "Persuasion" // Without accent
  ],

  // Charles Dickens - accent variations
  "Tiempos Difíciles": [
    "Tiempos Dificiles" // Without accent
  ],

  // Modern Classics - accent variations
  "El Curioso Incidente del Perro a Medianoche": [
    "Curioso Incidente"
  ],
  
  "La Chica del Dragón Tatuado": [
    "La Chica del Dragon Tatuado", // Without accent
    "Chica del Dragón Tatuado",
    "Chica del Dragon Tatuado", // Without accent
    "Dragón Tatuado",
    "Dragon Tatuado" // Without accent
  ],

  // Science Fiction - accent variations
  "Guía del Autoestopista Galáctico": [
    "Guia del Autoestopista Galactico", // Without accents
    "Autoestopista Galáctico",
    "Autoestopista Galactico" // Without accent
  ],
  
  "La Máquina del Tiempo": [
    "La Maquina del Tiempo", // Without accent
    "Máquina del Tiempo",
    "Maquina del Tiempo" // Without accent
  ],

  // Fantasy - accent variations
  "Festín de Cuervos": [
    "Festin de Cuervos" // Without accent
  ],

  // Horror - accent variations
  "Drácula": [
    "Dracula" // Without accent
  ],

  // Mystery/Thriller - accent variations
  "El Código Da Vinci": [
    "El Codigo Da Vinci", // Without accent
    "Código Da Vinci",
    "Codigo Da Vinci" // Without accent
  ],
  
  "Ángeles y Demonios": [
    "Angeles y Demonios" // Without accent
  ],
  
  "Y No Quedó Ninguno": [
    "Y No Quedo Ninguno" // Without accent
  ],

  // Romance - accent variations
  "Diario de una Pasión": [
    "Diario de una Pasion" // Without accent
  ],

  // Non-Fiction - accent variations
  "Una Educación": [
    "Una Educacion" // Without accent
  ],
  
  "Hábitos Atómicos": [
    "Habitos Atomicos" // Without accents
  ],
  
  "Los 7 Hábitos de la Gente Altamente Efectiva": [
    "Los 7 Habitos de la Gente Altamente Efectiva", // Without accent
    "7 Hábitos",
    "7 Habitos", // Without accent
    "Siete Hábitos",
    "Siete Habitos" // Without accent
  ],

  // Children's Literature - accent variations
  "La Telaraña de Carlota": [
    "La Telarana de Carlota", // Without accent
    "Telaraña de Carlota",
    "Telarana de Carlota" // Without accent
  ],
  
  "El Árbol Generoso": [
    "El Arbol Generoso", // Without accent
    "Árbol Generoso",
    "Arbol Generoso" // Without accent
  ],
  
  "Huevos Verdes con Jamón": [
    "Huevos Verdes con Jamon" // Without accent
  ],
  
  "Santa Lucía": [
    "Santa Lucia" // Without accent
  ],
  
  "San Cristóbal y Nieves": [
    "San Cristobal y Nieves" // Without accent
  ],

  // Graphic Novels - accent variations
  "Persépolis": [
    "Persepolis" // Without accent
  ],

  // Contemporary Fiction - accent variations
  "El Color Púrpura": [
    "El Color Purpura", // Without accent
    "Color Púrpura",
    "Color Purpura" // Without accent
  ],
  
  "Cien Años de Soledad": [
    "Cien Anos de Soledad", // Without accent
    "Años de Soledad",
    "Anos de Soledad" // Without accent
  ],
  
  "El Dios de las Pequeñas Cosas": [
    "El Dios de las Pequenas Cosas", // Without accent
    "Dios de las Pequeñas Cosas",
    "Dios de las Pequenas Cosas" // Without accent
  ],

  // Simple "The" removal normalizations
  "El Gran Gatsby": ["Gran Gatsby", "Gatsby"],
  "El Alquimista": ["Alquimista"],
  "La Jungla": ["Jungla"],
  "El Maestro y Margarita": ["Maestro y Margarita"],
  "La Vida de Pi": ["Vida de Pi"],
  "La Ladrona de Libros": ["Ladrona de Libros"],
  "El Marciano": ["Marciano"],
  "El Resplandor": ["Resplandor"],
  "El Silencio de los Corderos": ["Silencio de los Corderos"],
  "El Diario de Ana Frank": ["Diario de Ana Frank"],
  "El Poder del Ahora": ["Poder del Ahora"],
  "El Nombre del Viento": ["Nombre del Viento"],
  "El Camino de los Reyes": ["Camino de los Reyes"],
  "El Ojo del Mundo": ["Ojo del Mundo"],
  "El Cuento de la Criada": ["Cuento de la Criada"],
  "El Club de la Buena Estrella": ["Club de la Buena Estrella"]
};
