// Normalization data (grouped catch-all variations)
// Maps user input variations to the official animal name
export const animalsNormalization = {
  // Big Cats - common variations
  "Lion": [
    "Lions", // Plural
    "Male Lion",
    "Female Lion",
    "Lioness"
  ],
  
  "Tiger": [
    "Tigers",
    "Bengal Tiger",
    "Siberian Tiger",
    "White Tiger"
  ],
  
  "Cheetah": [
    "Cheetahs"
  ],
  
  "Leopard": [
    "Leopards",
    "Snow Leopard"
  ],
  
  "Jaguar": [
    "Jaguars"
  ],
  
  "Mountain Lion": [
    "Puma", // Same animal, different name
    "Cougar" // Normalize Cougar to Mountain Lion (they're the same)
  ],

  // Bears - variations and types
  "Bear": [
    "Bears"
  ],
  
  "Grizzly Bear": [
    "Grizzly",
    "Grizzlies",
    "Brown Bear" // Same species
  ],
  
  "Polar Bear": [
    "Polar Bears"
  ],
  
  "Black Bear": [
    "Black Bears"
  ],
  
  "Giant Panda": [
    "Panda", // Normalize generic to specific
    "Pandas",
    "Panda Bear"
  ],

  // Elephants
  "Elephant": [
    "Elephants",
    "African Elephant",
    "Asian Elephant",
    "Indian Elephant"
  ],

  // Primates
  "Gorilla": [
    "Gorillas",
    "Silverback",
    "Mountain Gorilla"
  ],
  
  "Chimpanzee": [
    "Chimp", // Normalize short form to full
    "Chimps",
    "Chimpanzees"
  ],
  
  "Orangutan": [
    "Orangutans",
    "Orang-utan"
  ],

  // Marine Life - killer whale/orca normalization
  "Orca": [
    "Killer Whale", // Both names for same animal
    "Orcas",
    "Killer Whales"
  ],
  
  "Blue Whale": [
    "Blue Whales"
  ],
  
  "Humpback Whale": [
    "Humpback",
    "Humpbacks"
  ],
  
  "Whale": [
    "Whales"
  ],
  
  "Great White Shark": [
    "Great White",
    "Great Whites",
    "White Shark"
  ],
  
  "Shark": [
    "Sharks"
  ],
  
  "Dolphin": [
    "Dolphins",
    "Bottlenose Dolphin"
  ],

  // African Animals - hippo/rhino variations
  "Hippopotamus": [
    "Hippo", // Normalize short to full
    "Hippos",
    "River Horse"
  ],
  
  "Rhinoceros": [
    "Rhino", // Normalize short to full
    "Rhinos",
    "Black Rhino",
    "White Rhino"
  ],
  
  "Giraffe": [
    "Giraffes"
  ],
  
  "Zebra": [
    "Zebras"
  ],

  // Reptiles - snake variations
  "Snake": [
    "Snakes",
    "Serpent"
  ],
  
  "Python": [
    "Pythons",
    "Burmese Python",
    "Ball Python"
  ],
  
  "Cobra": [
    "Cobras",
    "King Cobra"
  ],
  
  "Rattlesnake": [
    "Rattlesnakes",
    "Rattler"
  ],
  
  "Crocodile": [
    "Crocodiles",
    "Croc",
    "Saltwater Crocodile",
    "Nile Crocodile"
  ],
  
  "Alligator": [
    "Alligators",
    "Gator",
    "American Alligator"
  ],

  // Birds
  "Eagle": [
    "Eagles"
  ],
  
  "Bald Eagle": [
    "Bald Eagles",
    "American Eagle"
  ],
  
  "Owl": [
    "Owls"
  ],
  
  "Penguin": [
    "Penguins",
    "Emperor Penguin",
    "King Penguin"
  ],

  // Farm Animals
  "Cow": [
    "Cows",
    "Cattle",
    "Bull", // Normalize bull to cow (same species)
    "Bulls"
  ],
  
  "Horse": [
    "Horses",
    "Stallion",
    "Mare",
    "Pony",
    "Ponies"
  ],
  
  "Pig": [
    "Pigs",
    "Swine",
    "Hog",
    "Hogs"
  ],
  
  "Sheep": [
    "Lamb",
    "Lambs",
    "Ram",
    "Ewe"
  ],
  
  "Chicken": [
    "Chickens",
    "Hen",
    "Hens",
    "Rooster", // Normalize rooster to chicken
    "Roosters"
  ],

  // Wild Animals - deer family
  "Deer": [
    "Buck",
    "Doe",
    "Fawn",
    "White-tailed Deer"
  ],
  
  "Elk": [
    "Bull Elk",
    "Cow Elk"
  ],
  
  "Moose": [
    "Bull Moose",
    "Cow Moose"
  ],

  // Canines
  "Wolf": [
    "Wolves",
    "Gray Wolf",
    "Timber Wolf"
  ],
  
  "Fox": [
    "Foxes"
  ],
  
  "Red Fox": [
    "Red Foxes"
  ],
  
  "Arctic Fox": [
    "Arctic Foxes",
    "White Fox"
  ],
  
  "Dog": [
    "Dogs",
    "Puppy",
    "Puppies",
    "Canine"
  ],

  // Felines
  "Cat": [
    "Cats",
    "Kitten",
    "Kittens",
    "Feline"
  ],

  // Insects - bee variations
  "Bee": [
    "Bees",
    "Honey Bee",
    "Honeybee"
  ],
  
  "Bumblebee": [
    "Bumble Bee",
    "Bumblebees"
  ],
  
  "Butterfly": [
    "Butterflies",
    "Monarch",
    "Monarch Butterfly"
  ],
  
  "Spider": [
    "Spiders",
    "Arachnid"
  ],

  // Australian Animals
  "Kangaroo": [
    "Kangaroos",
    "Roo"
  ],
  
  "Koala": [
    "Koalas",
    "Koala Bear" // Not actually a bear
  ],

  // Simple plurals (animals with straightforward variations)
  "Turtle": ["Turtles", "Sea Turtle", "Sea Turtles"],
  "Frog": ["Frogs"],
  "Toad": ["Toads"],
  "Rabbit": ["Rabbits", "Bunny", "Bunnies"],
  "Squirrel": ["Squirrels"],
  "Ant": ["Ants"],
  "Beaver": ["Beavers"],
  "Otter": ["Otters"],
  "Seal": ["Seals"],
  "Walrus": ["Walruses"],
  "Octopus": ["Octopi", "Octopuses"],
  "Jellyfish": ["Jellyfishes"],
  "Starfish": ["Sea Star", "Sea Stars"],
  "Flamingo": ["Flamingos"],
  "Parrot": ["Parrots"],
  "Peacock": ["Peacocks"],
  "Ostrich": ["Ostriches"],
  "Camel": ["Camels"],
  "Llama": ["Llamas"],
  "Sloth": ["Sloths"],
  "Armadillo": ["Armadillos"],
  "Platypus": ["Platypuses"],
  "Meerkat": ["Meerkats"]
};
