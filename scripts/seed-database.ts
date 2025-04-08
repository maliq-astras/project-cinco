// scripts/seed-database.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { CountriesGenerator } from './challenge-generators/countries-generator';
import { AnimalsGenerator } from './challenge-generators/animals-generator';
import { Challenge, ChallengeTranslation } from '../src/types';
// Import other generators as needed

// Load environment variables
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

async function seedDatabase() {
  console.log('Starting database seed process...');
  
  const client = new MongoClient(uri as string);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');
    const translationsCollection = db.collection<ChallengeTranslation>('challenge_translations');
    
    // Initialize generators
    const countriesGenerator = new CountriesGenerator();
    const animalsGenerator = new AnimalsGenerator();
    // Add other generators
    
    const today = new Date();
    
    // Generate just a few challenges for testing
    const challenges = [...countriesGenerator.generate(1, today), ...animalsGenerator.generate(1, new Date(today.getTime() + 24 * 60 * 60 * 1000))];
    
    // Delete existing challenges and translations (be careful with this in production!)
    const deleteChallengesResult = await challengesCollection.deleteMany({});
    const deleteTranslationsResult = await translationsCollection.deleteMany({});
    console.log(`Deleted ${deleteChallengesResult.deletedCount} existing challenges and ${deleteTranslationsResult.deletedCount} translations`);
    
    // Insert challenges
    const insertResult = await challengesCollection.insertMany(challenges);
    console.log(`Inserted ${insertResult.insertedCount} challenges`);
    
    // Create translations for each challenge
    const translations: ChallengeTranslation[] = [];
    
    for (const challenge of challenges) {
      // Get the original data from the generator to access translations
      const generatorData = [...countriesGenerator.getData(), ...animalsGenerator.getData()]
        .find(data => data.answer === challenge.answer);
      
      if (generatorData?.translations?.es) {
        const translation: ChallengeTranslation = {
          challengeId: challenge.challengeId,
          language: 'es',
          facts: generatorData.translations.es.facts,
          answer: generatorData.translations.es.answer,
          alternatives: generatorData.translations.es.alternatives
        };
        translations.push(translation);
      }
    }
    
    // Insert translations
    if (translations.length > 0) {
      const insertTranslationsResult = await translationsCollection.insertMany(translations);
      console.log(`Inserted ${insertTranslationsResult.insertedCount} translations`);
    }
    
    // Create indexes for better query performance
    await challengesCollection.createIndex({ date: 1 }, { unique: true });
    await challengesCollection.createIndex({ challengeId: 1 }, { unique: true });
    await translationsCollection.createIndex({ challengeId: 1, language: 1 }, { unique: true });
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase().catch(console.error);