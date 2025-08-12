// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish movie title
// IMPORTANT: All accent variations normalized + English titles recognized
export const moviesNormalization = {
  // Challenge movies - accent normalization and English titles
  "Volver al Futuro": [
    "Volver al Futuro", // Without accent
    "Back to the Future", // English title
    "BTTF"
  ],

  "Un Lugar en Silencio": [
    "A Quiet Place", // English title
    "Quiet Place"
  ],

  "El Club de la Pelea": [
    "El Club de la Pelea", // Without accent
    "Fight Club", // English title
    "The Fight Club"
  ],

  "Buscando a Nemo": [
    "Finding Nemo", // English title
    "Nemo"
  ],

  "El Día de la Marmota": [
    "El Dia de la Marmota", // Without accent
    "Groundhog Day", // English title
    "Día de la Marmota",
    "Dia de la Marmota" // Without accent
  ],

  "Inception": [
    "El Origen" // Alternative Spanish title
  ],

  "Misión Rescate": [
    "Mision Rescate", // Without accent
    "The Martian", // English title
    "Martian"
  ],

  "Cuando Harry Conoció a Sally": [
    "Cuando Harry Conocio a Sally", // Without accents
    "When Harry Met Sally", // English title
    "When Harry Met Sally..."
  ],

  // Spider-Man Movies - INDIVIDUAL FILMS with English recognition
  "Spider-Man": [ // 2002 Tobey Maguire
    "Spiderman",
    "Spider Man",
    "El Hombre Araña",
    "El Hombre Arana", // Without tilde
    "Hombre Araña",
    "Hombre Arana" // Without tilde
  ],

  "Spider-Man 2": [ // 2004 Tobey Maguire
    "Spiderman 2",
    "Spider Man 2",
    "El Hombre Araña 2",
    "El Hombre Arana 2" // Without tilde
  ],

  "Spider-Man 3": [ // 2007 Tobey Maguire
    "Spiderman 3",
    "Spider Man 3",
    "El Hombre Araña 3",
    "El Hombre Arana 3" // Without tilde
  ],

  "El Sorprendente Hombre Araña": [ // 2012 Andrew Garfield
    "El Sorprendente Hombre Arana", // Without tilde
    "The Amazing Spider-Man", // English title
    "Amazing Spiderman",
    "Amazing Spider Man"
  ],

  "El Sorprendente Hombre Araña 2": [ // 2014 Andrew Garfield
    "El Sorprendente Hombre Arana 2", // Without tilde
    "The Amazing Spider-Man 2", // English title
    "Amazing Spiderman 2"
  ],

  "Spider-Man: De Regreso a Casa": [ // 2017 Tom Holland
    "Spider-Man: Homecoming", // English title
    "Spiderman Homecoming",
    "De Regreso a Casa"
  ],

  "Spider-Man: Lejos de Casa": [ // 2019 Tom Holland
    "Spider-Man: Far From Home", // English title
    "Spiderman Far From Home",
    "Lejos de Casa"
  ],

  "Spider-Man: Sin Camino a Casa": [ // 2021 Tom Holland
    "Spider-Man: No Way Home", // English title
    "Spiderman No Way Home",
    "Sin Camino a Casa"
  ],

  // Batman Movies - INDIVIDUAL FILMS with English recognition
  "Batman": [ // 1989 Michael Keaton
    "Batman 1989",
    "Tim Burton Batman"
  ],

  "Batman Regresa": [ // 1992 Michael Keaton
    "Batman Returns", // English title
    "Batman 2"
  ],

  "Batman Eternamente": [ // 1995 Val Kilmer
    "Batman Forever", // English title
    "Batman 3"
  ],

  "Batman y Robin": [ // 1997 George Clooney
    "Batman & Robin", // English title
    "Batman and Robin",
    "Batman 4"
  ],

  "Batman Inicia": [ // 2005 Christian Bale
    "Batman Begins", // English title
    "Batman Comienza"
  ],

  "El Caballero Oscuro": [ // 2008 Christian Bale
    "The Dark Knight", // English title
    "Dark Knight",
    "Caballero Oscuro"
  ],

  "El Caballero de la Noche Asciende": [ // 2012 Christian Bale
    "The Dark Knight Rises", // English title
    "Dark Knight Rises"
  ],

  "Batman vs Superman: El Origen de la Justicia": [ // 2016 Ben Affleck
    "Batman v Superman: Dawn of Justice", // English title
    "Batman vs Superman",
    "BvS"
  ],

  "Liga de la Justicia": [ // 2017
    "Justice League", // English title
    "La Liga de la Justicia"
  ],

  "La Liga de la Justicia de Zack Snyder": [ // 2021
    "Zack Snyder's Justice League", // English title
    "Snyder Cut"
  ],

  "The Batman": [ // 2022 Robert Pattinson
    "Batman 2022"
  ],

  // Superman Movies - INDIVIDUAL FILMS
  "Superman": [ // 1978 Christopher Reeve
    "Superman 1978",
    "Superman 1"
  ],

  "Superman II": [ // 1980 Christopher Reeve
    "Superman 2"
  ],

  "Superman III": [ // 1983 Christopher Reeve
    "Superman 3"
  ],

  "Superman IV: En Busca de la Paz": [ // 1987 Christopher Reeve
    "Superman IV: The Quest for Peace", // English title
    "Superman 4",
    "En Busca de la Paz"
  ],

  "Superman Regresa": [ // 2006 Brandon Routh
    "Superman Returns" // English title
  ],

  "El Hombre de Acero": [ // 2013 Henry Cavill
    "Man of Steel", // English title
    "Hombre de Acero"
  ],

  // Marvel Cinematic Universe - INDIVIDUAL FILMS
  "Iron Man": [ // 2008
    "El Hombre de Hierro",
    "Hombre de Hierro"
  ],

  "Iron Man 2": [ // 2010
    "El Hombre de Hierro 2",
    "Hombre de Hierro 2"
  ],

  "Iron Man 3": [ // 2013
    "El Hombre de Hierro 3",
    "Hombre de Hierro 3"
  ],

  "El Increíble Hulk": [ // 2008
    "El Increible Hulk", // Without accent
    "The Incredible Hulk", // English title
    "Incredible Hulk"
  ],

  "Thor": [ // 2011
    "Thor 1"
  ],

  "Thor: El Mundo Oscuro": [ // 2013
    "Thor: The Dark World", // English title
    "Thor 2",
    "El Mundo Oscuro"
  ],

  "Thor: Ragnarok": [ // 2017
    "Thor 3",
    "Ragnarok"
  ],

  "Thor: Amor y Trueno": [ // 2022
    "Thor: Love and Thunder", // English title
    "Thor 4",
    "Amor y Trueno"
  ],

  "Capitán América: El Primer Vengador": [ // 2011
    "Capitan America: El Primer Vengador", // Without accent
    "Captain America: The First Avenger", // English title
    "Capitán América 1",
    "Capitan America 1" // Without accent
  ],

  "Capitán América: El Soldado del Invierno": [ // 2014
    "Capitan America: El Soldado del Invierno", // Without accent
    "Captain America: The Winter Soldier", // English title
    "Capitán América 2",
    "Capitan America 2" // Without accent
  ],

  "Capitán América: Guerra Civil": [ // 2016
    "Capitan America: Guerra Civil", // Without accent
    "Captain America: Civil War", // English title
    "Capitán América 3",
    "Capitan America 3" // Without accent
  ],

  "Los Vengadores": [ // 2012
    "The Avengers", // English title
    "Avengers",
    "Vengadores"
  ],

  "Vengadores: Era de Ultrón": [ // 2015
    "Vengadores: Era de Ultron", // Without accent
    "Avengers: Age of Ultron", // English title
    "Vengadores 2"
  ],

  "Vengadores: Guerra del Infinito": [ // 2018
    "Avengers: Infinity War", // English title
    "Vengadores 3",
    "Guerra del Infinito"
  ],

  "Vengadores: Endgame": [ // 2019
    "Avengers: Endgame", // English title
    "Vengadores 4"
  ],

  "Guardianes de la Galaxia": [ // 2014
    "Guardians of the Galaxy", // English title
    "GOTG"
  ],

  "Guardianes de la Galaxia Vol. 2": [ // 2017
    "Guardians of the Galaxy Vol. 2", // English title
    "GOTG 2"
  ],

  "Ant-Man": [ // 2015
    "El Hombre Hormiga",
    "Hombre Hormiga"
  ],

  "Ant-Man y la Avispa": [ // 2018
    "Ant-Man and the Wasp", // English title
    "El Hombre Hormiga y la Avispa"
  ],

  "Doctor Strange": [ // 2016
    "Dr Strange",
    "Doctor Extraño",
    "Doctor Extrano" // Without tilde
  ],

  "Pantera Negra": [ // 2018
    "Black Panther" // English title
  ],

  "Capitana Marvel": [ // 2019
    "Captain Marvel", // English title
    "Capitán Marvel",
    "Capitan Marvel" // Without accent
  ],

  "Shang-Chi y la Leyenda de los Diez Anillos": [ // 2021
    "Shang-Chi and the Legend of the Ten Rings", // English title
    "Shang-Chi"
  ],

  // Horror Movies - INDIVIDUAL FILMS
  "Halloween": [ // 1978 & 2018
    "Noche de Brujas"
  ],

  "Viernes 13": [ // 1980
    "Friday the 13th" // English title
  ],

  "Pesadilla en la Calle del Infierno": [ // 1984
    "A Nightmare on Elm Street", // English title
    "Nightmare on Elm Street",
    "Freddy Krueger"
  ],

  "La Masacre de Texas": [ // 1974 & 2003
    "The Texas Chain Saw Massacre", // English title 1974
    "The Texas Chainsaw Massacre", // English title 2003
    "Texas Chainsaw Massacre",
    "Masacre de Texas"
  ],

  "Scream": [ // 1996 & 2022
    "Grita Antes de Morir"
  ],

  "La Cosa": [ // 1982 John Carpenter
    "The Thing", // English title
    "Thing"
  ],

  "El Resplandor": [ // 1980
    "The Shining" // English title
  ],

  "Carrie": [ // 1976 & 2013
    "Carrie 1976",
    "Carrie 2013"
  ],

  "Eso": [ // 2017 & 2019
    "It", // English title
    "IT"
  ],

  "Eso: Capítulo Dos": [ // 2019
    "Eso: Capitulo Dos", // Without accent
    "It Chapter Two", // English title
    "It 2"
  ],

  "El Conjuro": [ // 2013
    "The Conjuring" // English title
  ],

  "El Conjuro 2": [ // 2016
    "The Conjuring 2" // English title
  ],

  "El Conjuro: El Diablo me Obligó a Hacerlo": [ // 2021
    "El Conjuro: El Diablo me Obligo a Hacerlo", // Without accent
    "The Conjuring: The Devil Made Me Do It" // English title
  ],

  "Actividad Paranormal": [ // 2007
    "Paranormal Activity" // English title
  ],

  "¡Huye!": [ // 2017
    "Huye", // Without exclamation
    "Get Out" // English title
  ],

  "Nosotros": [ // 2019
    "Us" // English title
  ],

  // Fast & Furious - INDIVIDUAL FILMS
  "Rápidos y Furiosos": [ // 2001
    "Rapidos y Furiosos", // Without accent
    "The Fast and the Furious", // English title
    "Fast and Furious 1"
  ],

  "Más Rápido, Más Furioso": [ // 2003
    "Mas Rapido, Mas Furioso", // Without accents
    "2 Fast 2 Furious", // English title
    "Fast and Furious 2"
  ],

  "Rápidos y Furiosos: Reto Tokio": [ // 2006
    "Rapidos y Furiosos: Reto Tokio", // Without accent
    "The Fast and the Furious: Tokyo Drift", // English title
    "Tokyo Drift"
  ],

  "Rápidos y Furiosos 4": [ // 2009
    "Rapidos y Furiosos 4", // Without accent
    "Fast & Furious" // English title
  ],

  "Rápidos y Furiosos: 5in Control": [ // 2011
    "Rapidos y Furiosos: 5in Control", // Without accent
    "Fast Five", // English title
    "Rápidos y Furiosos 5",
    "Rapidos y Furiosos 5" // Without accent
  ],

  "Rápidos y Furiosos 6": [ // 2013
    "Rapidos y Furiosos 6", // Without accent
    "Fast & Furious 6" // English title
  ],

  "Rápidos y Furiosos 7": [ // 2015
    "Rapidos y Furiosos 7", // Without accent
    "Furious 7" // English title
  ],

  "Rápidos y Furiosos 8": [ // 2017
    "Rapidos y Furiosos 8", // Without accent
    "The Fate of the Furious", // English title
    "F8"
  ],

  "Rápidos y Furiosos 9": [ // 2021
    "Rapidos y Furiosos 9", // Without accent
    "F9" // English title
  ],

  "Rápidos y Furiosos X": [ // 2023
    "Rapidos y Furiosos X", // Without accent
    "Fast X" // English title
  ],

  // Mission: Impossible - INDIVIDUAL FILMS
  "Misión: Imposible": [ // 1996
    "Mision: Imposible", // Without accent
    "Mission: Impossible", // English title
    "Mission Impossible"
  ],

  "Misión: Imposible 2": [ // 2000
    "Mision: Imposible 2", // Without accent
    "Mission: Impossible 2" // English title
  ],

  "Misión: Imposible III": [ // 2006
    "Mision: Imposible III", // Without accent
    "Mission: Impossible III" // English title
  ],

  "Misión: Imposible - Protocolo Fantasma": [ // 2011
    "Mision: Imposible - Protocolo Fantasma", // Without accent
    "Mission: Impossible - Ghost Protocol", // English title
    "Protocolo Fantasma"
  ],

  "Misión: Imposible - Nación Secreta": [ // 2015
    "Mision: Imposible - Nacion Secreta", // Without accents
    "Mission: Impossible - Rogue Nation", // English title
    "Nación Secreta",
    "Nacion Secreta" // Without accent
  ],

  "Misión: Imposible - Repercusión": [ // 2018
    "Mision: Imposible - Repercusion", // Without accents
    "Mission: Impossible - Fallout", // English title
    "Repercusión",
    "Repercusion" // Without accent
  ],

  // Die Hard Series
  "Duro de Matar": [ // 1988
    "Die Hard" // English title
  ],

  "Duro de Matar 2": [ // 1990
    "Die Hard 2" // English title
  ],

  "Duro de Matar: La Venganza": [ // 1995
    "Die Hard with a Vengeance", // English title
    "Die Hard 3"
  ],

  "Duro de Matar 4.0": [ // 2007
    "Live Free or Die Hard", // English title
    "Die Hard 4"
  ],

  "Un Buen Día para Morir": [ // 2013
    "Un Buen Dia para Morir", // Without accent
    "A Good Day to Die Hard", // English title
    "Die Hard 5"
  ],

  // Lord of the Rings
  "El Señor de los Anillos: La Comunidad del Anillo": [
    "El Senor de los Anillos: La Comunidad del Anillo", // Without tilde
    "The Lord of the Rings: The Fellowship of the Ring", // English title
    "Fellowship of the Ring"
  ],

  "El Señor de los Anillos: Las Dos Torres": [
    "El Senor de los Anillos: Las Dos Torres", // Without tilde
    "The Lord of the Rings: The Two Towers", // English title
    "Two Towers"
  ],

  "El Señor de los Anillos: El Retorno del Rey": [
    "El Senor de los Anillos: El Retorno del Rey", // Without tilde
    "The Lord of the Rings: The Return of the King", // English title
    "Return of the King"
  ],

  // Back to the Future Trilogy
  "Volver al Futuro": [ // 1985
    "Back to the Future", // English title
    "BTTF"
  ],

  "Volver al Futuro II": [ // 1989
    "Back to the Future Part II", // English title
    "BTTF 2"
  ],

  "Volver al Futuro III": [ // 1990
    "Back to the Future Part III", // English title
    "BTTF 3"
  ],

  // Indiana Jones
  "En Busca del Arca Perdida": [
    "Raiders of the Lost Ark", // English title
    "Indiana Jones 1"
  ],

  "Indiana Jones y el Templo de la Perdición": [
    "Indiana Jones y el Templo de la Perdicion", // Without accent
    "Indiana Jones and the Temple of Doom", // English title
    "Temple of Doom"
  ],

  "Indiana Jones y la Última Cruzada": [
    "Indiana Jones y la Ultima Cruzada", // Without accent
    "Indiana Jones and the Last Crusade", // English title
    "Last Crusade"
  ],

  // Star Wars Original Trilogy
  "La Guerra de las Galaxias": [
    "Star Wars", // English title
    "A New Hope",
    "Una Nueva Esperanza"
  ],

  "El Imperio Contraataca": [
    "The Empire Strikes Back", // English title
    "Empire Strikes Back"
  ],

  "El Retorno del Jedi": [
    "Return of the Jedi" // English title
  ],

  // The Matrix Trilogy
  "Matrix": [ // 1999
    "The Matrix" // English title
  ],

  "Matrix Recargado": [ // 2003
    "The Matrix Reloaded", // English title
    "Matrix Reloaded"
  ],

  "Matrix Revoluciones": [ // 2003
    "The Matrix Revolutions", // English title
    "Matrix Revolutions"
  ],

  "Matrix Resurrecciones": [ // 2021
    "The Matrix Resurrections", // English title
    "Matrix Resurrections"
  ],

  // Terminator
  "Terminator": [ // 1984
    "The Terminator" // English title
  ],

  "Terminator 2: El Juicio Final": [ // 1991
    "Terminator 2: Judgment Day", // English title
    "T2"
  ],

  // Classic Movies with accent normalization
  "El Padrino": [
    "The Godfather", // English title
    "Godfather"
  ],

  "El Padrino Parte II": [
    "The Godfather Part II", // English title
    "Godfather 2"
  ],

  "Tiburón": [
    "Tiburon", // Without accent
    "Jaws" // English title
  ],

  "El Exorcista": [
    "The Exorcist" // English title
  ],

  "Psicosis": [
    "Psycho" // English title
  ],

  "El Ciudadano Kane": [
    "Citizen Kane" // English title
  ],

  "Lo que el Viento se Llevó": [
    "Lo que el Viento se Llevo", // Without accent
    "Gone with the Wind" // English title
  ],

  "El Mago de Oz": [
    "The Wizard of Oz" // English title
  ],

  "Cantando bajo la Lluvia": [
    "Singin' in the Rain", // English title
    "Singing in the Rain"
  ],

  "¡Qué Bello es Vivir!": [
    "Que Bello es Vivir", // Without accents/exclamation
    "It's a Wonderful Life" // English title
  ],

  // Pixar Movies with accent normalization
  "Los Increíbles": [
    "Los Increibles", // Without accent
    "The Incredibles" // English title
  ],

  "Los Increíbles 2": [
    "Los Increibles 2", // Without accent
    "Incredibles 2" // English title
  ],

  "Bichos": [
    "A Bug's Life" // English title
  ],

  "Monsters, Inc.": [
    "Monsters Inc"
  ],

  "El Viaje de Arlo": [
    "The Good Dinosaur" // English title
  ],

  "Intensamente": [
    "Inside Out" // English title
  ],

  "Valiente": [
    "Brave" // English title
  ],

  // Disney Movies with accent normalization
  "La Bella y la Bestia": [
    "Beauty and the Beast" // English title
  ],

  "La Sirenita": [
    "The Little Mermaid" // English title
  ],

  "El Rey León": [
    "El Rey Leon", // Without accent
    "The Lion King" // English title
  ],

  "Blancanieves y los Siete Enanitos": [
    "Snow White and the Seven Dwarfs", // English title
    "Snow White"
  ],

  "101 Dálmatas": [
    "101 Dalmatas", // Without accent
    "One Hundred and One Dalmatians" // English title
  ],

  "El Libro de la Selva": [
    "The Jungle Book" // English title
  ],

  "La Dama y el Vagabundo": [
    "Lady and the Tramp" // English title
  ],

  "La Bella Durmiente": [
    "Sleeping Beauty" // English title
  ],

  "El Jorobado de Notre Dame": [
    "The Hunchback of Notre Dame" // English title
  ],

  "Mulán": [
    "Mulan", // Without accent
    "Mulan" // English title
  ],

  "Tarzán": [
    "Tarzan", // Without accent
    "Tarzan" // English title
  ],

  "Las Locuras del Emperador": [
    "The Emperor's New Groove" // English title
  ],

  "Lilo y Stitch": [
    "Lilo & Stitch" // English title
  ],

  "El Planeta del Tesoro": [
    "Treasure Planet" // English title
  ],

  "Hermano Oso": [
    "Brother Bear" // English title
  ],

  "Chicken Little": [
    "Pollo Pequeño"
  ],

  "Descubriendo a los Robinsons": [
    "Meet the Robinsons" // English title
  ],

  "Tiana y el Sapo": [
    "The Princess and the Frog" // English title
  ],

  "Enredados": [
    "Tangled" // English title
  ],

  "¡Rompe Ralph!": [
    "Rompe Ralph", // Without exclamations
    "Wreck-It Ralph", // English title
    "Wreck It Ralph"
  ],

  "Ralph Rompe Internet": [
    "Ralph Breaks the Internet", // English title
    "Wreck-It Ralph 2"
  ],

  "Frozen": [
    "Una Aventura Congelada"
  ],

  "Frozen II": [
    "Una Aventura Congelada 2"
  ],

  "Grandes Héroes": [
    "Grandes Heroes", // Without accent
    "Big Hero 6" // English title
  ],

  "Raya y el Último Dragón": [
    "Raya y el Ultimo Dragon", // Without accents
    "Raya and the Last Dragon" // English title
  ],

  // Common abbreviations and variations
  "E.T. el Extraterrestre": [
    "ET",
    "E.T.",
    "E.T. the Extra-Terrestrial" // English title
  ],

  "2001: Odisea del Espacio": [
    "2001: A Space Odyssey" // English title
  ]
};
