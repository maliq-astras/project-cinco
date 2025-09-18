// scripts/challenge-rotation-manager.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Challenge, CategoryType } from '../src/types';

// Load environment variables
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

interface RotationStats {
  totalChallenges: number;
  dateRange: {
    start: string;
    end: string;
  };
  categoryCounts: Record<CategoryType, number>;
  nextChallenge: Challenge | null;
  todayChallenge: Challenge | null;
}

/**
 * Get comprehensive stats about the challenge rotation
 */
async function getChallengeRotationStats(): Promise<RotationStats> {
  const client = new MongoClient(uri as string);

  try {
    await client.connect();
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');

    // Get all challenges ordered by date
    const allChallenges = await challengesCollection
      .find({})
      .sort({ date: 1 })
      .toArray();

    const totalChallenges = allChallenges.length;

    // Calculate date range
    const dateRange = {
      start: allChallenges[0]?.date || 'N/A',
      end: allChallenges[totalChallenges - 1]?.date || 'N/A'
    };

    // Count challenges by category
    const categoryCounts = allChallenges.reduce((acc, challenge) => {
      acc[challenge.category] = (acc[challenge.category] || 0) + 1;
      return acc;
    }, {} as Record<CategoryType, number>);

    // Get today's challenge
    const today = new Date().toISOString().split('T')[0];
    const todayChallenge = await challengesCollection.findOne({ date: today });

    // Get next upcoming challenge
    const nextChallenge = await challengesCollection.findOne(
      { date: { $gt: today } },
      { sort: { date: 1 } }
    );

    return {
      totalChallenges,
      dateRange,
      categoryCounts,
      nextChallenge,
      todayChallenge
    };
  } finally {
    await client.close();
  }
}

/**
 * Get challenge for a specific date
 */
async function getChallengeForDate(date: string): Promise<Challenge | null> {
  const client = new MongoClient(uri as string);

  try {
    await client.connect();
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');

    return await challengesCollection.findOne({ date });
  } finally {
    await client.close();
  }
}

/**
 * Get the next N upcoming challenges
 */
async function getUpcomingChallenges(count: number = 7): Promise<Challenge[]> {
  const client = new MongoClient(uri as string);

  try {
    await client.connect();
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');

    const today = new Date().toISOString().split('T')[0];

    return await challengesCollection
      .find({ date: { $gte: today } })
      .sort({ date: 1 })
      .limit(count)
      .toArray();
  } finally {
    await client.close();
  }
}

/**
 * Reassign dates to all challenges (useful for reshuffling)
 */
async function reassignChallengeDates(startDate?: string): Promise<void> {
  const client = new MongoClient(uri as string);

  try {
    await client.connect();
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');

    // Get all challenges without dates in a random order
    const challenges = await challengesCollection
      .find({})
      .sort({ challengeId: 1 }) // Sort by challengeId for deterministic ordering
      .toArray();

    const baseDate = startDate ? new Date(startDate) : new Date();

    console.log(`📅 Reassigning dates for ${challenges.length} challenges starting from ${baseDate.toISOString().split('T')[0]}`);

    // Shuffle challenges deterministically based on their challengeId
    const shuffledChallenges = [...challenges].sort((a, b) => {
      const aHash = a.challengeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const bHash = b.challengeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return aHash - bHash;
    });

    // Assign new dates
    const bulkOps = shuffledChallenges.map((challenge, index) => {
      const challengeDate = new Date(baseDate);
      challengeDate.setDate(baseDate.getDate() + index);
      const newDate = challengeDate.toISOString().split('T')[0];

      return {
        updateOne: {
          filter: { challengeId: challenge.challengeId },
          update: { $set: { date: newDate } }
        }
      };
    });

    await challengesCollection.bulkWrite(bulkOps);
    console.log(`✅ Successfully reassigned dates for ${challenges.length} challenges`);
  } finally {
    await client.close();
  }
}

/**
 * Validate that all challenges have proper structure
 */
async function validateChallenges(): Promise<{ valid: boolean; issues: string[] }> {
  const client = new MongoClient(uri as string);
  const issues: string[] = [];

  try {
    await client.connect();
    const db = client.db();
    const challengesCollection = db.collection<Challenge>('challenges');

    const challenges = await challengesCollection.find({}).toArray();

    for (const challenge of challenges) {
      // Check required fields
      if (!challenge.challengeId) {
        issues.push(`Missing challengeId: ${challenge._id}`);
      }
      if (!challenge.date) {
        issues.push(`Missing date: ${challenge.challengeId}`);
      }
      if (!challenge.category) {
        issues.push(`Missing category: ${challenge.challengeId}`);
      }
      if (!challenge.answer || !challenge.answer.en) {
        issues.push(`Missing answer: ${challenge.challengeId}`);
      }
      if (!challenge.facts || challenge.facts.length === 0) {
        issues.push(`Missing facts: ${challenge.challengeId}`);
      }
      if (!challenge.alternatives || !challenge.alternatives.en || challenge.alternatives.en.length === 0) {
        issues.push(`Missing alternatives: ${challenge.challengeId}`);
      }

      // Check facts structure
      for (const fact of challenge.facts || []) {
        if (!fact.factType) {
          issues.push(`Missing factType in challenge: ${challenge.challengeId}`);
        }
        if (!fact.content) {
          issues.push(`Missing fact content in challenge: ${challenge.challengeId}`);
        }
      }
    }

    // Check for duplicate dates
    const dates = challenges.map(c => c.date);
    const duplicateDates = dates.filter((date, index) => dates.indexOf(date) !== index);
    if (duplicateDates.length > 0) {
      issues.push(`Duplicate dates found: ${duplicateDates.join(', ')}`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  } finally {
    await client.close();
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'stats':
        console.log('📊 Challenge Rotation Statistics\n');
        const stats = await getChallengeRotationStats();
        console.log(`Total challenges: ${stats.totalChallenges}`);
        console.log(`Date range: ${stats.dateRange.start} to ${stats.dateRange.end}`);
        console.log('\nCategory distribution:');
        Object.entries(stats.categoryCounts).forEach(([category, count]) => {
          console.log(`  ${category}: ${count} challenges`);
        });
        console.log('\nToday\'s challenge:');
        if (stats.todayChallenge) {
          console.log(`  ${stats.todayChallenge.challengeId} (${stats.todayChallenge.category})`);
        } else {
          console.log('  No challenge for today');
        }
        console.log('\nNext challenge:');
        if (stats.nextChallenge) {
          console.log(`  ${stats.nextChallenge.date}: ${stats.nextChallenge.challengeId} (${stats.nextChallenge.category})`);
        } else {
          console.log('  No upcoming challenges');
        }
        break;

      case 'upcoming':
        const count = parseInt(process.argv[3]) || 7;
        console.log(`📅 Next ${count} upcoming challenges:\n`);
        const upcoming = await getUpcomingChallenges(count);
        upcoming.forEach(challenge => {
          console.log(`${challenge.date}: ${challenge.challengeId} (${challenge.category})`);
        });
        break;

      case 'date':
        const targetDate = process.argv[3];
        if (!targetDate) {
          console.error('Please provide a date (YYYY-MM-DD)');
          process.exit(1);
        }
        console.log(`🎯 Challenge for ${targetDate}:\n`);
        const challenge = await getChallengeForDate(targetDate);
        if (challenge) {
          console.log(`Challenge ID: ${challenge.challengeId}`);
          console.log(`Category: ${challenge.category}`);
          console.log(`Answer: ${challenge.answer.en}`);
        } else {
          console.log('No challenge found for that date');
        }
        break;

      case 'reassign':
        const startDate = process.argv[3];
        await reassignChallengeDates(startDate);
        break;

      case 'validate':
        console.log('🔍 Validating challenge structure...\n');
        const validation = await validateChallenges();
        if (validation.valid) {
          console.log('✅ All challenges are valid!');
        } else {
          console.log('❌ Validation issues found:');
          validation.issues.forEach(issue => console.log(`  - ${issue}`));
        }
        break;

      default:
        console.log('Challenge Rotation Manager\n');
        console.log('Usage:');
        console.log('  npm run challenge-rotation stats           - Show rotation statistics');
        console.log('  npm run challenge-rotation upcoming [N]    - Show next N upcoming challenges');
        console.log('  npm run challenge-rotation date YYYY-MM-DD - Show challenge for specific date');
        console.log('  npm run challenge-rotation reassign [date] - Reassign all challenge dates');
        console.log('  npm run challenge-rotation validate        - Validate challenge structure');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export {
  getChallengeRotationStats,
  getChallengeForDate,
  getUpcomingChallenges,
  reassignChallengeDates,
  validateChallenges
};