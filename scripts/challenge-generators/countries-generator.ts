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
      en: "Japan",
      es: "Japón"
    },
    imageUrl: "https://res.cloudinary.com/dv8mf70xe/image/upload/v1748641680/japan_xzhec7.jpg",
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