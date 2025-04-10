import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge, Fact, CategoryType } from '@/types';
import { unstable_cache } from 'next/cache';
import { Collection } from 'mongodb';

// Cache the daily challenge fetch for 5 minutes
const getDailyChallenge = unstable_cache(
  async () => {
    const { db } = await connectToDatabase();
    const today = new Date().toISOString().split('T')[0];

    // Simple find query since translations are now embedded
    const challengesCollection = db.collection('challenges') as Collection<Challenge>;
    const challenge = await challengesCollection.findOne(
      { date: today },
      { projection: { _id: 0 } }
    );

    return challenge;
  },
  ['daily-challenge'],
  { revalidate: 300 } // Cache for 5 minutes
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'en') as 'en' | 'es';
    
    const challenge = await getDailyChallenge();
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'No challenge found for today' }, 
        { status: 404 }
      );
    }

    // Return the challenge without answer and alternatives
    const { answer, alternatives, ...challengeWithoutAnswers } = challenge;

    // Return the challenge with facts content in the requested language
    return NextResponse.json({
      ...challengeWithoutAnswers,
      facts: challenge.facts.map(fact => ({
        ...fact,
        content: typeof fact.content === 'string' 
          ? fact.content // If content is already a string, keep it as is
          : (fact.content[language] || fact.content.en) // If content has language keys, get the right one
      }))
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}