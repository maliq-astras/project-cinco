// scripts/seed-database.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { CountriesGenerator } from './challenge-generators/countries-generator';
import { AnimalsGenerator } from './challenge-generators/animals-generator';
import { FamousBrandsGenerator } from './challenge-generators/famous-brands-generator';
import { AthletesGenerator } from './challenge-generators/athletes-generator';
import { HistoricalFiguresGenerator } from './challenge-generators/historical-figures-generator';
import { Challenge } from '../src/types';
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
    
    // Initialize generators
    const countriesGenerator = new CountriesGenerator();
    const animalsGenerator = new AnimalsGenerator();
    const famousBrandsGenerator = new FamousBrandsGenerator();
    const athletesGenerator = new AthletesGenerator();
    const historicalFiguresGenerator = new HistoricalFiguresGenerator();
    // Add other generators
    
    const today = new Date();
    
    // Generate just a few challenges for testing
    const challenges = [
      ...historicalFiguresGenerator.generate(1, today),
      ...athletesGenerator.generate(1, new Date(today.getTime() + 24 * 60 * 60 * 1000)),
      ...famousBrandsGenerator.generate(1, new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
      ...countriesGenerator.generate(1, new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
      ...animalsGenerator.generate(1, new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000))
    ];
    
    // Delete existing challenges
    const deleteChallengesResult = await challengesCollection.deleteMany({});
    console.log(`Deleted ${deleteChallengesResult.deletedCount} existing challenges`);
    
    // Insert challenges
    const insertResult = await challengesCollection.insertMany(challenges);
    console.log(`Inserted ${insertResult.insertedCount} challenges`);
    
    // Create indexes for better query performance
    await challengesCollection.createIndex({ date: 1 }, { unique: true });
    await challengesCollection.createIndex({ challengeId: 1 }, { unique: true });
    
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