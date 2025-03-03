import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/types';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's challenge but exclude the answer and alternatives
    const challenge = await db.collection<Challenge>('challenges')
      .findOne(
        { date: today }, 
        { projection: { answer: 0, alternatives: 0 } } // Exclude sensitive fields
      );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'No challenge found for today' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}