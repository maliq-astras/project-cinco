// scripts/challenge-generators/companies-generator.ts
import { CategoryType, FamousBrandFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Company fact types
const companyFactTypes: FamousBrandFactType[] = [
  "Industry",
  "Origin", 
  "Logo",
  "Signature Product",
  "Target Audience",
  "Tagline/Catchphrase",
  "HQ Location",
  "Wildcard"
];

// Companies data with facts for each fact type
const companyData = [
  {
    answer: {
      en: "Apple",
      es: "Apple"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/brands/apple_campus.jpg",
    facts: {
      "Industry": {
        en: "I operate across multiple sectors including consumer electronics, software services, and digital content distribution, but I originally started as a personal computer company in 1976.",
        es: "Opero en múltiples sectores incluyendo electrónicos de consumo, servicios de software y distribución de contenido digital, pero originalmente comencé como una empresa de computadoras personales en 1976."
      },
      "Origin": {
        en: "I was founded in a suburban garage in Los Altos, California, by three individuals who met through a computer hobbyist club called the Homebrew Computer Club.",
        es: "Fui fundada en un garaje suburbano en Los Altos, California, por tres individuos que se conocieron a través de un club de aficionados a las computadoras llamado Homebrew Computer Club."
      },
      "Logo": {
        en: "My current minimalist logo replaced a much more complex design featuring Isaac Newton sitting under a tree, which was used only briefly in 1976 before being deemed too intricate for small applications.",
        es: "Mi logo minimalista actual reemplazó un diseño mucho más complejo que presentaba a Isaac Newton sentado bajo un árbol, que se usó solo brevemente en 1976 antes de ser considerado demasiado intrincado para aplicaciones pequeñas."
      },
      "Signature Product": {
        en: "My breakthrough product that revolutionized the mobile industry was announced on January 9, 2007, and combined three devices into one: a widescreen iPod, a revolutionary mobile phone, and a breakthrough internet communications device.",
        es: "Mi producto revolucionario que revolucionó la industria móvil fue anunciado el 9 de enero de 2007, y combinó tres dispositivos en uno: un iPod de pantalla panorámica, un teléfono móvil revolucionario y un dispositivo de comunicaciones de internet revolucionario."
      },
      "Target Audience": {
        en: "I specifically target creative professionals, tech enthusiasts, and consumers who value premium design and seamless integration between devices, often referred to as being part of my 'ecosystem.'",
        es: "Me dirijo específicamente a profesionales creativos, entusiastas de la tecnología y consumidores que valoran el diseño premium y la integración perfecta entre dispositivos, a menudo referidos como parte de mi 'ecosistema'."
      },
      "Tagline/Catchphrase": {
        en: "My famous advertising campaign that launched in 1997 encouraged customers to 'Think Different' and featured iconic figures like Albert Einstein, Martin Luther King Jr., and Pablo Picasso.",
        es: "Mi famosa campaña publicitaria que se lanzó en 1997 alentó a los clientes a 'Pensar Diferente' y presentó figuras icónicas como Albert Einstein, Martin Luther King Jr. y Pablo Picasso."
      },
      "HQ Location": {
        en: "My headquarters is a massive ring-shaped building in Cupertino, California, that cost over $5 billion to construct and is powered entirely by renewable energy, including solar panels on the roof.",
        es: "Mi sede es un edificio masivo en forma de anillo en Cupertino, California, que costó más de $5 mil millones construir y está alimentado completamente por energía renovable, incluyendo paneles solares en el techo."
      },
      "Wildcard": {
        en: "I was nearly bankrupt in 1997 and was saved by a $150 million investment from my biggest rival, Microsoft, which helped me stay afloat long enough for my co-founder to return and launch the products that made me the world's most valuable company.",
        es: "Estuve casi en bancarrota en 1997 y fui salvado por una inversión de $150 millones de mi mayor rival, Microsoft, que me ayudó a mantenerme a flote lo suficiente para que mi cofundador regresara y lanzara los productos que me hicieron la empresa más valiosa del mundo."
      }
    },
    alternatives: {
      en: ["Microsoft", "Google", "Amazon", "Samsung", "Sony", "Nike", "Coca-Cola", "McDonald's", "Tesla"],
      es: ["Microsoft", "Google", "Amazon", "Samsung", "Sony", "Nike", "Coca-Cola", "McDonald's", "Tesla"]
    }
  },
  {
    answer: {
      en: "Nike",
      es: "Nike"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/brands/nike_headquarters.jpg",
    facts: {
      "Industry": {
        en: "I dominate the athletic footwear, apparel, equipment, and accessories market, and I'm the world's largest supplier of athletic shoes and apparel.",
        es: "Domino el mercado de calzado atlético, ropa, equipo y accesorios, y soy el proveedor más grande del mundo de zapatos y ropa atlética."
      },
      "Origin": {
        en: "I was founded in 1964 as Blue Ribbon Sports by a University of Oregon track athlete and his former coach, who started by importing Japanese running shoes and selling them from the back of a car.",
        es: "Fui fundado en 1964 como Blue Ribbon Sports por un atleta de pista de la Universidad de Oregon y su ex-entrenador, que comenzaron importando zapatos japoneses para correr y vendiéndolos desde la parte trasera de un auto."
      },
      "Logo": {
        en: "My iconic 'Swoosh' logo was designed in 1971 by a graphic design student for just $35, and it represents the wing of the Greek goddess of victory after whom I'm named.",
        es: "Mi icónico logo 'Swoosh' fue diseñado en 1971 por una estudiante de diseño gráfico por solo $35, y representa el ala de la diosa griega de la victoria por quien fui nombrado."
      },
      "Signature Product": {
        en: "My revolutionary Air cushioning technology, first introduced in 1979, uses pressurized air in a flexible membrane to provide lightweight impact protection in athletic shoes.",
        es: "Mi tecnología revolucionaria de amortiguación Air, introducida por primera vez en 1979, usa aire presurizado en una membrana flexible para proporcionar protección de impacto ligera en zapatos atléticos."
      },
      "Target Audience": {
        en: "I target serious athletes, fitness enthusiasts, and style-conscious consumers who want to embody the 'Just Do It' mentality of pushing limits and achieving greatness.",
        es: "Me dirijo a atletas serios, entusiastas del fitness y consumidores conscientes del estilo que quieren encarnar la mentalidad 'Just Do It' de superar límites y lograr grandeza."
      },
      "Tagline/Catchphrase": {
        en: "My 'Just Do It' slogan, launched in 1988, was inspired by the last words of a convicted murderer and became one of the most recognizable taglines in advertising history.",
        es: "Mi eslogan 'Just Do It', lanzado en 1988, fue inspirado por las últimas palabras de un asesino convicto y se convirtió en uno de los eslóganes más reconocibles en la historia de la publicidad."
      },
      "HQ Location": {
        en: "My global headquarters is located on a 286-acre campus in Beaverton, Oregon, near Portland, featuring multiple buildings named after famous athletes I sponsor.",
        es: "Mi sede global está ubicada en un campus de 286 acres en Beaverton, Oregon, cerca de Portland, con múltiples edificios nombrados por atletas famosos que patrocino."
      },
      "Wildcard": {
        en: "I originally got my name from the Greek goddess of victory, and my first employee was a middle-distance runner who would later become a co-founder of the New York City Marathon.",
        es: "Originalmente obtuve mi nombre de la diosa griega de la victoria, y mi primer empleado fue un corredor de media distancia que más tarde se convertiría en co-fundador del Maratón de la Ciudad de Nueva York."
      }
    },
    alternatives: {
      en: ["Adidas", "Under Armour", "Puma", "Reebok", "New Balance", "Converse", "Vans", "Jordan", "ASICS"],
      es: ["Adidas", "Under Armour", "Puma", "Reebok", "New Balance", "Converse", "Vans", "Jordan", "ASICS"]
    }
  },
  {
    answer: {
      en: "McDonald's",
      es: "McDonald's"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/brands/mcdonalds_restaurant.jpg",
    facts: {
      "Industry": {
        en: "I operate in the fast food and restaurant industry, serving over 69 million customers daily in more than 100 countries through approximately 40,000 locations worldwide.",
        es: "Opero en la industria de comida rápida y restaurantes, sirviendo más de 69 millones de clientes diariamente en más de 100 países a través de aproximadamente 40,000 ubicaciones mundialmente."
      },
      "Origin": {
        en: "I began in 1940 as a restaurant operated by two brothers in San Bernardino, California, who developed a revolutionary 'Speedee Service System' that became the foundation of modern fast food.",
        es: "Comencé en 1940 como un restaurante operado por dos hermanos en San Bernardino, California, quienes desarrollaron un revolucionario 'Sistema de Servicio Speedee' que se convirtió en la fundación de la comida rápida moderna."
      },
      "Logo": {
        en: "My golden arches logo, introduced in the 1960s, is one of the most recognizable symbols in the world and was originally inspired by the architectural design of my early restaurants.",
        es: "Mi logo de arcos dorados, introducido en los años 60, es uno de los símbolos más reconocibles del mundo y fue originalmente inspirado por el diseño arquitectónico de mis primeros restaurantes."
      },
      "Signature Product": {
        en: "My Big Mac, introduced in 1967, features two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun, and has its own globally recognized jingle.",
        es: "Mi Big Mac, introducida en 1967, presenta dos hamburguesas de res, salsa especial, lechuga, queso, pepinillos, cebollas en un pan de sésamo, y tiene su propio jingle reconocido globalmente."
      },
      "Target Audience": {
        en: "I target families, busy professionals, and budget-conscious consumers seeking convenient, affordable meals, with specialized menus and marketing campaigns for children and young adults.",
        es: "Me dirijo a familias, profesionales ocupados y consumidores conscientes del presupuesto que buscan comidas convenientes y asequibles, con menús especializados y campañas de marketing para niños y adultos jóvenes."
      },
      "Tagline/Catchphrase": {
        en: "My 'I'm Lovin' It' slogan, launched in 2003, was my first global advertising campaign and is sung by millions worldwide, often accompanied by the famous 'ba da ba ba ba' jingle.",
        es: "Mi eslogan 'I'm Lovin' It', lanzado en 2003, fue mi primera campaña publicitaria global y es cantado por millones mundialmente, a menudo acompañado del famoso jingle 'ba da ba ba ba'."
      },
      "HQ Location": {
        en: "My global headquarters moved to Chicago, Illinois in 2018, housed in a modern office building in the West Loop neighborhood, after being based in Oak Brook, Illinois for decades.",
        es: "Mi sede global se mudó a Chicago, Illinois en 2018, ubicada en un moderno edificio de oficinas en el barrio West Loop, después de estar basada en Oak Brook, Illinois por décadas."
      },
      "Wildcard": {
        en: "I sell approximately 2.5 billion hamburgers annually, and my largest restaurant is located in Orlando, Florida, spanning 19,000 square feet with a PlayPlace, arcade, and pizza station.",
        es: "Vendo aproximadamente 2.5 mil millones de hamburguesas anualmente, y mi restaurante más grande está ubicado en Orlando, Florida, abarcando 19,000 pies cuadrados con un PlayPlace, arcade y estación de pizza."
      }
    },
    alternatives: {
      en: ["Burger King", "KFC", "Subway", "Taco Bell", "Wendy's", "Pizza Hut", "Starbucks", "Domino's", "Chick-fil-A"],
      es: ["Burger King", "KFC", "Subway", "Taco Bell", "Wendy's", "Pizza Hut", "Starbucks", "Domino's", "Chick-fil-A"]
    }
  }
];

export class CompaniesGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.COMPANIES, companyFactTypes, companyData);
  }
} 