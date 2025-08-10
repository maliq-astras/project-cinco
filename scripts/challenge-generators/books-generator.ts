// scripts/challenge-generators/books-generator.ts
import { CategoryType, BookFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Book fact types
const bookFactTypes: BookFactType[] = [
  "Author",
  "Illustration/Cover",
  "Characters", 
  "Genre",
  "Publication Date",
  "Plot",
  "Quote",
  "Wildcard"
];

// Books data with facts for each fact type
const bookData = [
  {
    answer: {
      en: "To Kill a Mockingbird",
      es: "Matar un Ruiseñor"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/books/to_kill_a_mockingbird.jpg",
    facts: {
      "Author": {
        en: "I was written by Harper Lee, who won the Pulitzer Prize for Fiction in 1961 for this, her first and most famous novel, though she remained famously reclusive and didn't publish another book until 2015 with 'Go Set a Watchman.'",
        es: "Fui escrito por Harper Lee, quien ganó el Premio Pulitzer de Ficción en 1961 por esta, su primera y más famosa novela, aunque se mantuvo famosamente reservada y no publicó otro libro hasta 2015 con 'Go Set a Watchman'."
      },
      "Illustration/Cover": {
        en: "My most iconic cover features a simple illustration of a mockingbird perched on a bare tree branch against a stark background, symbolizing the innocence and vulnerability that are central themes throughout my narrative.",
        es: "Mi portada más icónica presenta una ilustración simple de un ruiseñor posado en una rama de árbol desnuda contra un fondo austero, simbolizando la inocencia y vulnerabilidad que son temas centrales a lo largo de mi narrativa."
      },
      "Character(s)": {
        en: "My story is narrated by Scout Finch, a young girl who observes her father Atticus Finch, a lawyer defending a Black man in 1930s Alabama, along with her brother Jem and their mysterious neighbor Boo Radley.",
        es: "Mi historia es narrada por Scout Finch, una niña que observa a su padre Atticus Finch, un abogado defendiendo a un hombre negro en Alabama de los años 1930, junto con su hermano Jem y su misterioso vecino Boo Radley."
      },
      "Genre": {
        en: "I am primarily a coming-of-age novel with elements of social drama and legal thriller, exploring themes of racial injustice, moral courage, and the loss of innocence in the American South during the Great Depression.",
        es: "Soy principalmente una novela de mayoría de edad con elementos de drama social y thriller legal, explorando temas de injusticia racial, coraje moral, y la pérdida de inocencia en el Sur americano durante la Gran Depresión."
      },
      "Publication Date": {
        en: "I was first published on July 11, 1960, by J.B. Lippincott & Co., and became an immediate bestseller, remaining continuously in print and becoming one of the most widely read books in American literature.",
        es: "Fui publicado por primera vez el 11 de julio de 1960, por J.B. Lippincott & Co., y me convertí en un bestseller inmediato, permaneciendo continuamente en impresión y convirtiéndome en uno de los libros más ampliamente leídos en la literatura americana."
      },
      "Plot": {
        en: "My story follows Scout Finch as she grows up in fictional Maycomb, Alabama, witnessing her father defend Tom Robinson, a Black man falsely accused of rape, while also unraveling the mystery of the reclusive Boo Radley who ultimately saves Scout and Jem from attack.",
        es: "Mi historia sigue a Scout Finch mientras crece en el ficticio Maycomb, Alabama, siendo testigo de su padre defendiendo a Tom Robinson, un hombre negro falsamente acusado de violación, mientras también desentraña el misterio del recluso Boo Radley quien finalmente salva a Scout y Jem de un ataque."
      },
      "Quote": {
        en: "I contain the memorable quote 'You never really understand a person until you consider things from his point of view... until you climb into his skin and walk around in it,' which has become a cornerstone of empathy and understanding.",
        es: "Contengo la cita memorable 'Nunca realmente entiendes a una persona hasta que consideras las cosas desde su punto de vista... hasta que te metes en su piel y caminas en ella,' que se ha convertido en una piedra angular de empatía y entendimiento."
      },
      "Wildcard": {
        en: "I was initially titled 'Atticus' and was rejected by several publishers before being accepted, and my author Harper Lee was childhood friends with Truman Capote, who inspired the character of Dill Harris in my story.",
        es: "Inicialmente fui titulado 'Atticus' y fui rechazado por varios editores antes de ser aceptado, y mi autora Harper Lee fue amiga de la infancia de Truman Capote, quien inspiró el personaje de Dill Harris en mi historia."
      }
    },
    alternatives: {
      en: ["The Great Gatsby", "1984", "Pride and Prejudice", "The Catcher in the Rye", "Lord of the Flies", "Of Mice and Men", "The Grapes of Wrath", "Brave New World", "Animal Farm"],
      es: ["El Gran Gatsby", "1984", "Orgullo y Prejuicio", "El Guardián entre el Centeno", "El Señor de las Moscas", "De Ratones y Hombres", "Las Uvas de la Ira", "Un Mundo Feliz", "Rebelión en la Granja"]
    }
  },
  {
    answer: {
      en: "1984",
      es: "1984"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/books/1984.jpg",
    facts: {
      "Author": {
        en: "I was written by George Orwell (Eric Blair), who drew from his experiences fighting in the Spanish Civil War and working for the BBC during World War II to create my dystopian vision of totalitarian surveillance and thought control.",
        es: "Fui escrito por George Orwell (Eric Blair), quien se basó en sus experiencias luchando en la Guerra Civil Española y trabajando para la BBC durante la Segunda Guerra Mundial para crear mi visión distópica de vigilancia totalitaria y control del pensamiento."
      },
      "Illustration/Cover": {
        en: "My covers often feature the imposing image of Big Brother's eye watching from propaganda posters, or stark, oppressive imagery that reflects the bleakness and surveillance state of Oceania, with bold typography emphasizing the year '1984.'",
        es: "Mis portadas a menudo presentan la imagen imponente del ojo del Gran Hermano observando desde carteles de propaganda, o imágenes austeras y opresivas que reflejan la desolación y estado de vigilancia de Oceanía, con tipografía audaz enfatizando el año '1984'."
      },
      "Character(s)": {
        en: "My protagonist is Winston Smith, a low-ranking Party member who works at the Ministry of Truth rewriting history, who begins a forbidden love affair with Julia and is ultimately broken by the terrifying O'Brien in Room 101.",
        es: "Mi protagonista es Winston Smith, un miembro de bajo rango del Partido que trabaja en el Ministerio de la Verdad reescribiendo historia, quien comienza una aventura amorosa prohibida con Julia y es finalmente quebrado por el aterrador O'Brien en la Habitación 101."
      },
      "Genre": {
        en: "I am a dystopian science fiction novel with elements of political satire and social commentary, exploring themes of totalitarianism, surveillance, propaganda, and the manipulation of truth and language.",
        es: "Soy una novela distópica de ciencia ficción con elementos de sátira política y comentario social, explorando temas de totalitarismo, vigilancia, propaganda, y la manipulación de la verdad y el lenguaje."
      },
      "Publication Date": {
        en: "I was published on June 8, 1949, by Secker & Warburg in London, just months before Orwell's death from tuberculosis, and I have remained continuously relevant as a warning about authoritarian government overreach.",
        es: "Fui publicado el 8 de junio de 1949, por Secker & Warburg en Londres, solo meses antes de la muerte de Orwell por tuberculosis, y he permanecido continuamente relevante como una advertencia sobre el exceso autoritario del gobierno."
      },
      "Plot": {
        en: "My story follows Winston Smith living in a totalitarian state where the Party controls every aspect of life through surveillance, propaganda, and thought control, until his rebellion through love and truth leads to his capture, torture, and ultimate psychological destruction.",
        es: "Mi historia sigue a Winston Smith viviendo en un estado totalitario donde el Partido controla cada aspecto de la vida a través de vigilancia, propaganda y control del pensamiento, hasta que su rebelión a través del amor y la verdad lleva a su captura, tortura y destrucción psicológica final."
      },
      "Quote": {
        en: "I introduced phrases that have become part of modern language: 'Big Brother is watching you,' 'War is peace. Freedom is slavery. Ignorance is strength,' and 'All animals are equal, but some animals are more equal than others.'",
        es: "Introduje frases que se han convertido en parte del lenguaje moderno: 'El Gran Hermano te está observando,' 'La guerra es paz. La libertad es esclavitud. La ignorancia es fuerza,' y 'Todos los animales son iguales, pero algunos animales son más iguales que otros'."
      },
      "Wildcard": {
        en: "My title was chosen because Orwell wrote me in 1948 and simply reversed the last two digits, and sales of my book spike dramatically whenever there are concerns about government surveillance or authoritarian politics in the real world.",
        es: "Mi título fue elegido porque Orwell me escribió en 1948 y simplemente invirtió los dos últimos dígitos, y las ventas de mi libro aumentan dramáticamente cuando hay preocupaciones sobre vigilancia gubernamental o política autoritaria en el mundo real."
      }
    },
    alternatives: {
      en: ["Brave New World", "Animal Farm", "Fahrenheit 451", "The Handmaid's Tale", "We", "A Clockwork Orange", "The Giver", "Nineteen Eighty-Four", "Anthem"],
      es: ["Un Mundo Feliz", "Rebelión en la Granja", "Fahrenheit 451", "El Cuento de la Criada", "Nosotros", "La Naranja Mecánica", "El Dador", "Mil Novecientos Ochenta y Cuatro", "Himno"]
    }
  },
  {
    answer: {
      en: "Pride and Prejudice",
      es: "Orgullo y Prejuicio"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/books/pride_and_prejudice.jpg",
    facts: {
      "Author": {
        en: "I was written by Jane Austen, one of the most celebrated English novelists, who wrote me during the Regency era and is known for her wit, social commentary, and pioneering role in developing the modern romance novel.",
        es: "Fui escrita por Jane Austen, una de las novelistas inglesas más celebradas, quien me escribió durante la era de la Regencia y es conocida por su ingenio, comentario social, y papel pionero en desarrollar la novela romántica moderna."
      },
      "Illustration/Cover": {
        en: "My covers typically feature elegant Regency-era imagery such as ballroom scenes, period dresses, English countryside estates, or portraits of couples in 19th-century attire, often with romantic and pastoral design elements.",
        es: "Mis portadas típicamente presentan imágenes elegantes de la era de la Regencia como escenas de salón de baile, vestidos de época, fincas del campo inglés, o retratos de parejas en atuendo del siglo XIX, a menudo con elementos de diseño románticos y pastorales."
      },
      "Character(s)": {
        en: "My story centers on Elizabeth Bennet, an intelligent and spirited young woman, and her complex relationship with the proud and wealthy Mr. Darcy, along with her sisters Jane, Mary, Kitty, and Lydia, and their parents Mr. and Mrs. Bennet.",
        es: "Mi historia se centra en Elizabeth Bennet, una mujer joven inteligente y vivaz, y su relación compleja con el orgulloso y rico Sr. Darcy, junto con sus hermanas Jane, Mary, Kitty y Lydia, y sus padres el Sr. y la Sra. Bennet."
      },
      "Genre": {
        en: "I am a romantic novel with elements of social satire and comedy of manners, exploring themes of love, marriage, social class, and women's independence in early 19th-century England.",
        es: "Soy una novela romántica con elementos de sátira social y comedia de costumbres, explorando temas de amor, matrimonio, clase social, e independencia femenina en Inglaterra de principios del siglo XIX."
      },
      "Publication Date": {
        en: "I was first published on January 28, 1813, by T. Egerton in London, originally titled 'First Impressions' when Austen first wrote me in 1796-1797, but I was substantially revised before publication.",
        es: "Fui publicada por primera vez el 28 de enero de 1813, por T. Egerton en Londres, originalmente titulada 'Primeras Impresiones' cuando Austen me escribió por primera vez en 1796-1797, pero fui sustancialmente revisada antes de la publicación."
      },
      "Plot": {
        en: "My story follows Elizabeth Bennet as she navigates the complex social world of Regency England, initially clashing with the seemingly arrogant Mr. Darcy, but gradually discovering his true character while overcoming her own prejudices and his pride.",
        es: "Mi historia sigue a Elizabeth Bennet mientras navega el mundo social complejo de la Inglaterra de la Regencia, inicialmente chocando con el aparentemente arrogante Sr. Darcy, pero gradualmente descubriendo su verdadero carácter mientras supera sus propios prejuicios y el orgullo de él."
      },
      "Quote": {
        en: "I begin with one of literature's most famous opening lines: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife,' which immediately establishes my satirical tone.",
        es: "Comienzo con una de las líneas de apertura más famosas de la literatura: 'Es una verdad universalmente reconocida que un hombre soltero en posesión de una buena fortuna debe estar necesitado de una esposa,' que inmediatamente establece mi tono satírico."
      },
      "Wildcard": {
        en: "I have been adapted into numerous films, TV series, and stage productions, with the 1995 BBC adaptation starring Colin Firth as Mr. Darcy becoming particularly iconic and sparking renewed global interest in my story.",
        es: "He sido adaptada en numerosas películas, series de TV y producciones teatrales, con la adaptación de la BBC de 1995 protagonizada por Colin Firth como el Sr. Darcy volviéndose particularmente icónica y despertando interés global renovado en mi historia."
      }
    },
    alternatives: {
      en: ["Emma", "Sense and Sensibility", "Jane Eyre", "Wuthering Heights", "Mansfield Park", "Persuasion", "Northanger Abbey", "The Great Gatsby", "Little Women"],
      es: ["Emma", "Sensatez y Sentimientos", "Jane Eyre", "Cumbres Borrascosas", "Parque Mansfield", "Persuasión", "La Abadía de Northanger", "El Gran Gatsby", "Mujercitas"]
    }
  }
];

export class BooksGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.BOOKS, bookFactTypes, bookData);
  }
} 