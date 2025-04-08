// scripts/challenge-generators/animals-generator.ts
import { CategoryType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Animal fact types
const animalFactTypes = [
  "Habitat",
  "Ecology",
  "Rare Features",
  "Size/Weight",
  "Evolutionary History",
  "Social Behavior",
  "Reproduction",
  "Wildcard"
];

// Animal data with facts for each fact type
const animalData = [
  {
    answer: "Platypus",
    facts: {
      "Habitat": "I am found exclusively in eastern Australia, including Tasmania, where I inhabit freshwater systems such as rivers, lakes, and streams.",
      "Ecology": "I am a carnivorous bottom-feeder who hunts underwater using electroreception to detect the electrical fields produced by my prey's muscle movements.",
      "Rare Features": "I have a leathery bill resembling a duck's beak, though it is actually a sensory organ packed with thousands of receptors.",
      "Size/Weight": "I typically weigh between 1.5 and 5 pounds, with males being considerably larger than females of my species.",
      "Evolutionary History": "I belong to a primitive group of mammals that diverged from other mammals approximately 166 million years ago, making me one of the oldest mammalian lineages still in existence.",
      "Social Behavior": "I am largely solitary, with individuals maintaining loose territories, though several of us may share the same general waterway area.",
      "Reproduction": "I am one of only five existing species of egg-laying mammals, and my young hatchlings are called 'puggles'.",
      "Wildcard": "Males of my species have venomous spurs on their hind legs, making me one of the few venomous mammals in the world."
    },
    translations: {
      es: {
        answer: "Ornitorrinco",
        facts: {
          "Habitat": "Me encuentro exclusivamente en el este de Australia, incluyendo Tasmania, donde habito sistemas de agua dulce como ríos, lagos y arroyos.",
          "Ecology": "Soy un carnívoro que se alimenta del fondo y cazo bajo el agua usando electrorrecepción para detectar los campos eléctricos producidos por los movimientos musculares de mis presas.",
          "Rare Features": "Tengo un pico similar al de un pato, aunque en realidad es un órgano sensorial lleno de miles de receptores.",
          "Size/Weight": "Típicamente peso entre 0.7 y 2.3 kilogramos, siendo los machos considerablemente más grandes que las hembras de mi especie.",
          "Evolutionary History": "Pertenezco a un grupo primitivo de mamíferos que se separó de otros mamíferos hace aproximadamente 166 millones de años, lo que me convierte en uno de los linajes de mamíferos más antiguos que aún existen.",
          "Social Behavior": "Soy mayormente solitario, con individuos manteniendo territorios flexibles, aunque varios de nosotros podemos compartir la misma área general de vías fluviales.",
          "Reproduction": "Soy una de las solo cinco especies existentes de mamíferos que ponen huevos, y mis crías recién nacidas se llaman 'puggles'.",
          "Wildcard": "Los machos de mi especie tienen espolones venenosos en sus patas traseras, lo que me convierte en uno de los pocos mamíferos venenosos del mundo."
        },
        alternatives: [
          "Equidna", "Castor", "Pangolín", "Nutria",
          "Capibara", "Pato", "Rata Almizclera", "Mangosta", "Koala"
        ]
      }
    },
    alternatives: [
      "Echidna", "Beaver", "Pangolin", "Otter", 
      "Capybara", "Duckbill", "Muskrat", "Mongoose", "Koala"
    ]
  },
  {
    answer: "Octopus",
    facts: {
      "Habitat": "I can be found in every ocean on Earth, from the frigid waters near the poles to tropical coral reefs, though each of my species has adapted to specific environmental conditions.",
      "Ecology": "I am a carnivorous predator who uses my intelligence to hunt crabs, shrimps, and mollusks, often employing complex strategies to extract prey from shells.",
      "Rare Features": "I have three hearts that pump blue blood throughout my body, with two pumping blood to my gills and one circulating it to the rest of my organs.",
      "Size/Weight": "My species range dramatically in size, from the tiny 1-inch long Octopus wolfi to giants with arm spans reaching over 30 feet.",
      "Evolutionary History": "I diverged from my closest relatives approximately 270 million years ago and am part of a lineage that includes nautilus, squid, and cuttlefish.",
      "Social Behavior": "Despite my remarkable intelligence, I am mostly solitary and may become aggressive toward others of my kind except during mating.",
      "Reproduction": "After mating, females of my kind lay up to 200,000 eggs and then stop eating to guard them, usually dying shortly after the eggs hatch.",
      "Wildcard": "I can change both the color and texture of my skin within seconds to match my surroundings, using specialized cells called chromatophores, papillae, and iridophores."
    },
    translations: {
      es: {
        answer: "Pulpo",
        facts: {
          "Habitat": "Me puedo encontrar en todos los océanos de la Tierra, desde las aguas frías cerca de los polos hasta los arrecifes de coral tropicales, aunque cada una de mis especies se ha adaptado a condiciones ambientales específicas.",
          "Ecology": "Soy un depredador carnívoro que usa mi inteligencia para cazar cangrejos, camarones y moluscos, a menudo empleando estrategias complejas para extraer presas de sus conchas.",
          "Rare Features": "Tengo tres corazones que bombean sangre azul por todo mi cuerpo, dos bombeando sangre a mis branquias y uno circulándola al resto de mis órganos.",
          "Size/Weight": "Mis especies varían dramáticamente en tamaño, desde el diminuto Octopus wolfi de 2.5 centímetros hasta gigantes con envergaduras de más de 9 metros.",
          "Evolutionary History": "Me separé de mis parientes más cercanos hace aproximadamente 270 millones de años y soy parte de un linaje que incluye nautilus, calamares y sepias.",
          "Social Behavior": "A pesar de mi notable inteligencia, soy mayormente solitario y puedo volverme agresivo hacia otros de mi especie excepto durante el apareamiento.",
          "Reproduction": "Después del apareamiento, las hembras de mi especie ponen hasta 200,000 huevos y luego dejan de comer para protegerlos, generalmente muriendo poco después de que los huevos eclosionan.",
          "Wildcard": "Puedo cambiar tanto el color como la textura de mi piel en segundos para adaptarme a mi entorno, usando células especializadas llamadas cromatóforos, papilas e iridóforos."
        },
        alternatives: [
          "Calamar", "Sepia", "Nautilo", "Pepino de Mar",
          "Medusa", "Erizo de Mar", "Estrella de Mar", "Langosta", "Coral"
        ]
      }
    },
    alternatives: [
      "Squid", "Cuttlefish", "Nautilus", "Sea Cucumber", 
      "Jellyfish", "Sea Urchin", "Starfish", "Lobster", "Coral"
    ]
  },
  // Add more animals here
];

export class AnimalsGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.ANIMALS, animalFactTypes, animalData);
  }
}