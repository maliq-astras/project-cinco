// scripts/challenge-generators/tv-shows-generator.ts
import { CategoryType, TvShowFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// TV show fact types
const tvShowFactTypes: TvShowFactType[] = [
  "Genre",
  "Debut",
  "Character(s)", 
  "Season Structure",
  "Iconic Episode",
  "Network/Platform",
  "Visual Style",
  "Wildcard"
];

// TV shows data with facts for each fact type
const tvShowData = [
  {
    answer: {
      en: "Breaking Bad",
      es: "Breaking Bad"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/tv/breaking_bad.jpg",
    facts: {
      "Genre": {
        en: "I am a crime drama and neo-noir thriller that follows the transformation of my protagonist from a mild-mannered high school chemistry teacher into a ruthless methamphetamine manufacturer and dealer.",
        es: "Soy un drama criminal y thriller neo-noir que sigue la transformación de mi protagonista de un profesor de química de secundaria apacible a un fabricante y traficante de metanfetamina despiadado."
      },
      "Debut": {
        en: "I premiered on January 20, 2008, on AMC and ran for five seasons until September 29, 2013, helping to establish AMC as a premium destination for original dramatic programming.",
        es: "Me estrené el 20 de enero de 2008, en AMC y duré cinco temporadas hasta el 29 de septiembre de 2013, ayudando a establecer AMC como un destino premium para programación dramática original."
      },
      "Character(s)": {
        en: "My central character is Walter White, a high school chemistry teacher turned meth cook, alongside his former student and partner Jesse Pinkman, his DEA agent brother-in-law Hank Schrader, and the menacing drug lord Gus Fring.",
        es: "Mi personaje central es Walter White, un profesor de química de secundaria convertido en cocinero de metanfetamina, junto con su ex estudiante y socio Jesse Pinkman, su cuñado agente de la DEA Hank Schrader, y el amenazante señor de la droga Gus Fring."
      },
      "Season Structure": {
        en: "I consisted of 62 episodes across five seasons, with the final season split into two parts: the first eight episodes aired in 2012, and the final eight episodes aired in 2013, building to an intense climactic conclusion.",
        es: "Consistí en 62 episodios a través de cinco temporadas, con la temporada final dividida en dos partes: los primeros ocho episodios se emitieron en 2012, y los últimos ocho episodios se emitieron en 2013, construyendo hacia una conclusión climática intensa."
      },
      "Iconic Episode": {
        en: "My episode 'Ozymandias' is widely considered one of the greatest television episodes ever made, where Walter's criminal empire finally collapses and his family discovers the truth about his double life, leading to devastating consequences.",
        es: "Mi episodio 'Ozymandias' es ampliamente considerado uno de los mejores episodios de televisión jamás hechos, donde el imperio criminal de Walter finalmente colapsa y su familia descubre la verdad sobre su doble vida, llevando a consecuencias devastadoras."
      },
      "Network/Platform": {
        en: "I originally aired on AMC (American Movie Classics) and helped transform the network from a classic movie channel into a powerhouse for critically acclaimed original series, paving the way for shows like Mad Men and The Walking Dead.",
        es: "Originalmente me emití en AMC (American Movie Classics) y ayudé a transformar la cadena de un canal de películas clásicas a una potencia para series originales aclamadas por la crítica, abriendo camino para shows como Mad Men y The Walking Dead."
      },
      "Visual Style": {
        en: "My cinematography is known for its distinctive visual style, including creative camera angles, symbolic color palettes (especially the use of green and yellow), and stark desert landscapes of Albuquerque, New Mexico, that reflect the moral desolation of my characters.",
        es: "Mi cinematografía es conocida por su estilo visual distintivo, incluyendo ángulos de cámara creativos, paletas de colores simbólicas (especialmente el uso de verde y amarillo), y paisajes desérticos austeros de Albuquerque, Nuevo México, que reflejan la desolación moral de mis personajes."
      },
      "Wildcard": {
        en: "My creator Vince Gilligan originally pitched me as a show about 'turning Mr. Chips into Scarface,' and the famous pizza-throwing scene was achieved in one take, with the pizza coincidentally landing perfectly on the roof without any special effects.",
        es: "Mi creador Vince Gilligan originalmente me propuso como un show sobre 'convertir al Sr. Chips en Scarface,' y la famosa escena de lanzar pizza se logró en una toma, con la pizza coincidentemente aterrizando perfectamente en el techo sin efectos especiales."
      }
    },
    alternatives: {
      en: ["Better Call Saul", "The Sopranos", "The Wire", "Dexter", "Narcos", "Ozark", "Mad Men", "Fargo", "True Detective"],
      es: ["Better Call Saul", "The Sopranos", "The Wire", "Dexter", "Narcos", "Ozark", "Mad Men", "Fargo", "True Detective"]
    }
  },
  {
    answer: {
      en: "The Office",
      es: "The Office"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/tv/the_office.jpg",
    facts: {
      "Genre": {
        en: "I am a mockumentary-style sitcom that uses a documentary crew format to showcase the daily lives of office employees at a paper company, blending workplace comedy with character-driven romantic storylines.",
        es: "Soy una sitcom de estilo mockumentary que usa un formato de equipo documental para mostrar las vidas diarias de empleados de oficina en una empresa de papel, mezclando comedia de lugar de trabajo con líneas argumentales románticas impulsadas por personajes."
      },
      "Debut": {
        en: "I premiered on March 24, 2005, on NBC and ran for nine seasons until May 16, 2013, becoming one of the most beloved and quotable sitcoms in television history, with a massive resurgence in popularity through streaming platforms.",
        es: "Me estrené el 24 de marzo de 2005, en NBC y duré nueve temporadas hasta el 16 de mayo de 2013, convirtiéndome en una de las sitcoms más queridas y citables en la historia de la televisión, con un resurgimiento masivo en popularidad a través de plataformas de streaming."
      },
      "Character(s)": {
        en: "My ensemble cast is led by Michael Scott, the well-meaning but inappropriate regional manager, along with Jim Halpert and his pranks on Dwight Schrute, the romantic relationship between Jim and Pam Beesly, and quirky supporting characters like Kevin, Angela, and Creed.",
        es: "Mi reparto de conjunto está liderado por Michael Scott, el gerente regional bien intencionado pero inapropiado, junto con Jim Halpert y sus bromas a Dwight Schrute, la relación romántica entre Jim y Pam Beesly, y personajes de apoyo peculiares como Kevin, Angela y Creed."
      },
      "Season Structure": {
        en: "I consisted of 201 episodes across nine seasons, with my most critically acclaimed seasons being 2-4, though I experienced a notable shift in tone after Steve Carell's departure following season 7, leading to new storylines and character development.",
        es: "Consistí en 201 episodios a través de nueve temporadas, con mis temporadas más aclamadas por la crítica siendo 2-4, aunque experimenté un cambio notable en tono después de la partida de Steve Carell siguiendo la temporada 7, llevando a nuevas líneas argumentales y desarrollo de personajes."
      },
      "Iconic Episode": {
        en: "My episode 'Dinner Party' is often cited as one of my best, showcasing Michael's awkward home life with Jan in a cringe-comedy masterpiece, while 'The Dundies' and 'Casino Night' are also fan favorites that perfectly capture my unique blend of humor and heart.",
        es: "Mi episodio 'Dinner Party' es a menudo citado como uno de mis mejores, mostrando la vida hogareña incómoda de Michael con Jan en una obra maestra de comedia vergonzosa, mientras 'The Dundies' y 'Casino Night' también son favoritos de los fanáticos que capturan perfectamente mi mezcla única de humor y corazón."
      },
      "Network/Platform": {
        en: "I originally aired on NBC but found my greatest success and cultural impact through streaming on Netflix, where I became the most-watched show for several years, and later moved to Peacock, demonstrating the power of streaming to revitalize series.",
        es: "Originalmente me emití en NBC pero encontré mi mayor éxito e impacto cultural a través del streaming en Netflix, donde me convertí en el show más visto por varios años, y más tarde me mudé a Peacock, demostrando el poder del streaming para revitalizar series."
      },
      "Visual Style": {
        en: "My handheld camera work and documentary-style interviews create an intimate, realistic feel, with characters frequently breaking the fourth wall by looking directly at the camera, while my muted color palette and fluorescent office lighting enhance the mundane workplace setting.",
        es: "Mi trabajo de cámara de mano y entrevistas de estilo documental crean una sensación íntima y realista, con personajes frecuentemente rompiendo la cuarta pared mirando directamente a la cámara, mientras mi paleta de colores apagados e iluminación fluorescente de oficina realzan el ambiente mundano del lugar de trabajo."
      },
      "Wildcard": {
        en: "I am based on the original British series created by Ricky Gervais and Stephen Merchant, and many of my most famous scenes were improvised, including Jim's reactions to the camera, while the Dundie Award that Michael gives to Phyllis is a real award that the prop department forgot to make fake.",
        es: "Estoy basado en la serie británica original creada por Ricky Gervais y Stephen Merchant, y muchas de mis escenas más famosas fueron improvisadas, incluyendo las reacciones de Jim a la cámara, mientras el Premio Dundie que Michael le da a Phyllis es un premio real que el departamento de utilería olvidó hacer falso."
      }
    },
    alternatives: {
      en: ["Parks and Recreation", "Brooklyn Nine-Nine", "Arrested Development", "30 Rock", "Community", "Scrubs", "Friends", "The Office (UK)", "Modern Family"],
      es: ["Parks and Recreation", "Brooklyn Nine-Nine", "Arrested Development", "30 Rock", "Community", "Scrubs", "Friends", "The Office (UK)", "Modern Family"]
    }
  },
  {
    answer: {
      en: "Game of Thrones",
      es: "Juego de Tronos"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/tv/game_of_thrones.jpg",
    facts: {
      "Genre": {
        en: "I am an epic fantasy drama series with elements of political intrigue, medieval warfare, supernatural horror, and complex character relationships, set in the fictional continents of Westeros and Essos with dragons, magic, and warring kingdoms.",
        es: "Soy una serie dramática de fantasía épica con elementos de intriga política, guerra medieval, horror sobrenatural y relaciones complejas de personajes, ambientada en los continentes ficticios de Westeros y Essos con dragones, magia y reinos en guerra."
      },
      "Debut": {
        en: "I premiered on April 17, 2011, on HBO and concluded on May 19, 2019, after eight seasons, becoming HBO's most-watched series and a global cultural phenomenon that redefined television production values and storytelling scope.",
        es: "Me estrené el 17 de abril de 2011, en HBO y concluí el 19 de mayo de 2019, después de ocho temporadas, convirtiéndome en la serie más vista de HBO y un fenómeno cultural global que redefinió los valores de producción televisiva y el alcance narrativo."
      },
      "Character(s)": {
        en: "My vast ensemble includes Jon Snow, the bastard son who becomes a leader; Daenerys Targaryen, the Mother of Dragons; Tyrion Lannister, the clever dwarf; Arya Stark, the young assassin; and Cersei Lannister, the ruthless queen, among dozens of other memorable characters.",
        es: "Mi vasto reparto incluye a Jon Snow, el hijo bastardo que se convierte en líder; Daenerys Targaryen, la Madre de Dragones; Tyrion Lannister, el enano inteligente; Arya Stark, la joven asesina; y Cersei Lannister, la reina despiadada, entre docenas de otros personajes memorables."
      },
      "Season Structure": {
        en: "I consisted of 73 episodes across eight seasons, with seasons 1-6 containing 10 episodes each, season 7 having 7 episodes, and the final season having 6 feature-length episodes, with each season typically covering major plot developments and character arcs.",
        es: "Consistí en 73 episodios a través de ocho temporadas, con las temporadas 1-6 conteniendo 10 episodios cada una, la temporada 7 teniendo 7 episodios, y la temporada final teniendo 6 episodios de duración de largometraje, con cada temporada típicamente cubriendo desarrollos de trama importantes y arcos de personajes."
      },
      "Iconic Episode": {
        en: "My episode 'The Rains of Castamere' (Red Wedding) shocked audiences worldwide with its brutal betrayal and character deaths, while 'Battle of the Bastards' became famous for its epic battle sequences and cinematography, and 'The Winds of Winter' delivered explosive plot resolutions.",
        es: "Mi episodio 'The Rains of Castamere' (Boda Roja) impactó a audiencias mundialmente con su traición brutal y muertes de personajes, mientras 'Battle of the Bastards' se hizo famoso por sus secuencias de batalla épicas y cinematografía, y 'The Winds of Winter' entregó resoluciones explosivas de trama."
      },
      "Network/Platform": {
        en: "I aired exclusively on HBO and became the network's flagship series, demonstrating HBO's commitment to high-budget, cinematic television that rivals Hollywood blockbusters in scope and production value, setting new standards for premium cable programming.",
        es: "Me emití exclusivamente en HBO y me convertí en la serie insignia de la cadena, demostrando el compromiso de HBO con televisión cinematográfica de alto presupuesto que rivaliza con blockbusters de Hollywood en alcance y valor de producción, estableciendo nuevos estándares para programación de cable premium."
      },
      "Visual Style": {
        en: "My production featured elaborate costumes, practical effects, massive sets across multiple countries including Northern Ireland, Spain, and Iceland, combined with groundbreaking CGI for dragons and large-scale battles, creating a visually stunning and immersive fantasy world.",
        es: "Mi producción presentó vestuarios elaborados, efectos prácticos, sets masivos a través de múltiples países incluyendo Irlanda del Norte, España e Islandia, combinados con CGI revolucionario para dragones y batallas a gran escala, creando un mundo de fantasía visualmente impresionante e inmersivo."
      },
      "Wildcard": {
        en: "I am based on George R.R. Martin's 'A Song of Ice and Fire' book series, but I eventually outpaced the source material, leading to original storylines in later seasons, and my final season received mixed reviews despite being one of the most-watched television events in history.",
        es: "Estoy basado en la serie de libros 'Canción de Hielo y Fuego' de George R.R. Martin, pero eventualmente superé el material fuente, llevando a líneas argumentales originales en temporadas posteriores, y mi temporada final recibió reseñas mixtas a pesar de ser uno de los eventos televisivos más vistos en la historia."
      }
    },
    alternatives: {
      en: ["House of the Dragon", "The Witcher", "Lord of the Rings: The Rings of Power", "Vikings", "The Last Kingdom", "Westworld", "Rome", "Spartacus", "Marco Polo"],
      es: ["House of the Dragon", "The Witcher", "El Señor de los Anillos: Los Anillos de Poder", "Vikings", "The Last Kingdom", "Westworld", "Rome", "Spartacus", "Marco Polo"]
    }
  }
];

export class TvShowsGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.TV_SHOWS, tvShowFactTypes, tvShowData);
  }
}