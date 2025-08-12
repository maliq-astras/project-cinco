// Clean suggestions array (what users see in dropdown)
// INDIVIDUAL movies with Spanish titles - NO generic titles
export const moviesSuggestions = [
  // Challenge movies (from /challenges/movies/)
  "Volver al Futuro",
  "Un Lugar en Silencio",
  "Coraline",
  "El Club de la Pelea",
  "Buscando a Nemo",
  "El Día de la Marmota",
  "Inception",
  "Shrek",
  "Misión Rescate",
  "Cuando Harry Conoció a Sally",

  // Classic Hollywood (1930s-1960s)
  "Casablanca",
  "Lo que el Viento se Llevó",
  "El Ciudadano Kane",
  "El Mago de Oz",
  "Cantando bajo la Lluvia",
  "Una Eva y Dos Adanes",
  "Vértigo",
  "Psicosis",
  "Con la Muerte en los Talones",
  "El Halcón Maltés",
  "El Crepúsculo de los Dioses",
  "Eva al Desnudo",
  "El Tesoro de Sierra Madre",
  "Los Mejores Años de Nuestra Vida",
  "¡Qué Bello es Vivir!",
  "El Tercer Hombre",
  "Perdición",
  "El Sueño Eterno",
  "Encadenados",
  "Rebecca",

  // 1970s Classics
  "El Padrino",
  "El Padrino Parte II",
  "Tiburón",
  "La Guerra de las Galaxias",
  "Taxi Driver",
  "El Exorcista",
  "Chinatown",
  "El Cazador",
  "Apocalipsis Ahora",
  "Todos los Hombres del Presidente",
  "Alguien Voló sobre el Nido del Cuco",
  "Network",
  "Annie Hall",
  "Manhattan",
  "Contacto en Francia",
  "Harry el Sucio",
  "Klute",
  "La Conversación",
  "Serpico",
  "Tarde de Perros",

  // 1980s Hits
  "El Imperio Contraataca",
  "El Retorno del Jedi",
  "En Busca del Arca Perdida",
  "Indiana Jones y el Templo de la Perdición",
  "Indiana Jones y la Última Cruzada",
  "E.T. el Extraterrestre",
  "Blade Runner",
  "Terminator",
  "Aliens",
  "Los Cazafantasmas",
  "El Club de los Cinco",
  "Ferris Bueller's Day Off",
  "Pretty in Pink",
  "Sixteen Candles",
  "Say Anything",
  "La Princesa Prometida",
  "La Sociedad de los Poetas Muertos",
  "Top Gun",
  "Risky Business",
  "Caracortada",

  // 1990s Cinema
  "Pulp Fiction",
  "Sueño de Fuga",
  "Buenos Muchachos",
  "La Lista de Schindler",
  "Forrest Gump",
  "El Silencio de los Corderos",
  "Terminator 2: El Juicio Final",
  "Parque Jurásico",
  "El Rey León",
  "La Bella y la Bestia",
  "Toy Story",
  "Matrix",
  "Titanic",
  "Rescatando al Soldado Ryan",
  "Belleza Americana",
  "Fargo",
  "El Gran Lebowski",
  "Perros de Reserva",
  "Heat",
  "Siete",

  // 2000s Era
  "Gladiador",
  "Una Mente Brillante",
  "Chicago",
  "El Señor de los Anillos: La Comunidad del Anillo",
  "El Señor de los Anillos: Las Dos Torres",
  "El Señor de los Anillos: El Retorno del Rey",
  "Piratas del Caribe: La Maldición del Perla Negra",
  "Buscando a Nemo",
  "Monsters, Inc.",
  "Shrek",
  "Shrek 2",
  "Los Increíbles",
  "WALL-E",
  "Up",
  "Ratatouille",
  "Cars",
  "Crash",
  "Million Dollar Baby",
  "No es País para Viejos",
  "Petróleo Sangriento",

  // Spider-Man Movies - INDIVIDUAL FILMS
  "Spider-Man", // 2002 Tobey Maguire
  "Spider-Man 2", // 2004 Tobey Maguire
  "Spider-Man 3", // 2007 Tobey Maguire
  "El Sorprendente Hombre Araña", // 2012 Andrew Garfield
  "El Sorprendente Hombre Araña 2", // 2014 Andrew Garfield
  "Spider-Man: De Regreso a Casa", // 2017 Tom Holland
  "Spider-Man: Lejos de Casa", // 2019 Tom Holland
  "Spider-Man: Sin Camino a Casa", // 2021 Tom Holland

  // X-Men Movies - INDIVIDUAL FILMS
  "X-Men", // 2000
  "X-Men 2", // 2003
  "X-Men: La Batalla Final", // 2006
  "X-Men Orígenes: Wolverine", // 2009
  "X-Men: Primera Generación", // 2011
  "Wolverine: Inmortal", // 2013
  "X-Men: Días del Futuro Pasado", // 2014
  "X-Men: Apocalipsis", // 2016
  "Logan", // 2017
  "Deadpool", // 2016
  "Deadpool 2", // 2018

  // Marvel Cinematic Universe - INDIVIDUAL FILMS
  "Iron Man", // 2008
  "Iron Man 2", // 2010
  "Iron Man 3", // 2013
  "El Increíble Hulk", // 2008
  "Thor", // 2011
  "Thor: El Mundo Oscuro", // 2013
  "Thor: Ragnarok", // 2017
  "Thor: Amor y Trueno", // 2022
  "Capitán América: El Primer Vengador", // 2011
  "Capitán América: El Soldado del Invierno", // 2014
  "Capitán América: Guerra Civil", // 2016
  "Los Vengadores", // 2012
  "Vengadores: Era de Ultrón", // 2015
  "Vengadores: Guerra del Infinito", // 2018
  "Vengadores: Endgame", // 2019
  "Guardianes de la Galaxia", // 2014
  "Guardianes de la Galaxia Vol. 2", // 2017
  "Ant-Man", // 2015
  "Ant-Man y la Avispa", // 2018
  "Doctor Strange", // 2016
  "Pantera Negra", // 2018
  "Capitana Marvel", // 2019
  "Eternals", // 2021
  "Shang-Chi y la Leyenda de los Diez Anillos", // 2021

  // DC Movies - INDIVIDUAL FILMS
  "Batman", // 1989 Michael Keaton
  "Batman Regresa", // 1992 Michael Keaton
  "Batman Eternamente", // 1995 Val Kilmer
  "Batman y Robin", // 1997 George Clooney
  "Batman Inicia", // 2005 Christian Bale
  "El Caballero Oscuro", // 2008 Christian Bale
  "El Caballero de la Noche Asciende", // 2012 Christian Bale
  "Batman vs Superman: El Origen de la Justicia", // 2016 Ben Affleck
  "Liga de la Justicia", // 2017
  "La Liga de la Justicia de Zack Snyder", // 2021
  "Superman", // 1978 Christopher Reeve
  "Superman II", // 1980 Christopher Reeve
  "Superman III", // 1983 Christopher Reeve
  "Superman IV: En Busca de la Paz", // 1987 Christopher Reeve
  "Superman Regresa", // 2006 Brandon Routh
  "El Hombre de Acero", // 2013 Henry Cavill
  "Mujer Maravilla", // 2017
  "Mujer Maravilla 1984", // 2020
  "Aquaman", // 2018
  "El Escuadrón Suicida", // 2021
  "Aves de Presa", // 2020
  "Joker", // 2019
  "The Batman", // 2022 Robert Pattinson

  // Horror Movies - INDIVIDUAL FILMS
  "Halloween", // 1978 John Carpenter
  "Halloween", // 2018 David Gordon Green
  "Viernes 13", // 1980
  "Pesadilla en la Calle del Infierno", // 1984
  "La Masacre de Texas", // 1974
  "La Masacre de Texas", // 2003
  "Scream", // 1996
  "Scream 2", // 1997
  "Scream 3", // 2000
  "Scream 4", // 2011
  "Scream", // 2022
  "La Cosa", // 1982 John Carpenter
  "El Resplandor", // 1980
  "Carrie", // 1976 Brian De Palma
  "Carrie", // 2013 Kimberly Peirce
  "Eso", // 2017
  "Eso: Capítulo Dos", // 2019
  "El Conjuro", // 2013
  "El Conjuro 2", // 2016
  "El Conjuro: El Diablo me Obligó a Hacerlo", // 2021
  "Insidious", // 2010
  "Insidious: Capítulo 2", // 2013
  "Actividad Paranormal", // 2007
  "¡Huye!", // 2017
  "Nosotros", // 2019
  "Nope", // 2022
  "Hereditary", // 2018
  "Midsommar", // 2019
  "The Babadook", // 2014
  "Un Lugar en Silencio", // 2018
  "Un Lugar en Silencio Parte II", // 2020

  // Action/Thriller - INDIVIDUAL FILMS
  "Duro de Matar", // 1988
  "Duro de Matar 2", // 1990
  "Duro de Matar: La Venganza", // 1995
  "Duro de Matar 4.0", // 2007
  "Un Buen Día para Morir", // 2013
  "Arma Mortal", // 1987
  "Arma Mortal 2", // 1989
  "Arma Mortal 3", // 1992
  "Arma Mortal 4", // 1998
  "Máxima Velocidad", // 1994
  "Máxima Velocidad 2", // 1997
  "Point Break", // 1991
  "Point Break", // 2015
  "Rápidos y Furiosos", // 2001
  "Más Rápido, Más Furioso", // 2003
  "Rápidos y Furiosos: Reto Tokio", // 2006
  "Rápidos y Furiosos 4", // 2009
  "Rápidos y Furiosos: 5in Control", // 2011
  "Rápidos y Furiosos 6", // 2013
  "Rápidos y Furiosos 7", // 2015
  "Rápidos y Furiosos 8", // 2017
  "Rápidos y Furiosos 9", // 2021
  "Rápidos y Furiosos X", // 2023
  "Misión: Imposible", // 1996
  "Misión: Imposible 2", // 2000
  "Misión: Imposible III", // 2006
  "Misión: Imposible - Protocolo Fantasma", // 2011
  "Misión: Imposible - Nación Secreta", // 2015
  "Misión: Imposible - Repercusión", // 2018

  // Animated Movies - Disney (Individual Films)
  "Blancanieves y los Siete Enanitos", // 1937
  "Pinocho", // 1940
  "Fantasía", // 1940
  "Dumbo", // 1941
  "Bambi", // 1942
  "Cenicienta", // 1950
  "Alicia en el País de las Maravillas", // 1951
  "Peter Pan", // 1953
  "La Dama y el Vagabundo", // 1955
  "La Bella Durmiente", // 1959
  "101 Dálmatas", // 1961
  "El Libro de la Selva", // 1967
  "La Sirenita", // 1989
  "La Bella y la Bestia", // 1991
  "Aladdin", // 1992
  "El Rey León", // 1994
  "Pocahontas", // 1995
  "El Jorobado de Notre Dame", // 1996
  "Hércules", // 1997
  "Mulán", // 1998
  "Tarzán", // 1999
  "Fantasía 2000", // 1999
  "Las Locuras del Emperador", // 2000
  "Atlantis: El Imperio Perdido", // 2001
  "Lilo y Stitch", // 2002
  "El Planeta del Tesoro", // 2002
  "Hermano Oso", // 2003
  "Zafarrancho en el Rancho", // 2004
  "Chicken Little", // 2005
  "Descubriendo a los Robinsons", // 2007
  "Bolt", // 2008
  "Tiana y el Sapo", // 2009
  "Enredados", // 2010
  "¡Rompe Ralph!", // 2012
  "Frozen", // 2013
  "Grandes Héroes", // 2014
  "Zootopia", // 2016
  "Moana", // 2016
  "Ralph Rompe Internet", // 2018
  "Frozen II", // 2019
  "Raya y el Último Dragón", // 2021
  "Encanto", // 2021
  "Mundo Extraño", // 2022

  // Pixar (Individual Films)
  "Toy Story", // 1995
  "Bichos", // 1998
  "Toy Story 2", // 1999
  "Monsters, Inc.", // 2001
  "Buscando a Nemo", // 2003
  "Los Increíbles", // 2004
  "Cars", // 2006
  "Ratatouille", // 2007
  "WALL-E", // 2008
  "Up", // 2009
  "Toy Story 3", // 2010
  "Cars 2", // 2011
  "Valiente", // 2012
  "Monsters University", // 2013
  "Intensamente", // 2015
  "El Viaje de Arlo", // 2015
  "Buscando a Dory", // 2016
  "Cars 3", // 2017
  "Coco", // 2017
  "Los Increíbles 2", // 2018
  "Toy Story 4", // 2019
  "Unidos", // 2020
  "Soul", // 2020
  "Luca", // 2021
  "Red", // 2022
  "Lightyear", // 2022
  "Elemental", // 2023

  // DreamWorks (Individual Films)
  "Antz", // 1998
  "El Príncipe de Egipto", // 1998
  "El Dorado", // 2000
  "Pollitos en Fuga", // 2000
  "Shrek", // 2001
  "Spirit: El Corcel Indomable", // 2002
  "Simbad: La Leyenda de los Siete Mares", // 2003
  "Shrek 2", // 2004
  "El Espantatiburones", // 2004
  "Madagascar", // 2005
  "Vecinos Invasores", // 2006
  "Ratónpolis", // 2006
  "Shrek Tercero", // 2007
  "Bee Movie", // 2007
  "Kung Fu Panda", // 2008
  "Madagascar 2", // 2008
  "Monstruos vs Alienígenas", // 2009
  "Cómo Entrenar a tu Dragón", // 2010
  "Shrek Para Siempre", // 2010
  "Megamind", // 2010
  "Kung Fu Panda 2", // 2011
  "El Gato con Botas", // 2011
  "Madagascar 3", // 2012
  "El Origen de los Guardianes", // 2012
  "Los Croods", // 2013
  "Turbo", // 2013
  "Las Aventuras de Peabody y Sherman", // 2014
  "Cómo Entrenar a tu Dragón 2", // 2014
  "Los Pingüinos de Madagascar", // 2014
  "Casi el Hogar", // 2015
  "Kung Fu Panda 3", // 2016
  "Trolls", // 2016
  "Un Jefe en Pañales", // 2017
  "Capitán Calzoncillos", // 2017
  "Cómo Entrenar a tu Dragón 3", // 2019
  "Abominable", // 2019
  "Trolls 2", // 2020
  "Los Croods 2", // 2020
  "Un Jefe en Pañales 2", // 2021
  "Spirit: Indomable", // 2021
  "Los Tipos Malos", // 2022
  "El Gato con Botas: El Último Deseo", // 2022

  // Modern Dramas & Thrillers (2010s-2020s)
  "La Red Social", // 2010
  "Cisne Negro", // 2010
  "El Discurso del Rey", // 2010
  "El Artista", // 2011
  "La Invención de Hugo", // 2011
  "Historias Cruzadas", // 2011
  "Argo", // 2012
  "La Vida de Pi", // 2012
  "Django Sin Cadenas", // 2012
  "12 Años de Esclavitud", // 2013
  "Gravedad", // 2013
  "Ella", // 2013
  "El Lobo de Wall Street", // 2013
  "Birdman", // 2014
  "Boyhood", // 2014
  "Whiplash", // 2014
  "El Gran Hotel Budapest", // 2014
  "En Primera Plana", // 2015
  "El Renacido", // 2015
  "Mad Max: Furia en la Carretera", // 2015
  "La Habitación", // 2015
  "Moonlight", // 2016
  "La La Land", // 2016
  "La Llegada", // 2016
  "Manchester Frente al Mar", // 2016
  "La Forma del Agua", // 2017
  "Tres Anuncios por un Crimen", // 2017
  "Call Me by Your Name", // 2017
  "Lady Bird", // 2017
  "¡Huye!", // 2017
  "Los Archivos del Pentágono", // 2017
  "Green Book", // 2018
  "Roma", // 2018
  "Nace una Estrella", // 2018
  "El Infiltrado del KKKlan", // 2018
  "Bohemian Rhapsody", // 2018
  "Vice", // 2018
  "Parásitos", // 2019
  "Joker", // 2019
  "1917", // 2019
  "Había una Vez en Hollywood", // 2019
  "Jojo Rabbit", // 2019
  "Mujercitas", // 2019
  "Historia de un Matrimonio", // 2019
  "El Irlandés", // 2019
  "Nomadland", // 2020
  "Minari", // 2020
  "El Padre", // 2020
  "El Sonido del Metal", // 2020
  "Judas y el Mesías Negro", // 2021
  "Los 7 de Chicago", // 2020
  "Mank", // 2020
  "CODA", // 2021
  "Dune", // 2021
  "El Poder del Perro", // 2021
  "Amor sin Barreras", // 2021
  "Rey Richard", // 2021
  "Belfast", // 2021
  "Licorice Pizza", // 2021
  "Drive My Car", // 2021
  "Todo en Todas Partes al Mismo Tiempo", // 2022
  "Top Gun: Maverick", // 2022
  "Los Espíritus de la Isla", // 2022
  "Tár", // 2022
  "Los Fabelman", // 2022
  "Avatar: El Camino del Agua", // 2022
  "Glass Onion: Un Misterio de Knives Out", // 2022
  "Ellas Hablan", // 2022
  "Triángulo de Tristeza", // 2022

  // Sci-Fi Classics & Modern
  "2001: Odisea del Espacio", // 1968
  "Encuentros Cercanos del Tercer Tipo", // 1977
  "Alien", // 1979
  "Blade Runner", // 1982
  "Terminator", // 1984
  "Volver al Futuro", // 1985
  "Volver al Futuro II", // 1989
  "Volver al Futuro III", // 1990
  "Desafío Total", // 1990
  "Terminator 2: El Juicio Final", // 1991
  "Parque Jurásico", // 1993
  "Matrix", // 1999
  "Matrix Recargado", // 2003
  "Matrix Revoluciones", // 2003
  "Matrix Resurrecciones", // 2021
  "Minority Report", // 2002
  "Yo, Robot", // 2004
  "La Guerra de los Mundos", // 2005
  "Hijos de los Hombres", // 2006
  "WALL-E", // 2008
  "Distrito 9", // 2009
  "Avatar", // 2009
  "Inception", // 2010
  "Código Fuente", // 2011
  "Looper", // 2012
  "Gravedad", // 2013
  "Ella", // 2013
  "Interestelar", // 2014
  "Ex Machina", // 2014
  "Misión Rescate", // 2015
  "La Llegada", // 2016
  "Blade Runner 2049", // 2017
  "Aniquilación", // 2018
  "Ready Player One", // 2018
  "Ad Astra", // 2019
  "Tenet", // 2020
  "Dune", // 2021
  "No Miren Arriba", // 2021
  "Todo en Todas Partes al Mismo Tiempo", // 2022
  "Avatar: El Camino del Agua", // 2022

  // Comedy Classics
  "Una Eva y Dos Adanes", // 1959
  "La Extraña Pareja", // 1968
  "Sillas de Montar Calientes", // 1974
  "El Jovencito Frankenstein", // 1974
  "Monty Python y el Santo Grial", // 1975
  "Annie Hall", // 1977
  "Manhattan", // 1979
  "Caddyshack", // 1980
  "¿Y Dónde Está el Piloto?", // 1980
  "Los Hermanos Cara de Hacha", // 1980
  "Stripes", // 1981
  "Picardías Estudiantiles", // 1982
  "Un Lugar Llamado Milagro", // 1983
  "Esto es Spinal Tap", // 1984
  "Los Cazafantasmas", // 1984
  "La Gran Aventura de Pee-wee", // 1985
  "Ferris Bueller's Day Off", // 1986
  "La Princesa Prometida", // 1987
  "Big", // 1988
  "Un Príncipe en Nueva York", // 1988
  "Cuando Harry Conoció a Sally", // 1989
  "El Día de la Marmota", // 1993
  "Señora Doubtfire", // 1993
  "Tonto y Retonto", // 1994
  "La Máscara", // 1994
  "Ace Ventura", // 1994
  "Tommy Boy", // 1995
  "Un Tipo Genial", // 1996
  "El Profesor Chiflado", // 1996
  "Mentiroso Mentiroso", // 1997
  "Austin Powers", // 1997
  "Loco por Mary", // 1998
  "El Gran Lebowski", // 1998
  "Austin Powers 2", // 1999
  "Héroes Fuera de Órbita", // 1999
  "La Familia de Mi Novia", // 2000
  "Zoolander", // 2001
  "Austin Powers 3", // 2002
  "Locuras de Juventud", // 2003
  "Elf", // 2003
  "El Reportero", // 2004
  "Dodgeball", // 2004
  "Los Rompebodas", // 2005
  "Virgen a los 40", // 2005
  "Ricky Bobby", // 2006
  "Borat", // 2006
  "Ligeramente Embarazada", // 2007
  "Superbad", // 2007
  "Hermanastros", // 2008
  "Tropic Thunder", // 2008
  "¿Qué Pasó Ayer?", // 2009
  "Bienvenidos a Zombieland", // 2009
  "Niños Grandes", // 2010
  "Damas en Guerra", // 2011
  "Comando Especial", // 2012
  "Ted", // 2012
  "Juerga hasta el Fin", // 2013
  "El Gran Hotel Budapest", // 2014
  "Comando Especial 2", // 2014
  "Y de Repente Tú", // 2015
  "Deadpool", // 2016
  "Dos Tipos Peligrosos", // 2016
  "Noche de Juegos", // 2018
  "Súper Empollonas", // 2019
  "Puñales por la Espalda", // 2019
  "Jojo Rabbit", // 2019
  "Palm Springs", // 2020
  "Borat 2", // 2020
  "La Crónica Francesa", // 2021
  "No Miren Arriba", // 2021
  "Licorice Pizza", // 2021
  "El Menú", // 2022
  "Glass Onion: Un Misterio de Knives Out", // 2022
  "Todo en Todas Partes al Mismo Tiempo", // 2022
  "Los Espíritus de la Isla", // 2022
  "Babylon", // 2022
];
