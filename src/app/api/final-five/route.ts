// src/app/api/final-five/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge, ChallengeTranslation } from '@/types';

export async function POST(request: Request) {
  try {
    const { challengeId, previousGuesses = [], language = 'en' } = await request.json();
    
    if (!challengeId) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Find the challenge
    const challenge = await db.collection<Challenge>('challenges').findOne(
      { challengeId }
    );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }

    // Get all translations for this challenge
    const translations = await db.collection<ChallengeTranslation>('challenge_translations')
      .find({ challengeId })
      .toArray();

    // Get the answer in the requested language
    let answer = challenge.answer;
    let alternatives = challenge.alternatives;

    // If language is not English, try to get the translation
    if (language !== 'en') {
      const translation = translations.find(t => t.language === language);
      if (translation) {
        answer = translation.answer;
        alternatives = translation.alternatives;
      }
    }
    
    // Normalize previous guesses
    const normalizedPreviousGuesses = previousGuesses.map((guess: string) => 
      guess.trim().toLowerCase()
    );

    // Get all possible answers in all languages
    const allAnswers = [challenge.answer.toLowerCase()];
    translations.forEach(translation => {
      allAnswers.push(translation.answer.toLowerCase());
    });
    
    // Filter out alternatives that:
    // 1. Have already been guessed
    // 2. Are answers in any language
    let availableAlternatives = alternatives.filter(alt => {
      const normalizedAlt = alt.trim().toLowerCase();
      return !normalizedPreviousGuesses.includes(normalizedAlt) &&
             !allAnswers.includes(normalizedAlt);
    });
    
    // Ensure we only return 4 alternatives (plus the correct answer)
    availableAlternatives = availableAlternatives.slice(0, 4);
    
    // Create the Final 5 options with the correct answer and 4 alternatives
    const finalFiveOptions = [
      answer,
      ...availableAlternatives
    ];
    
    // Shuffle the options
    const shuffledOptions = finalFiveOptions.sort(() => Math.random() - 0.5);
    
    return NextResponse.json({
      options: shuffledOptions
    });
  } catch (error) {
    console.error('Error fetching Final Five options:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('id');
    const previousGuessesParam = searchParams.get('previousGuesses');
    const language = searchParams.get('lang') || 'en';
    
    if (!challengeId) {
      return NextResponse.json(
        { error: 'Missing challenge ID' }, 
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get the challenge with the answer and alternatives
    const challenge = await db.collection<Challenge>('challenges').findOne(
      { challengeId },
      { projection: { answer: 1, alternatives: 1 } }
    );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }

    // Get all translations for this challenge
    const translations = await db.collection<ChallengeTranslation>('challenge_translations')
      .find({ challengeId })
      .toArray();

    // Get the answer in the requested language
    let answer = challenge.answer;
    let alternatives = challenge.alternatives;

    // If language is not English, try to get the translation
    if (language !== 'en') {
      const translation = translations.find(t => t.language === language);
      if (translation) {
        answer = translation.answer;
        alternatives = translation.alternatives;
      }
    }

    // Parse previous guesses if provided
    let previousGuesses: string[] = [];
    if (previousGuessesParam) {
      try {
        previousGuesses = JSON.parse(previousGuessesParam);
      } catch (e) {
        console.error('Error parsing previousGuesses:', e);
      }
    }

    // Get all possible answers in all languages
    const allAnswers = [challenge.answer.toLowerCase()];
    translations.forEach(translation => {
      allAnswers.push(translation.answer.toLowerCase());
    });

    // Normalize previous guesses
    const normalizedPreviousGuesses = previousGuesses.map((guess: string) => 
      guess.trim().toLowerCase()
    );
    
    // Filter out alternatives that:
    // 1. Have already been guessed
    // 2. Are answers in any language
    let availableAlternatives = alternatives.filter(alt => {
      const normalizedAlt = alt.trim().toLowerCase();
      return !normalizedPreviousGuesses.includes(normalizedAlt) &&
             !allAnswers.includes(normalizedAlt);
    });
    
    // Ensure we only return 4 alternatives (plus the correct answer)
    availableAlternatives = availableAlternatives.slice(0, 4);
    
    // Create the final five options (the correct answer + 4 alternatives)
    const options = [
      answer,
      ...availableAlternatives
    ];
    
    // Shuffle the options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    return NextResponse.json({
      options: shuffledOptions
    });
  } catch (error) {
    console.error('Error fetching Final Five options:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}