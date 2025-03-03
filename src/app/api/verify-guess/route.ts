import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';

export async function POST(request: Request) {
  try {
    const { challengeId, guess } = await request.json();
    
    if (!challengeId || !guess) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Find the challenge to check the answer
    const challenge = await db.collection<Challenge>('challenges').findOne(
      { challengeId }
    );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }
    
    // Normalize strings for comparison (lowercase, trim whitespace)
    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedAnswer = challenge.answer.trim().toLowerCase();
    
    // Check if the guess is correct
    const isCorrect = normalizedGuess === normalizedAnswer;
    
    return NextResponse.json({
      correct: isCorrect,
      // We never reveal the answer until the game is over
      feedback: isCorrect 
        ? 'Correct! Well done!' 
        : 'Incorrect. Try again!',
    });
    
  } catch (error) {
    console.error('Error verifying guess:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}