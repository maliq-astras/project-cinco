// scripts/seed-translations.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Challenge, ChallengeTranslation } from '../src/types';

// Load environment variables
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Spanish translations for each category
const translations: Record<string, {
  facts: Record<string, string>;
  answer: string;
  alternatives: string[];
}> = {
  "New Zealand": {
    facts: {
      "Language(s)": "Tengo tres idiomas oficialmente reconocidos, siendo uno de ellos el primer lenguaje de señas en recibir estatus oficial en cualquier país.",
      "Flag": "Soy uno de los pocos países cuya bandera presenta la constelación de la Cruz del Sur sobre un campo azul.",
      "Cities": "Tengo una ciudad apodada la 'Ciudad de las Velas' por tener más barcos per cápita que cualquier otro lugar en el mundo.",
      "Economy": "El turismo es un importante motor económico, pero mis mayores ingresos por exportaciones provienen de productos lácteos, que representan alrededor del 20% de mis exportaciones totales.",
      "Demographics": "Tengo una población de aproximadamente 5 millones de personas, con casi un tercio viviendo en mi área urbana más grande.",
      "Origin": "Fui la última masa de tierra habitable importante en ser poblada por humanos, con mi población indígena llegando hace aproximadamente 700 años.",
      "Geography & Climate": "Consisto en dos islas principales y más de 700 islas más pequeñas, completamente rodeadas por océano sin fronteras terrestres con ninguna otra nación.",
      "Wildcard": "Fui el primer país del mundo en dar a las mujeres el derecho al voto en 1893, más de 25 años antes que Estados Unidos."
    },
    answer: "Nueva Zelanda",
    alternatives: [
      "Australia",
      "Tasmania",
      "Fiji",
      "Samoa",
      "Tonga",
      "Vanuatu",
      "Islas Salomón",
      "Papua Nueva Guinea",
      "Indonesia"
    ]
  },
  "Japan": {
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
    answer: "Japón",
    alternatives: [
      "China",
      "Corea del Sur",
      "Taiwán",
      "Filipinas",
      "Vietnam",
      "Tailandia",
      "Malasia",
      "Indonesia",
      "Singapur"
    ]
  },
  "Platypus": {
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
    answer: "Ornitorrinco",
    alternatives: [
      "Equidna",
      "Castor",
      "Pangolín",
      "Nutria",
      "Capibara",
      "Pato",
      "Rata Almizclera",
      "Mangosta",
      "Koala"
    ]
  },
  "Octopus": {
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
    answer: "Pulpo",
    alternatives: [
      "Calamar",
      "Sepia",
      "Nautilo",
      "Pepino de Mar",
      "Medusa",
      "Erizo de Mar",
      "Estrella de Mar",
      "Langosta",
      "Coral"
    ]
  }
};

async function seedTranslations() {
  console.log('Starting translations seed process...');
  
  const client = new MongoClient(uri as string);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');
    const translationsCollection = db.collection<ChallengeTranslation>('challenge_translations');
    
    // Get all challenges
    const challenges = await challengesCollection.find({}).toArray();
    console.log(`Found ${challenges.length} challenges to translate`);
    
    // Clear existing translations
    await translationsCollection.deleteMany({});
    console.log('Cleared existing translations');
    
    // Create translations for each challenge
    const createdTranslations: ChallengeTranslation[] = [];
    
    for (const challenge of challenges) {
      // Find the translation for this challenge's answer
      const translation = translations[challenge.answer];
      
      if (translation) {
        // Create translation object
        const translationDoc: ChallengeTranslation = {
          challengeId: challenge.challengeId,
          language: 'es',
          facts: {},
          answer: translation.answer,
          alternatives: translation.alternatives
        };

        // Map each fact to its translation
        challenge.facts.forEach(fact => {
          if (translation.facts[fact.factType]) {
            translationDoc.facts[fact.factType] = translation.facts[fact.factType];
          }
        });

        createdTranslations.push(translationDoc);
      }
    }
    
    // Insert translations
    if (createdTranslations.length > 0) {
      const result = await translationsCollection.insertMany(createdTranslations);
      console.log(`Inserted ${result.insertedCount} translations`);
    
    // Create indexes for better query performance
    await translationsCollection.createIndex({ challengeId: 1, language: 1 }, { unique: true });
      console.log('Created indexes for translations collection');
    }
    
    console.log('Translation seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding translations:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedTranslations().catch(console.error); 