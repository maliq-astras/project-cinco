import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';
import { unstable_cache } from 'next/cache';
import { Collection } from 'mongodb';

// Cache the answers for a challenge for 24 hours
const getChallengeAnswers = unstable_cache(
  async (challengeId: string, language: 'en' | 'es') => {
    const { db } = await connectToDatabase();
    
    const challengesCollection = db.collection('challenges') as Collection<Challenge>;
    
    // Add timeout to prevent hanging queries
    const dbPromise = challengesCollection.findOne(
      { challengeId },
      { projection: { _id: 0, answer: 1 } }
    ) as Promise<{ answer: string | { en: string; es: string } } | null>;
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timed out')), 10000)
    );
    
    const challenge = await Promise.race([dbPromise, timeoutPromise]) as { answer: string | { en: string; es: string } } | null;

    if (!challenge) return null;

    // Get answer in requested language
    const answer = typeof challenge.answer === 'string'
      ? challenge.answer
      : challenge.answer[language] || challenge.answer.en;

    return answer.toLowerCase();
  },
  ['challenge-answers'],
  { revalidate: 86400 } // Cache for 24 hours
);

// Initialize database indexes
export async function initializeIndexes() {
  const { db } = await connectToDatabase();
  
  // Create indexes if they don't exist
  await db.collection('challenges').createIndex(
    { challengeId: 1 }, 
    { unique: true, name: 'challengeId_1' }
  );
  
  console.log('Verify-guess indexes initialized');
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
    
    const answer = await getChallengeAnswers(challengeId, language as 'en' | 'es');
    if (!answer) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }

    const normalizedGuess = guess.trim().toLowerCase();
    const isCorrect = normalizedGuess === answer;

    return NextResponse.json({ isCorrect });
  } catch (error) {
    console.error('Error verifying guess:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}