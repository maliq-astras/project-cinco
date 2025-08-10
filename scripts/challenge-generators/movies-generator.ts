// scripts/challenge-generators/movies-generator.ts
import { CategoryType, MovieFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';
import * as fs from 'fs';
import * as path from 'path';

// Movie fact types
const movieFactTypes: MovieFactType[] = [
  "Behind the Scenes",
  "Premiere",
  "Characters", 
  "Genre",
  "Critical Reception",
  "Box Office",
  "Famous Lines",
  "Wildcard"
];

// Load real challenge data from JSON files
function loadMovieData() {
  const moviesDir = path.join(__dirname, '../../challenges/movies');
  const movieFiles = fs.readdirSync(moviesDir).filter(file => file.endsWith('.json'));
  
  return movieFiles.map(file => {
    const filePath = path.join(moviesDir, file);
    const movieData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Transform the data to match the expected format
    return {
      answer: movieData.answer,
      facts: movieData.facts,
      expanded: movieData.expanded,
      alternatives: movieData.alternatives,
      imageUrl: movieData.imageUrl,
      youtubeUrl: movieData.youtubeUrl,
      citation: movieData.citation
    };
  });
}

// Movies data with facts for each fact type (fallback data)
const fallbackMovieData = [
  {
    answer: {
      en: "The Godfather",
      es: "El Padrino"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/movies/the_godfather.jpg",
    facts: {
      "Behind the Scenes": {
        en: "I was directed by Francis Ford Coppola, who was initially reluctant to take the project and faced constant studio pressure, while Marlon Brando stuffed his cheeks with cotton balls to create Don Vito's distinctive appearance and speaking style.",
        es: "Fui dirigido por Francis Ford Coppola, quien inicialmente fue reacio a tomar el proyecto y enfrentó presión constante del estudio, mientras Marlon Brando se rellenó las mejillas con bolas de algodón para crear la apariencia distintiva y estilo de habla de Don Vito."
      },
      "Premiere": {
        en: "I premiered on March 14, 1972, at the Loew's State Theatre in New York City, becoming an immediate cultural phenomenon and redefining what audiences expected from crime dramas and epic storytelling in cinema.",
        es: "Me estrené el 14 de marzo de 1972, en el Loew's State Theatre en la Ciudad de Nueva York, convirtiéndome en un fenómeno cultural inmediato y redefiniendo lo que las audiencias esperaban de dramas criminales y narrativa épica en el cine."
      },
      "Character(s)": {
        en: "My central characters include Don Vito Corleone, the aging patriarch of a powerful crime family, his reluctant heir Michael Corleone who transforms from war hero to ruthless don, and his hot-headed son Sonny, along with loyal family advisor Tom Hagen.",
        es: "Mis personajes centrales incluyen a Don Vito Corleone, el patriarca envejeciente de una poderosa familia criminal, su heredero reacio Michael Corleone quien se transforma de héroe de guerra a don despiadado, y su hijo impulsivo Sonny, junto con el consejero familiar leal Tom Hagen."
      },
      "Genre": {
        en: "I am a crime drama and family saga that elevated the gangster genre from simple crime stories to epic tales of power, family loyalty, tradition, and the American Dream's dark underbelly, blending intimate character study with sweeping historical narrative.",
        es: "Soy un drama criminal y saga familiar que elevé el género de gángsters de simples historias criminales a relatos épicos de poder, lealtad familiar, tradición y el lado oscuro del Sueño Americano, mezclando estudio íntimo de personajes con narrativa histórica amplia."
      },
      "Critical Reception": {
        en: "I received universal critical acclaim and won three Academy Awards including Best Picture, Best Actor for Marlon Brando, and Best Adapted Screenplay, and I'm consistently ranked as one of the greatest films ever made by critics and film institutions worldwide.",
        es: "Recibí aclamación crítica universal y gané tres Premios de la Academia incluyendo Mejor Película, Mejor Actor para Marlon Brando, y Mejor Guión Adaptado, y consistentemente soy clasificado como una de las mejores películas jamás hechas por críticos e instituciones de cine mundialmente."
      },
      "Box Office": {
        en: "I was the highest-grossing film of 1972, earning over $245 million worldwide against a budget of just $6 million, proving that serious, adult-oriented dramas could be both critically acclaimed and commercially successful blockbusters.",
        es: "Fui la película más taquillera de 1972, ganando más de $245 millones mundialmente contra un presupuesto de solo $6 millones, probando que dramas serios orientados a adultos podían ser tanto aclamados por la crítica como blockbusters comercialmente exitosos."
      },
      "Famous Line": {
        en: "My most iconic line is 'I'm gonna make him an offer he can't refuse,' delivered by Marlon Brando as Don Vito Corleone, which has become one of the most quoted and parodied lines in cinema history, perfectly capturing the character's persuasive menace.",
        es: "Mi línea más icónica es 'Le voy a hacer una oferta que no puede rechazar,' entregada por Marlon Brando como Don Vito Corleone, que se ha convertido en una de las líneas más citadas y parodiadas en la historia del cine, capturando perfectamente la amenaza persuasiva del personaje."
      },
      "Wildcard": {
        en: "The severed horse head scene used a real horse head obtained from a dog food factory, and Marlon Brando improvised playing with the cat during the opening scene, while the movie was initially intended to be set in contemporary times before Coppola insisted on the period setting.",
        es: "La escena de la cabeza de caballo cortada usó una cabeza de caballo real obtenida de una fábrica de comida para perros, y Marlon Brando improvisó jugar con el gato durante la escena de apertura, mientras la película inicialmente estaba destinada a ser ambientada en tiempos contemporáneos antes de que Coppola insistiera en la ambientación de época."
      }
    },
    alternatives: {
      en: ["Goodfellas", "Scarface", "The Godfather Part II", "Casino", "Once Upon a Time in America", "Donnie Brasco", "The Departed", "Pulp Fiction", "The Sopranos"],
      es: ["Goodfellas", "Scarface", "El Padrino Parte II", "Casino", "Érase una Vez en América", "Donnie Brasco", "The Departed", "Pulp Fiction", "The Sopranos"]
    }
  },
  {
    answer: {
      en: "Pulp Fiction",
      es: "Pulp Fiction"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/movies/pulp_fiction.jpg",
    facts: {
      "Behind the Scenes": {
        en: "I was written and directed by Quentin Tarantino, who structured me with a non-linear narrative that was revolutionary for mainstream cinema, while John Travolta's participation revitalized his career and the film was shot on a relatively modest budget of $8 million.",
        es: "Fui escrito y dirigido por Quentin Tarantino, quien me estructuró con una narrativa no lineal que fue revolucionaria para el cine mainstream, mientras la participación de John Travolta revitalizó su carrera y la película fue filmada con un presupuesto relativamente modesto de $8 millones."
      },
      "Premiere": {
        en: "I premiered at the Cannes Film Festival on May 21, 1994, where I won the Palme d'Or, and then had my theatrical release on October 14, 1994, becoming a cultural phenomenon that redefined independent filmmaking and pop culture dialogue.",
        es: "Me estrené en el Festival de Cine de Cannes el 21 de mayo de 1994, donde gané la Palma de Oro, y luego tuve mi lanzamiento teatral el 14 de octubre de 1994, convirtiéndome en un fenómeno cultural que redefinió el cine independiente y el diálogo de la cultura pop."
      },
      "Character(s)": {
        en: "My ensemble cast includes Vincent Vega and Jules Winnfield, two philosophical hitmen; Mia Wallace, the gangster's wife; Butch Coolidge, the aging boxer; and Marsellus Wallace, the powerful crime boss, all interconnected through my interwoven storylines.",
        es: "Mi reparto de conjunto incluye a Vincent Vega y Jules Winnfield, dos sicarios filosóficos; Mia Wallace, la esposa del gángster; Butch Coolidge, el boxeador envejeciente; y Marsellus Wallace, el poderoso jefe criminal, todos interconectados a través de mis líneas argumentales entretejidas."
      },
      "Genre": {
        en: "I am a crime film with elements of black comedy, thriller, and neo-noir, known for my genre-blending approach that combines violence with humor, pop culture references, and philosophical discussions, creating a unique postmodern cinematic experience.",
        es: "Soy una película criminal con elementos de comedia negra, thriller y neo-noir, conocido por mi enfoque de mezcla de géneros que combina violencia con humor, referencias de cultura pop y discusiones filosóficas, creando una experiencia cinematográfica postmoderna única."
      },
      "Critical Reception": {
        en: "I received widespread critical acclaim and won the Academy Award for Best Original Screenplay, while being nominated for seven Oscars total, and I'm consistently ranked among the greatest films ever made, credited with revitalizing independent cinema in the 1990s.",
        es: "Recibí aclamación crítica amplia y gané el Premio de la Academia por Mejor Guión Original, mientras fui nominado para siete Oscars en total, y consistentemente soy clasificado entre las mejores películas jamás hechas, acreditado con revitalizar el cine independiente en los años 90."
      },
      "Box Office": {
        en: "I earned over $214 million worldwide against my $8 million budget, becoming Miramax's highest-grossing film at the time and proving that innovative, dialogue-heavy independent films could achieve massive commercial success without compromising artistic vision.",
        es: "Gané más de $214 millones mundialmente contra mi presupuesto de $8 millones, convirtiéndome en la película más taquillera de Miramax en ese momento y probando que películas independientes innovadoras y pesadas en diálogo podían lograr éxito comercial masivo sin comprometer la visión artística."
      },
      "Famous Line": {
        en: "My most quoted line is 'Say 'what' again! I dare you, I double dare you!' delivered by Samuel L. Jackson as Jules Winnfield, along with the philosophical 'Ezekiel 25:17' speech that became iconic in pop culture and spawned countless imitations and parodies.",
        es: "Mi línea más citada es '¡Di 'qué' otra vez! ¡Te desafío, te doble desafío!' entregada por Samuel L. Jackson como Jules Winnfield, junto con el discurso filosófico 'Ezequiel 25:17' que se volvió icónico en la cultura pop y generó innumerables imitaciones y parodias."
      },
      "Wildcard": {
        en: "My briefcase's contents are never revealed, creating one of cinema's greatest mysteries, while the famous twist dance scene between John Travolta and Uma Thurman was choreographed by Travolta himself, and I feature numerous references to other films and pop culture throughout my runtime.",
        es: "Los contenidos de mi maletín nunca son revelados, creando uno de los mayores misterios del cine, mientras la famosa escena de baile twist entre John Travolta y Uma Thurman fue coreografiada por el propio Travolta, y presento numerosas referencias a otras películas y cultura pop durante mi duración."
      }
    },
    alternatives: {
      en: ["Reservoir Dogs", "Kill Bill", "Inglourious Basterds", "Django Unchained", "Goodfellas", "Fargo", "No Country for Old Men", "The Big Lebowski", "Snatch"],
      es: ["Reservoir Dogs", "Kill Bill", "Inglourious Basterds", "Django Unchained", "Goodfellas", "Fargo", "No Country for Old Men", "The Big Lebowski", "Snatch"]
    }
  },
  {
    answer: {
      en: "Casablanca",
      es: "Casablanca"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/movies/casablanca.jpg",
    facts: {
      "Behind the Scenes": {
        en: "I was directed by Michael Curtiz and filmed during World War II while the outcome was still uncertain, with my script being constantly rewritten during filming, and many of my cast members were actual European refugees who had fled Nazi persecution.",
        es: "Fui dirigido por Michael Curtiz y filmado durante la Segunda Guerra Mundial mientras el resultado aún era incierto, con mi guión siendo constantemente reescrito durante el filmado, y muchos de los miembros de mi reparto eran refugiados europeos reales que habían huido de la persecución nazi."
      },
      "Premiere": {
        en: "I premiered on November 26, 1942, at the Hollywood Theatre in New York City, just weeks after the Allied invasion of North Africa made my setting particularly relevant, and I went on to become one of the most beloved films in cinema history.",
        es: "Me estrené el 26 de noviembre de 1942, en el Hollywood Theatre en la Ciudad de Nueva York, solo semanas después de que la invasión Aliada del Norte de África hiciera mi ambientación particularmente relevante, y continué convirtiéndome en una de las películas más queridas en la historia del cine."
      },
      "Character(s)": {
        en: "My story centers on Rick Blaine, a cynical American expatriate who runs a nightclub in wartime Casablanca, his former lover Ilsa Lund who arrives with her resistance leader husband Victor Laszlo, and Captain Louis Renault, the corrupt but charming French police chief.",
        es: "Mi historia se centra en Rick Blaine, un expatriado americano cínico que maneja un club nocturno en la Casablanca en tiempos de guerra, su ex amante Ilsa Lund quien llega con su esposo líder de la resistencia Victor Laszlo, y el Capitán Louis Renault, el jefe de policía francés corrupto pero encantador."
      },
      "Genre": {
        en: "I am a romantic drama with elements of war film and political thriller, set against the backdrop of World War II, exploring themes of love, sacrifice, moral choices, and the conflict between personal desires and greater good during wartime.",
        es: "Soy un drama romántico con elementos de película de guerra y thriller político, ambientado contra el telón de fondo de la Segunda Guerra Mundial, explorando temas de amor, sacrificio, elecciones morales y el conflicto entre deseos personales y el bien mayor durante tiempos de guerra."
      },
      "Critical Reception": {
        en: "I won three Academy Awards including Best Picture, Best Director, and Best Adapted Screenplay, and have been consistently ranked as one of the greatest films ever made, with the American Film Institute naming me the greatest American film of all time in some rankings.",
        es: "Gané tres Premios de la Academia incluyendo Mejor Película, Mejor Director y Mejor Guión Adaptado, y he sido consistentemente clasificado como una de las mejores películas jamás hechas, con el Instituto de Cine Americano nombrándome la mejor película americana de todos los tiempos en algunos rankings."
      },
      "Box Office": {
        en: "I was a solid commercial success upon release, earning over $3.7 million against my $1 million budget, and my popularity has only grown over the decades through television broadcasts, home video, and theatrical re-releases, making me a timeless classic.",
        es: "Fui un éxito comercial sólido al lanzamiento, ganando más de $3.7 millones contra mi presupuesto de $1 millón, y mi popularidad solo ha crecido durante las décadas a través de transmisiones televisivas, video casero y relanzamientos teatrales, haciéndome un clásico atemporal."
      },
      "Famous Line": {
        en: "My most famous line is 'Here's looking at you, kid,' spoken by Humphrey Bogart to Ingrid Bergman, along with 'We'll always have Paris' and 'Play it again, Sam' (though the exact phrase is never actually said), all of which have become part of popular culture lexicon.",
        es: "Mi línea más famosa es 'Aquí te miro, niña,' hablada por Humphrey Bogart a Ingrid Bergman, junto con 'Siempre tendremos París' y 'Tócala otra vez, Sam' (aunque la frase exacta nunca es realmente dicha), todas las cuales se han convertido en parte del léxico de la cultura popular."
      },
      "Wildcard": {
        en: "I was based on an unproduced stage play called 'Everybody Comes to Rick's,' and my famous ending was decided during filming as the script was still being written, while the letters of transit that drive my plot are historically inaccurate but dramatically essential to my story.",
        es: "Estuve basado en una obra de teatro no producida llamada 'Everybody Comes to Rick's,' y mi famoso final fue decidido durante el filmado ya que el guión aún estaba siendo escrito, mientras las cartas de tránsito que impulsan mi trama son históricamente inexactas pero dramáticamente esenciales para mi historia."
      }
    },
    alternatives: {
      en: ["Gone with the Wind", "The Maltese Falcon", "To Have and Have Not", "The African Queen", "Roman Holiday", "Sunset Boulevard", "All About Eve", "Citizen Kane", "The Best Years of Our Lives"],
      es: ["Lo que el Viento se Llevó", "El Halcón Maltés", "Tener y No Tener", "La Reina de África", "Vacaciones en Roma", "Sunset Boulevard", "All About Eve", "Citizen Kane", "Los Mejores Años de Nuestras Vidas"]
    }
  }
];

export class MoviesGenerator extends BaseChallengeGenerator {
  constructor() {
    // Try to load real data, fall back to hardcoded data if needed
    let dataToUse;
    try {
      dataToUse = loadMovieData();
      console.log(`Loaded ${dataToUse.length} real movie challenges from JSON files`);
    } catch (error) {
      console.warn('Could not load real movie data, using fallback data:', error);
      dataToUse = fallbackMovieData;
    }
    
    super(CategoryType.MOVIES, movieFactTypes, dataToUse);
  }
}