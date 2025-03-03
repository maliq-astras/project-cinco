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