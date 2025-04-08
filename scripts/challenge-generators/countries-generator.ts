// scripts/challenge-generators/countries-generator.ts
import { CategoryType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Country fact types
const countryFactTypes = [
  "Language(s)",
  "Flag",
  "Cities",
  "Economy",
  "Demographics",
  "Origin",
  "Geography & Climate",
  "Wildcard"
];

// Country data with facts for each fact type
const countryData = [
  {
    answer: "New Zealand",
    facts: {
      "Language(s)": "I have three officially recognized languages, with one of them being the first sign language to be given official status in any country.",
      "Flag": "I am one of only a few countries whose flag features the Southern Cross constellation on a blue field.",
      "Cities": "I have a city nicknamed the 'City of Sails' due to having more boats per capita than anywhere else in the world.",
      "Economy": "I count tourism as a major economic driver, but my largest export earnings come from dairy products, which account for around 20% of my total exports.",
      "Demographics": "I have a population of approximately 5 million people, with nearly one-third of them living in my largest urban area.",
      "Origin": "I was the last major habitable landmass to be settled by humans, with my indigenous population arriving around 700 years ago.",
      "Geography & Climate": "I consist of two main islands and over 700 smaller islands, completely surrounded by ocean with no land borders to any other nation.",
      "Wildcard": "I was the first country in the world to give women the right to vote in 1893, over 25 years before the United States."
    },
    translations: {
      es: {
        answer: "Nueva Zelanda",
        facts: {
          "Language(s)": "Tengo tres idiomas oficialmente reconocidos, siendo uno de ellos el primer lenguaje de señas en recibir estatus oficial en cualquier país.",
          "Flag": "Soy uno de los pocos países cuya bandera presenta la constelación de la Cruz del Sur sobre un campo azul.",
          "Cities": "Tengo una ciudad apodada la 'Ciudad de las Velas' por tener más barcos per cápita que cualquier otro lugar del mundo.",
          "Economy": "El turismo es un importante motor económico, pero mis mayores ingresos por exportaciones provienen de productos lácteos, que representan alrededor del 20% de mis exportaciones totales.",
          "Demographics": "Tengo una población de aproximadamente 5 millones de personas, con casi un tercio viviendo en mi área urbana más grande.",
          "Origin": "Fui la última masa de tierra habitable importante en ser poblada por humanos, con mi población indígena llegando hace unos 700 años.",
          "Geography & Climate": "Consisto en dos islas principales y más de 700 islas más pequeñas, completamente rodeadas por océano sin fronteras terrestres con ninguna otra nación.",
          "Wildcard": "Fui el primer país del mundo en dar a las mujeres el derecho al voto en 1893, más de 25 años antes que Estados Unidos."
        },
        alternatives: [
          "Australia", "Islandia", "Noruega", "Finlandia",
          "Dinamarca", "Irlanda", "Japón", "Fiyi", "Canadá"
        ]
      }
    },
    alternatives: [
      "Australia", "Iceland", "Norway", "Finland", 
      "Denmark", "Ireland", "Japan", "Fiji", "Canada"
    ]
  },
  {
    answer: "Japan",
    facts: {
      "Language(s)": "I have only one official language, though several regional dialects exist across my archipelago.",
      "Flag": "My flag features a single crimson disk centered on a white rectangular field, representing the sun goddess from whom my imperial family is said to descend.",
      "Cities": "I have a city that was once called Edo and now hosts the world's largest fish market and busiest pedestrian crossing.",
      "Economy": "My economy is dominated by manufacturing, particularly automobiles, electronics, and robotics, with global brands like Toyota and Sony originating here.",
      "Demographics": "I have approximately 125 million people despite my relatively small land area, making me one of the most densely populated developed nations.",
      "Origin": "My recorded history dates back to the 5th century CE, though archaeological evidence suggests human habitation for over 30,000 years.",
      "Geography & Climate": "I consist of 6,852 islands, with the four largest comprising about 97% of my land area, and I have no land borders with other nations.",
      "Wildcard": "I am home to more than 6,800 centenarians, the world's highest concentration of people over 100 years old."
    },
    translations: {
      es: {
        answer: "Japón",
        facts: {
          "Language(s)": "Tengo solo un idioma oficial, aunque existen varios dialectos regionales en todo mi archipiélago.",
          "Flag": "Mi bandera presenta un único disco carmesí centrado en un campo rectangular blanco, que representa a la diosa del sol de quien se dice que desciende mi familia imperial.",
          "Cities": "Tengo una ciudad que una vez se llamó Edo y ahora alberga el mercado de pescado más grande del mundo y el cruce peatonal más transitado.",
          "Economy": "Mi economía está dominada por la manufactura, particularmente automóviles, electrónica y robótica, con marcas globales como Toyota y Sony originándose aquí.",
          "Demographics": "Tengo aproximadamente 125 millones de personas a pesar de mi área territorial relativamente pequeña, lo que me convierte en una de las naciones desarrolladas más densamente pobladas.",
          "Origin": "Mi historia registrada se remonta al siglo V d.C., aunque la evidencia arqueológica sugiere la habitación humana por más de 30,000 años.",
          "Geography & Climate": "Consisto en 6,852 islas, con las cuatro más grandes comprendiendo cerca del 97% de mi área terrestre, y no tengo fronteras terrestres con otras naciones.",
          "Wildcard": "Soy hogar de más de 6,800 centenarios, la mayor concentración mundial de personas mayores de 100 años."
        },
        alternatives: [
          "Corea del Sur", "Filipinas", "Taiwán", "China",
          "Vietnam", "Tailandia", "Malasia", "Indonesia", "Singapur"
        ]
      }
    },
    alternatives: [
      "South Korea", "Philippines", "Taiwan", "China", 
      "Vietnam", "Thailand", "Malaysia", "Indonesia", "Singapore"
    ]
  },
  // Add more countries here
];

export class CountriesGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.COUNTRIES, countryFactTypes, countryData);
  }
}