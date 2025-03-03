import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { challengeId, guess } = await request.json();
    
    if (!challengeId || !guess) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Find the challenge with the given ID
    const challenge = await db.collection('challenges').findOne(
      { challengeId },
      { projection: { answer: 1 } } // Only get the answer
    );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' }, 
        { status: 404 }
      );
    }
    
    // Compare the guess with the answer (case insensitive)
    const isCorrect = guess.toLowerCase() === challenge.answer.toLowerCase();
    
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