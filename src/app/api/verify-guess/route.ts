import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge, ChallengeTranslation } from '@/types';
import { unstable_cache } from 'next/cache';
import { Collection, Db } from 'mongodb';

// Cache the answers for a challenge for 5 minutes
const getChallengeAnswers = unstable_cache(
  async (challengeId: string) => {
    const { db } = await connectToDatabase();
    
    // Get the main challenge answer
    const challengesCollection = db.collection('challenges') as Collection<Challenge>;
    const challenge = await challengesCollection.findOne(
      { challengeId },
      { projection: { _id: 0, answer: 1 } }
    );

    if (!challenge) return null;

    // Get only the answers from translations
    const translationsCollection = db.collection('challenge_translations') as Collection<ChallengeTranslation>;
    const translations = await translationsCollection.find(
      { challengeId },
      { projection: { _id: 0, answer: 1 } }
    ).toArray();
    
    // Create a set of all possible answers
    const answers = new Set<string>();
    answers.add(challenge.answer.toLowerCase());
    
    // Add translated answers
    translations.forEach((trans: ChallengeTranslation) => {
      answers.add(trans.answer.toLowerCase());
    });

    return Array.from(answers);
  },
  ['challenge-answers'],
  { revalidate: 300 } // Cache for 5 minutes
);

// Initialize database indexes
export async function initializeIndexes() {
  const { db } = await connectToDatabase();
  
  // Create indexes if they don't exist (is needed but causes errors in the console)
  await Promise.all([
    db.collection('challenges').createIndex({ challengeId: 1 }, { unique: true, name: 'challengeId_1' }),
    db.collection('challenge_translations').createIndex({ challengeId: 1 }, { unique: true, name: 'challengeId_1' })
  ]);
}

// Initialize indexes on startup
initializeIndexes().catch(console.error);

export async function POST(request: Request) {
  try {
    const { challengeId, guess, language = 'en' } = await request.json();
    
    if (!challengeId || !guess) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Special case for skipped guesses - return immediately
    if (guess === "___SKIPPED___") {
      return NextResponse.json({
        isCorrect: false,
        message: 'Skipped.'
      });
    }

    // Get all possible answers for this challenge from cache
    const answers = await getChallengeAnswers(challengeId);
    
    if (!answers) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }

    // Normalize and check the guess
    const normalizedGuess = guess.toLowerCase().trim();
    const isCorrect = answers.includes(normalizedGuess);
    
    return NextResponse.json({
      isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect, try again.'
    });
  } catch (error) {
    console.error('Error verifying guess:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}