// Normalization data (grouped catch-all variations)
// Maps user input variations to the official Spanish animal name
// IMPORTANT: All accent variations are normalized to prevent wrong answers
export const animalsNormalization = {
  // Challenge animals - accent normalization
  "Guepardo": [
    "Guepardos"
  ],
  
  "Ardilla Listada": [
    "Ardilla",
    "Ardillas"
  ],
  
  "Águila": [
    "Aguila", // Without accent
    "Águilas",
    "Aguilas" // Without accent
  ],
  
  "Canguro": [
    "Canguros"
  ],
  
  "Orangután": [
    "Orangutan", // Without accent
    "Orangutanes",
    "Orangutánes" // With accent on different syllable
  ],

  // Big Cats - accent variations
  "León": [
    "Leon", // Without accent
    "Leones",
    "León Marino" // Normalize sea lion to regular lion for simplicity
  ],
  
  "Tigre": [
    "Tigres"
  ],
  
  "Puma": [
    "León de Montaña" // Same animal
  ],

  // Bears - accent variations
  "Oso": [
    "Osos"
  ],
  
  "Oso Pardo": [
    "Oso Grizzly"
  ],
  
  "Panda Gigante": [
    "Panda",
    "Pandas",
    "Oso Panda"
  ],

  // Elephants
  "Elefante": [
    "Elefantes",
    "Elefante Africano",
    "Elefante Asiático",
    "Elefante Asiático" // With accent
  ],

  // Marine Life - orca/ballena asesina normalization
  "Orca": [
    "Ballena Asesina", // Same animal
    "Orcas",
    "Ballenas Asesinas"
  ],
  
  "Ballena": [
    "Ballenas"
  ],
  
  "Tiburón": [
    "Tiburon", // Without accent
    "Tiburones"
  ],
  
  "Gran Tiburón Blanco": [
    "Gran Tiburon Blanco", // Without accent
    "Tiburón Blanco",
    "Tiburon Blanco" // Without accent
  ],
  
  "Delfín": [
    "Delfin", // Without accent
    "Delfines"
  ],

  // African Animals - hippo/rhino variations
  "Hipopótamo": [
    "Hipopotamo", // Without accent
    "Hipopótamos",
    "Hipopotamos", // Without accent
    "Hippo"
  ],
  
  "Rinoceronte": [
    "Rinocerontes",
    "Rino"
  ],
  
  "Jirafa": [
    "Jirafas"
  ],

  // Reptiles - snake variations
  "Serpiente": [
    "Serpientes",
    "Culebra"
  ],
  
  "Pitón": [
    "Piton", // Without accent
    "Pitones"
  ],
  
  "Cocodrilo": [
    "Cocodrilos",
    "Coco"
  ],
  
  "Caimán": [
    "Caiman", // Without accent
    "Caimanes"
  ],

  // Birds - accent variations
  "Águila Calva": [
    "Aguila Calva", // Without accent
    "Águila Americana",
    "Aguila Americana" // Without accent
  ],
  
  "Búho": [
    "Buho", // Without accent
    "Búhos",
    "Buhos" // Without accent
  ],
  
  "Pingüino": [
    "Pinguino", // Without accent
    "Pingüinos",
    "Pinguinos" // Without accent
  ],
  
  "Pájaro": [
    "Pajaro", // Without accent
    "Pájaros",
    "Pajaros", // Without accent
    "Ave",
    "Aves"
  ],

  // Farm Animals
  "Vaca": [
    "Vacas",
    "Ganado",
    "Toro", // Normalize bull to cow
    "Toros"
  ],
  
  "Caballo": [
    "Caballos",
    "Semental",
    "Yegua",
    "Poni"
  ],
  
  "Cerdo": [
    "Cerdos",
    "Cochino",
    "Cochinos"
  ],
  
  "Oveja": [
    "Ovejas",
    "Cordero",
    "Corderos",
    "Carnero"
  ],
  
  "Pollo": [
    "Pollos",
    "Gallina",
    "Gallinas",
    "Gallo", // Normalize rooster to chicken
    "Gallos"
  ],

  // Wild Animals - deer family
  "Ciervo": [
    "Ciervos",
    "Venado",
    "Venados"
  ],

  // Canines
  "Lobo": [
    "Lobos",
    "Lobo Gris"
  ],
  
  "Zorro": [
    "Zorros"
  ],
  
  "Perro": [
    "Perros",
    "Cachorro",
    "Cachorros",
    "Can"
  ],

  // Felines
  "Gato": [
    "Gatos",
    "Gatito",
    "Gatitos",
    "Felino"
  ],

  // Insects - bee variations
  "Abeja": [
    "Abejas",
    "Abeja de Miel"
  ],
  
  "Mariposa": [
    "Mariposas",
    "Monarca"
  ],
  
  "Araña": [
    "Arañas",
    "Aranas" // Without accent
  ],

  // Australian Animals
  "Canguro": [
    "Canguros"
  ],
  
  "Koala": [
    "Koalas",
    "Oso Koala" // Not actually a bear
  ],

  // Simple accent normalizations
  "Tortuga": ["Tortugas"],
  "Rana": ["Ranas"],
  "Sapo": ["Sapos"],
  "Conejo": ["Conejos"],
  "Ardilla": ["Ardillas"],
  "Hormiga": ["Hormigas"],
  "Castor": ["Castores"],
  "Nutria": ["Nutrias"],
  "Foca": ["Focas"],
  "Morsa": ["Morsas"],
  "Pulpo": ["Pulpos"],
  "Medusa": ["Medusas"],
  "Estrella de Mar": ["Estrellas de Mar"],
  "Flamenco": ["Flamencos"],
  "Loro": ["Loros"],
  "Pavo Real": ["Pavos Reales"],
  "Avestruz": ["Avestruces"],
  "Camello": ["Camellos"],
  "Llama": ["Llamas"],
  "Perezoso": ["Perezosos"],
  "Armadillo": ["Armadillos"],
  "Ornitorrinco": ["Ornitorrincos"],
  "Suricata": ["Suricatas"],

  // Accent-heavy animals
  "Murciélago": [
    "Murcielago", // Without accent
    "Murciélagos",
    "Murcielagos" // Without accent
  ],
  
  "Escorpión": [
    "Escorpion", // Without accent
    "Escorpiones"
  ],
  
  "Libélula": [
    "Libelula", // Without accent
    "Libélulas",
    "Libelulas" // Without accent
  ],
  
  "Colibrí": [
    "Colibri", // Without accent
    "Colibrís",
    "Colibris" // Without accent
  ]
};
