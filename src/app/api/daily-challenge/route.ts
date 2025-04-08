import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge, ChallengeTranslation, Fact, CategoryType } from '@/types';
import { unstable_cache } from 'next/cache';

// Cache the daily challenge fetch for 5 minutes
const getChallengeWithTranslations = unstable_cache(
  async () => {
    const { db } = await connectToDatabase();
    const today = new Date().toISOString().split('T')[0];

    // Use a single aggregation pipeline to get the challenge and ALL translations
    const result = await db.collection<Challenge>('challenges').aggregate([
      { 
        $match: { date: today }
      },
      {
        $lookup: {
          from: 'challenge_translations',
          let: { challengeId: '$challengeId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$challengeId', '$$challengeId'] }
              }
            }
          ],
          as: 'translations'
        }
      }
    ]).toArray();

    if (!result.length) {
      return null;
    }

    const challenge = result[0];
    const translations = challenge.translations || [];
    delete challenge.translations;

    return {
      challenge,
      translations: translations.reduce((acc: Record<string, ChallengeTranslation>, trans: ChallengeTranslation) => {
        acc[trans.language] = trans;
        return acc;
      }, {})
    };
  },
  ['daily-challenge'],
  { revalidate: 300 } // Cache for 5 minutes
);

export async function GET(request: Request) {
  try {
    // Get the language from the request header or query parameter
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('lang') || 'en';
    
    const data = await getChallengeWithTranslations();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No challenge found for today' }, 
        { status: 404 }
      );
    }

    const { challenge, translations } = data;

    // If language is English, return the challenge as is (excluding answer and alternatives)
    if (language === 'en') {
      const { answer, alternatives, ...challengeWithoutAnswer } = challenge;
      return NextResponse.json(challengeWithoutAnswer);
    }

    // For other languages, get the translation and merge with challenge
    const translation = translations[language];
    if (translation) {
      // Create a new facts array with translated content
      const translatedFacts = challenge.facts.map((fact: Fact<CategoryType>) => ({
        ...fact,
        content: translation.facts[fact.factType] || fact.content
      }));

      // Return the challenge with translated facts (excluding answer and alternatives)
      const { answer, alternatives, ...challengeWithoutAnswer } = challenge;
      return NextResponse.json({
        ...challengeWithoutAnswer,
        facts: translatedFacts
      });
    }

    // If no translation found, return English version
    const { answer, alternatives, ...challengeWithoutAnswer } = challenge;
    return NextResponse.json(challengeWithoutAnswer);
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}