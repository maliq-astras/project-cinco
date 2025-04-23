// scripts/challenge-generators/animals-generator.ts
import { CategoryType, AnimalFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Animal fact types
const animalFactTypes: AnimalFactType[] = [
  "Habitat",
  "Diet",
  "Physical Characteristic",
  "Evolutionary History",
  "Social Behavior",
  "Reproduction",
  "Interspecies Relationships",
  "Wildcard"
];

// Animal data with facts for each fact type
const animalData = [
  {
    answer: {
      en: "Platypus",
      es: "Ornitorrinco"
    },
    facts: {
      "Habitat": {
        en: "I am found exclusively in eastern Australia, including Tasmania, where I inhabit freshwater systems such as rivers, lakes, and streams.",
        es: "Me encuentro exclusivamente en el este de Australia, incluyendo Tasmania, donde habito sistemas de agua dulce como ríos, lagos y arroyos."
      },
      "Diet": {
        en: "I am a carnivorous bottom-feeder who hunts underwater using electroreception to detect the electrical fields produced by my prey's muscle movements.",
        es: "Soy un carnívoro que se alimenta del fondo y cazo bajo el agua usando electrorrecepción para detectar los campos eléctricos producidos por los movimientos musculares de mis presas."
      },
      "Physical Characteristic": {
        en: "I have a leathery bill resembling a duck's beak, though it is actually a sensory organ packed with thousands of receptors.",
        es: "Tengo un pico similar al de un pato, aunque en realidad es un órgano sensorial lleno de miles de receptores."
      },
      "Evolutionary History": {
        en: "I belong to a primitive group of mammals that diverged from other mammals approximately 166 million years ago, making me one of the oldest mammalian lineages still in existence.",
        es: "Pertenezco a un grupo primitivo de mamíferos que se separó de otros mamíferos hace aproximadamente 166 millones de años, lo que me convierte en uno de los linajes de mamíferos más antiguos que aún existen."
      },
      "Social Behavior": {
        en: "I am largely solitary, with individuals maintaining loose territories, though several of us may share the same general waterway area.",
        es: "Soy mayormente solitario, con individuos manteniendo territorios flexibles, aunque varios de nosotros podemos compartir la misma área general de vías fluviales."
      },
      "Reproduction": {
        en: "I am one of only five existing species of egg-laying mammals, and my young hatchlings are called 'puggles'.",
        es: "Soy una de las solo cinco especies existentes de mamíferos que ponen huevos, y mis crías recién nacidas se llaman 'puggles'."
      },
      "Interspecies Relationships": {
        en: "I have a unique relationship with my environment, using my electroreception to detect prey while being preyed upon by snakes, birds of prey, and introduced species like foxes.",
        es: "Tengo una relación única con mi entorno, usando mi electrorrecepción para detectar presas mientras soy presa de serpientes, aves rapaces y especies introducidas como zorros."
      },
      "Wildcard": {
        en: "Males of my species have venomous spurs on their hind legs, making me one of the few venomous mammals in the world.",
        es: "Los machos de mi especie tienen espolones venenosos en sus patas traseras, lo que me convierte en uno de los pocos mamíferos venenosos del mundo."
      }
    },
    alternatives: {
      en: ["Echidna", "Beaver", "Pangolin", "Otter", "Capybara", "Duckbill", "Muskrat", "Mongoose", "Koala"],
      es: ["Equidna", "Castor", "Pangolín", "Nutria", "Capibara", "Pato", "Rata Almizclera", "Mangosta", "Koala"]
    }
  },
  {
    answer: {
      en: "Octopus",
      es: "Pulpo"
    },
    facts: {
      "Habitat": {
        en: "I can be found in every ocean on Earth, from the frigid waters near the poles to tropical coral reefs, though each of my species has adapted to specific environmental conditions.",
        es: "Me puedo encontrar en todos los océanos de la Tierra, desde las aguas frías cerca de los polos hasta los arrecifes de coral tropicales, aunque cada una de mis especies se ha adaptado a condiciones ambientales específicas."
      },
      "Diet": {
        en: "I am a carnivorous predator who uses my intelligence to hunt crabs, shrimps, and mollusks, often employing complex strategies to extract prey from shells.",
        es: "Soy un depredador carnívoro que usa mi inteligencia para cazar cangrejos, camarones y moluscos, a menudo empleando estrategias complejas para extraer presas de sus conchas."
      },
      "Physical Characteristic": {
        en: "I have three hearts that pump blue blood throughout my body, with two pumping blood to my gills and one circulating it to the rest of my organs.",
        es: "Tengo tres corazones que bombean sangre azul por todo mi cuerpo, dos bombeando sangre a mis branquias y uno circulándola al resto de mis órganos."
      },
      "Evolutionary History": {
        en: "I diverged from my closest relatives approximately 270 million years ago and am part of a lineage that includes nautilus, squid, and cuttlefish.",
        es: "Me separé de mis parientes más cercanos hace aproximadamente 270 millones de años y soy parte de un linaje que incluye nautilus, calamares y sepias."
      },
      "Social Behavior": {
        en: "Despite my remarkable intelligence, I am mostly solitary and may become aggressive toward others of my kind except during mating.",
        es: "A pesar de mi notable inteligencia, soy mayormente solitario y puedo volverme agresivo hacia otros de mi especie excepto durante el apareamiento."
      },
      "Reproduction": {
        en: "After mating, females of my kind lay up to 200,000 eggs and then stop eating to guard them, usually dying shortly after the eggs hatch.",
        es: "Después del apareamiento, las hembras de mi especie ponen hasta 200,000 huevos y luego dejan de comer para protegerlos, generalmente muriendo poco después de que los huevos eclosionan."
      },
      "Interspecies Relationships": {
        en: "I have a unique relationship with my environment, using my electroreception to detect prey while being preyed upon by snakes, birds of prey, and introduced species like foxes.",
        es: "Tengo una relación única con mi entorno, usando mi electrorrecepción para detectar presas mientras soy presa de serpientes, aves rapaces y especies introducidas como zorros."
      },
      "Wildcard": {
        en: "I can change both the color and texture of my skin within seconds to match my surroundings, using specialized cells called chromatophores, papillae, and iridophores.",
        es: "Puedo cambiar tanto el color como la textura de mi piel en segundos para adaptarme a mi entorno, usando células especializadas llamadas cromatóforos, papilas e iridóforos."
      }
    },
    alternatives: {
      en: [
        "Squid", "Cuttlefish", "Nautilus", "Sea Cucumber", 
        "Jellyfish", "Sea Urchin", "Starfish", "Lobster", "Coral"
      ],
      es: [
        "Calamar", "Sepia", "Nautilo", "Pepino de Mar",
        "Medusa", "Erizo de Mar", "Estrella de Mar", "Langosta", "Coral"
      ]
    }
  },
  // Add more animals here
];

export class AnimalsGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.ANIMALS, animalFactTypes, animalData);
  }
}