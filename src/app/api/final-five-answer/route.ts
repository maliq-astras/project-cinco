import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Cache for challenge answers to reduce database load
const answerCache = new Map<string, string>();

type ChallengeWithAnswer = {
  answer: string | { [key: string]: string };
};

// Initialize database indexes
export async function initializeIndexes() {
  const { db } = await connectToDatabase();
  
  // Create indexes if they don't exist
  await db.collection('challenges').createIndex(
    { challengeId: 1 }, 
    { unique: true, name: 'challengeId_1' }
  );
  
  console.log('Final-five-answer indexes initialized');
}

// Initialize indexes on startup
initializeIndexes().catch(console.error);

export async function POST(request: Request) {
  try {
    const { challengeId, language = 'en' } = await request.json();
    
    if (!challengeId) {
      return NextResponse.json({ error: 'Missing challenge ID' }, { status: 400 });
    }
    
    // Try to get cached answer
    const cacheKey = `${challengeId}-${language}`;
    let answer = answerCache.get(cacheKey);
    
    if (!answer) {
      const { db } = await connectToDatabase();
      
      // Find the challenge with a timeout
      const dbPromise = db.collection('challenges').findOne(
        { challengeId },
        { projection: { _id: 0, answer: 1 } }
      ) as Promise<ChallengeWithAnswer | null>;
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timed out')), 15000)
      );
      
      const challenge = await Promise.race([dbPromise, timeoutPromise]) as ChallengeWithAnswer | null;
      
      if (!challenge) {
        return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
      }
      
      // Get the answer in the requested language
      let fetchedAnswer: string;
      
      if (typeof challenge.answer === 'string') {
        fetchedAnswer = challenge.answer;
      } else {
        fetchedAnswer = challenge.answer[language] || challenge.answer.en || '';
      }
      
      if (!fetchedAnswer) {
        return NextResponse.json({ error: 'Answer not found for language' }, { status: 404 });
      }
      
      answer = fetchedAnswer;
        
      // Cache the result for 5 minutes
      answerCache.set(cacheKey, answer);
      setTimeout(() => answerCache.delete(cacheKey), 5 * 60 * 1000);
    }
      
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error fetching answer:', error);
    return NextResponse.json(
      { error: 'Service unavailable - please try again' }, 
      { status: 503 }
    );
  }
} 