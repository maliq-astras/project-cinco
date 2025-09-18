// scripts/import-real-challenges.ts
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { Challenge, CategoryType } from '../src/types';

// Load environment variables
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

interface RealChallenge {
  answer: {
    en: string;
    es: string;
  };
  imageUrl: string;
  citation: string;
  facts: Record<string, { en: string; es: string }>;
  expanded: Record<string, { en: string; es: string }>;
  alternatives: {
    en: string[];
    es: string[];
  };
}

/**
 * Get all challenge files from the challenges directory
 */
function getAllChallengeFiles(): Array<{ filePath: string; category: CategoryType; fileName: string }> {
  const challengesDir = path.join(process.cwd(), 'challenges');
  const challengeFiles: Array<{ filePath: string; category: CategoryType; fileName: string }> = [];

  // Read all category directories
  const categories = fs.readdirSync(challengesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const category of categories) {
    const categoryDir = path.join(challengesDir, category);
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const fileName = path.basename(file, '.json');

      // Map directory names to CategoryType enum
      let categoryType: CategoryType;
      switch (category) {
        case 'countries':
          categoryType = CategoryType.COUNTRIES;
          break;
        case 'animals':
          categoryType = CategoryType.ANIMALS;
          break;
        case 'movies':
          categoryType = CategoryType.MOVIES;
          break;
        case 'books':
          categoryType = CategoryType.BOOKS;
          break;
        case 'musicians':
          categoryType = CategoryType.MUSICIANS;
          break;
        case 'athletes':
          categoryType = CategoryType.ATHLETES;
          break;
        case 'history':
          categoryType = CategoryType.HISTORY;
          break;
        case 'companies':
          categoryType = CategoryType.COMPANIES;
          break;
        case 'tv-shows':
          categoryType = CategoryType.TV_SHOWS;
          break;
        default:
          console.warn(`Unknown category: ${category}, skipping...`);
          continue;
      }

      challengeFiles.push({
        filePath,
        category: categoryType,
        fileName
      });
    }
  }

  return challengeFiles;
}

/**
 * Transform real challenge data to MongoDB Challenge format
 */
function transformRealChallenge(
  realChallenge: RealChallenge,
  category: CategoryType,
  fileName: string,
  date: string
): Challenge {
  // Transform facts from object to array format
  const facts = Object.entries(realChallenge.facts).map(([factType, content]) => ({
    category,
    factType,
    content: content // Keep the multilingual object structure
  }));

  // Generate a unique challengeId
  const challengeId = `${category.toLowerCase()}-${fileName}-${date}`;

  return {
    challengeId,
    date,
    category,
    answer: realChallenge.answer,
    alternatives: realChallenge.alternatives,
    facts,
    metadata: {
      imageUrl: realChallenge.imageUrl,
      citation: realChallenge.citation,
      expanded: realChallenge.expanded,
      source: 'real-challenges',
      importedAt: new Date().toISOString()
    }
  };
}

/**
 * Create deterministic date assignment for challenges
 */
function assignDates(challengeFiles: Array<{ filePath: string; category: CategoryType; fileName: string }>): string[] {
  const startDate = new Date(); // Start from today
  const dates: string[] = [];

  // Shuffle challenges deterministically to mix categories
  const shuffledChallenges = [...challengeFiles].sort((a, b) => {
    // Create deterministic shuffle based on file names
    const aHash = a.fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bHash = b.fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return aHash - bHash;
  });

  // Assign sequential dates
  shuffledChallenges.forEach((_, index) => {
    const challengeDate = new Date(startDate);
    challengeDate.setDate(startDate.getDate() + index);
    dates.push(challengeDate.toISOString().split('T')[0]);
  });

  return dates;
}

async function importRealChallenges() {
  console.log('🚀 Starting import of real challenges...');

  const client = new MongoClient(uri as string);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');

    // Get all challenge files
    const challengeFiles = getAllChallengeFiles();
    console.log(`📁 Found ${challengeFiles.length} challenge files`);

    // Assign dates to challenges
    const dates = assignDates(challengeFiles);

    // Transform and prepare challenges for import
    const challengesToImport: Challenge[] = [];

    for (let i = 0; i < challengeFiles.length; i++) {
      const { filePath, category, fileName } = challengeFiles[i];
      const date = dates[i];

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const realChallenge: RealChallenge = JSON.parse(fileContent);

        const transformedChallenge = transformRealChallenge(
          realChallenge,
          category,
          fileName,
          date
        );

        challengesToImport.push(transformedChallenge);

        console.log(`✓ Processed: ${fileName} (${category}) -> ${date}`);
      } catch (error: unknown) {
        console.error(`❌ Error processing ${filePath}:`, error);
      }
    }

    console.log(`📊 Transformed ${challengesToImport.length} challenges`);

    // Clear existing challenges (for clean import)
    console.log('🗑️  Clearing existing challenges...');
    await challengesCollection.deleteMany({});

    // Import all challenges
    console.log('💾 Importing challenges to database...');
    const result = await challengesCollection.insertMany(challengesToImport);

    console.log(`✅ Successfully imported ${result.insertedCount} challenges!`);

    // Create indexes for optimal performance
    console.log('📇 Creating database indexes...');
    try {
      await challengesCollection.createIndex(
        { date: 1 },
        { unique: true, name: 'date_unique' }
      );
    } catch (error: unknown) {
      if ((error as any).code === 85) {
        console.log('Date index already exists, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await challengesCollection.createIndex(
        { challengeId: 1 },
        { unique: true, name: 'challengeId_unique' }
      );
    } catch (error: unknown) {
      if ((error as any).code === 85) {
        console.log('ChallengeId index already exists, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await challengesCollection.createIndex(
        { category: 1 },
        { name: 'category_index' }
      );
    } catch (error: unknown) {
      if ((error as any).code === 85) {
        console.log('Category index already exists, skipping...');
      } else {
        throw error;
      }
    }

    console.log('✅ Database indexes created');

    // Print summary
    console.log('\n📈 Import Summary:');
    console.log(`Total challenges imported: ${result.insertedCount}`);
    console.log(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);
    console.log(`Categories: ${[...new Set(challengesToImport.map(c => c.category))].join(', ')}`);

    console.log('\n🎯 Next steps:');
    console.log('1. Test the daily-challenge API endpoint');
    console.log('2. Verify challenge rotation is working');
    console.log('3. Check that all fact types and alternatives are properly formatted');

  } catch (error: unknown) {
    console.error('❌ Error during import:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the import
if (require.main === module) {
  importRealChallenges()
    .then(() => {
      console.log('🎉 Import completed successfully!');
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}

export { importRealChallenges };