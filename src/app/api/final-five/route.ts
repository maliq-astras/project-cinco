// src/app/api/final-five/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge, UserProgress } from '@/types';

export async function POST(request: Request) {
  try {
    const { challengeId, previousGuesses = [] } = await request.json();
    
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
    
    // Normalize previous guesses
    const normalizedPreviousGuesses = previousGuesses.map((guess: string) => 
      guess.trim().toLowerCase()
    );
    
    // Filter out alternatives that have already been guessed
    let availableAlternatives = challenge.alternatives.filter(alt => 
      !normalizedPreviousGuesses.includes(alt.trim().toLowerCase())
    );
    
    // If we don't have enough alternatives, we'll just use what we have
    // In production, you might want to generate more alternatives
    
    // Ensure we only return 4 alternatives (plus the correct answer)
    availableAlternatives = availableAlternatives.slice(0, 4);
    
    // Create the Final 5 options with the correct answer and 4 alternatives
    const finalFiveOptions = [
      challenge.answer,
      ...availableAlternatives
    ];
    
    // Shuffle the options
    const shuffledOptions = finalFiveOptions.sort(() => Math.random() - 0.5);
    
    return NextResponse.json({
      options: shuffledOptions,
      // Mark which one is correct for easy testing - remove in production!
      // correctAnswer: challenge.answer 
    });
    
  } catch (error) {
    console.error('Error generating Final 5:', error);
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
    
    if (!challengeId) {
      return NextResponse.json(
        { error: 'Missing challenge ID' }, 
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get the challenge with the answer and alternatives
    const challenge = await db.collection('challenges').findOne(
      { challengeId },
      { projection: { answer: 1, alternatives: 1 } }
    );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }
    
    // Create the final five options (the correct answer + 4 alternatives)
    const options = [
      challenge.answer,
      ...challenge.alternatives.slice(0, 4)
    ];
    
    // Shuffle the options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    return NextResponse.json({ options: shuffledOptions });
  } catch (error) {
    console.error('Error getting final five options:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}