// scripts/challenge-generators/countries-generator.ts
import { CategoryType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Country fact types
const countryFactTypes = [
  "Official Language(s)",
  "Flag Colors & Features",
  "Notable City",
  "Largest Industry",
  "Population & Demographic Info",
  "Origin/Founding",
  "Geographic Features & Border Info",
  "Wildcard"
];

// Country data with facts for each fact type
const countryData = [
  {
    answer: "New Zealand",
    facts: {
      "Official Language(s)": "I have three officially recognized languages, with one of them being the first sign language to be given official status in any country.",
      "Flag Colors & Features": "I am one of only a few countries whose flag features the Southern Cross constellation on a blue field.",
      "Notable City": "I have a city nicknamed the 'City of Sails' due to having more boats per capita than anywhere else in the world.",
      "Largest Industry": "I count tourism as a major economic driver, but my largest export earnings come from dairy products, which account for around 20% of my total exports.",
      "Population & Demographic Info": "I have a population of approximately 5 million people, with nearly one-third of them living in my largest urban area.",
      "Origin/Founding": "I was the last major habitable landmass to be settled by humans, with my indigenous population arriving around 700 years ago.",
      "Geographic Features & Border Info": "I consist of two main islands and over 700 smaller islands, completely surrounded by ocean with no land borders to any other nation.",
      "Wildcard": "I was the first country in the world to give women the right to vote in 1893, over 25 years before the United States."
    },
    alternatives: [
      "Australia", "Iceland", "Norway", "Finland", 
      "Denmark", "Ireland", "Japan", "Fiji", "Canada"
    ]
  },
  {
    answer: "Japan",
    facts: {
      "Official Language(s)": "I have only one official language, though several regional dialects exist across my archipelago.",
      "Flag Colors & Features": "My flag features a single crimson disk centered on a white rectangular field, representing the sun goddess from whom my imperial family is said to descend.",
      "Notable City": "I have a city that was once called Edo and now hosts the world's largest fish market and busiest pedestrian crossing.",
      "Largest Industry": "My economy is dominated by manufacturing, particularly automobiles, electronics, and robotics, with global brands like Toyota and Sony originating here.",
      "Population & Demographic Info": "I have approximately 125 million people despite my relatively small land area, making me one of the most densely populated developed nations.",
      "Origin/Founding": "My recorded history dates back to the 5th century CE, though archaeological evidence suggests human habitation for over 30,000 years.",
      "Geographic Features & Border Info": "I consist of 6,852 islands, with the four largest comprising about 97% of my land area, and I have no land borders with other nations.",
      "Wildcard": "I am home to more than 6,800 centenarians, the world's highest concentration of people over 100 years old."
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