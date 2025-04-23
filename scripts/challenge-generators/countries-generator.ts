// scripts/challenge-generators/countries-generator.ts
import { CategoryType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Country fact types
const countryFactTypes = [
  "Language(s)",
  "Flag",
  "Notable City",
  "Political History",
  "Economy",
  "Culture & Tradition",
  "Geography & Border",
  "Wildcard"
];

// Country data with facts for each fact type
const countryData = [
  {
    answer: {
      en: "New Zealand",
      es: "Nueva Zelanda"
    },
    facts: {
      "Language(s)": {
        en: "I have three officially recognized languages, with one of them being the first sign language to be given official status in any country.",
        es: "Tengo tres idiomas oficialmente reconocidos, siendo uno de ellos el primer lenguaje de señas en recibir estatus oficial en cualquier país."
      },
      "Flag": {
        en: "I am one of only a few countries whose flag features the Southern Cross constellation on a blue field.",
        es: "Soy uno de los pocos países cuya bandera presenta la constelación de la Cruz del Sur sobre un campo azul."
      },
      "Notable City": {
        en: "I have a city nicknamed the 'City of Sails' due to having more boats per capita than anywhere else in the world.",
        es: "Tengo una ciudad apodada la 'Ciudad de las Velas' por tener más barcos per cápita que cualquier otro lugar del mundo."
      },
      "Political History": {
        en: "I was the first country in the world to give women the right to vote in 1893, over 25 years before the United States.",
        es: "Fui el primer país del mundo en dar a las mujeres el derecho al voto en 1893, más de 25 años antes que Estados Unidos."
      },
      "Economy": {
        en: "I count tourism as a major economic driver, but my largest export earnings come from dairy products, which account for around 20% of my total exports.",
        es: "El turismo es un importante motor económico, pero mis mayores ingresos por exportaciones provienen de productos lácteos, que representan alrededor del 20% de mis exportaciones totales."
      },
      "Culture & Tradition": {
        en: "I have a rich indigenous culture with the Māori people, known for their haka dance, intricate tattoos, and traditional meeting houses called marae.",
        es: "Tengo una rica cultura indígena con el pueblo Māori, conocido por su danza haka, tatuajes intrincados y casas de reunión tradicionales llamadas marae."
      },
      "Geography & Border": {
        en: "I consist of two main islands and over 700 smaller islands, completely surrounded by ocean with no land borders to any other nation.",
        es: "Consisto en dos islas principales y más de 700 islas más pequeñas, completamente rodeadas por océano sin fronteras terrestres con ninguna otra nación."
      },
      "Wildcard": {
        en: "I was the last major habitable landmass to be settled by humans, with my indigenous population arriving around 700 years ago.",
        es: "Fui la última masa de tierra habitable importante en ser poblada por humanos, con mi población indígena llegando hace unos 700 años."
      }
    },
    alternatives: {
      en: ["Australia", "Iceland", "Norway", "Finland", "Denmark", "Ireland", "Japan", "Fiji", "Canada"],
      es: ["Australia", "Islandia", "Noruega", "Finlandia", "Dinamarca", "Irlanda", "Japón", "Fiyi", "Canadá"]
    }
  },
  {
    answer: {
      en: "Japan",
      es: "Japón"
    },
    facts: {
      "Language(s)": {
        en: "I have only one official language, though several regional dialects exist across my archipelago.",
        es: "Tengo solo un idioma oficial, aunque existen varios dialectos regionales en todo mi archipiélago."
      },
      "Flag": {
        en: "My flag features a single crimson disk centered on a white rectangular field, representing the sun goddess from whom my imperial family is said to descend.",
        es: "Mi bandera presenta un único disco carmesí centrado en un campo rectangular blanco, que representa a la diosa del sol de quien se dice que desciende mi familia imperial."
      },
      "Notable City": {
        en: "I have a city that was once called Edo and now hosts the world's largest fish market and busiest pedestrian crossing.",
        es: "Tengo una ciudad que una vez se llamó Edo y ahora alberga el mercado de pescado más grande del mundo y el cruce peatonal más transitado."
      },
      "Political History": {
        en: "My recorded history dates back to the 5th century CE, though archaeological evidence suggests human habitation for over 30,000 years.",
        es: "Mi historia registrada se remonta al siglo V d.C., aunque la evidencia arqueológica sugiere la habitación humana por más de 30,000 años."
      },
      "Economy": {
        en: "My economy is dominated by manufacturing, particularly automobiles, electronics, and robotics, with global brands like Toyota and Sony originating here.",
        es: "Mi economía está dominada por la manufactura, particularmente automóviles, electrónica y robótica, con marcas globales como Toyota y Sony originándose aquí."
      },
      "Culture & Tradition": {
        en: "I have a rich indigenous culture with the Māori people, known for their haka dance, intricate tattoos, and traditional meeting houses called marae.",
        es: "Tengo una rica cultura indígena con el pueblo Māori, conocido por su danza haka, tatuajes intrincados y casas de reunión tradicionales llamadas marae."
      },
      "Geography & Border": {
        en: "I consist of 6,852 islands, with the four largest comprising about 97% of my land area, and I have no land borders with other nations.",
        es: "Consisto en 6,852 islas, con las cuatro más grandes comprendiendo cerca del 97% de mi área terrestre, y no tengo fronteras terrestres con otras naciones."
      },
      "Wildcard": {
        en: "I am home to more than 6,800 centenarians, the world's highest concentration of people over 100 years old.",
        es: "Soy hogar de más de 6,800 centenarios, la mayor concentración mundial de personas mayores de 100 años."
      }
    },
    alternatives: {
      en: ["South Korea", "Philippines", "Taiwan", "China", "Vietnam", "Thailand", "Malaysia", "Indonesia", "Singapore"],
      es: ["Corea del Sur", "Filipinas", "Taiwán", "China", "Vietnam", "Tailandia", "Malasia", "Indonesia", "Singapur"]
    }
  },
  // Add more countries here
];

export class CountriesGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.COUNTRIES, countryFactTypes, countryData);
  }
}