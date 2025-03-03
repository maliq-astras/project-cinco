// scripts/challenge-generators/animals-generator.ts
import { CategoryType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Animal fact types
const animalFactTypes = [
  "Habitat & Global Presence",
  "Diet & Ecological Role",
  "Physical Characteristic",
  "Size/Weight",
  "Evolutionary History & Relationships",
  "Social Behavior",
  "Reproduction",
  "Wildcard"
];

// Animal data with facts for each fact type
const animalData = [
  {
    answer: "Platypus",
    facts: {
      "Habitat & Global Presence": "I am found exclusively in eastern Australia, including Tasmania, where I inhabit freshwater systems such as rivers, lakes, and streams.",
      "Diet & Ecological Role": "I am a carnivorous bottom-feeder who hunts underwater using electroreception to detect the electrical fields produced by my prey's muscle movements.",
      "Physical Characteristic": "I have a leathery bill resembling a duck's beak, though it is actually a sensory organ packed with thousands of receptors.",
      "Size/Weight": "I typically weigh between 1.5 and 5 pounds, with males being considerably larger than females of my species.",
      "Evolutionary History & Relationships": "I belong to a primitive group of mammals that diverged from other mammals approximately 166 million years ago, making me one of the oldest mammalian lineages still in existence.",
      "Social Behavior": "I am largely solitary, with individuals maintaining loose territories, though several of us may share the same general waterway area.",
      "Reproduction": "I am one of only five existing species of egg-laying mammals, and my young hatchlings are called 'puggles'.",
      "Wildcard": "Males of my species have venomous spurs on their hind legs, making me one of the few venomous mammals in the world."
    },
    alternatives: [
      "Echidna", "Beaver", "Pangolin", "Otter", 
      "Capybara", "Duckbill", "Muskrat", "Mongoose", "Koala"
    ]
  },
  {
    answer: "Octopus",
    facts: {
      "Habitat & Global Presence": "I can be found in every ocean on Earth, from the frigid waters near the poles to tropical coral reefs, though each of my species has adapted to specific environmental conditions.",
      "Diet & Ecological Role": "I am a carnivorous predator who uses my intelligence to hunt crabs, shrimps, and mollusks, often employing complex strategies to extract prey from shells.",
      "Physical Characteristic": "I have three hearts that pump blue blood throughout my body, with two pumping blood to my gills and one circulating it to the rest of my organs.",
      "Size/Weight": "My species range dramatically in size, from the tiny 1-inch long Octopus wolfi to giants with arm spans reaching over 30 feet.",
      "Evolutionary History & Relationships": "I diverged from my closest relatives approximately 270 million years ago and am part of a lineage that includes nautilus, squid, and cuttlefish.",
      "Social Behavior": "Despite my remarkable intelligence, I am mostly solitary and may become aggressive toward others of my kind except during mating.",
      "Reproduction": "After mating, females of my kind lay up to 200,000 eggs and then stop eating to guard them, usually dying shortly after the eggs hatch.",
      "Wildcard": "I can change both the color and texture of my skin within seconds to match my surroundings, using specialized cells called chromatophores, papillae, and iridophores."
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