import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface FeedbackData {
  rating: number;
  difficulty: number;
  favoriteCategory: string[];
  leastFavoriteCategory: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, difficulty, favoriteCategory, leastFavoriteCategory }: FeedbackData = body;

    // Validation
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid rating (1-5) is required' }, { status: 400 });
    }

    if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
      return NextResponse.json({ error: 'Valid difficulty rating (1-5) is required' }, { status: 400 });
    }

    if (!Array.isArray(favoriteCategory) || favoriteCategory.length === 0) {
      return NextResponse.json({ error: 'At least one favorite category is required' }, { status: 400 });
    }

    if (!Array.isArray(leastFavoriteCategory) || leastFavoriteCategory.length === 0) {
      return NextResponse.json({ error: 'At least one least favorite category is required' }, { status: 400 });
    }

    // Helper function to get star rating display
    const getStarRating = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    // Helper function to get difficulty text
    const getDifficultyText = (difficulty: number) => {
      const levels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
      return levels[difficulty - 1] || 'Unknown';
    };

    // Create email content
    const emailContent = `
      <h2>New Feedback Submitted</h2>

      <h3>Overall Rating:</h3>
      <p style="font-size: 24px; color: #ffbf00;">${getStarRating(rating)}</p>
      <p><strong>${rating}/5 stars</strong></p>

      <h3>Difficulty Rating:</h3>
      <p style="font-size: 24px; color: #ffbf00;">${getStarRating(difficulty)}</p>
      <p><strong>${getDifficultyText(difficulty)} (${difficulty}/5)</strong></p>

      <h3>Favorite Categories:</h3>
      <ul>
        ${favoriteCategory.map(category => `<li>${category}</li>`).join('')}
      </ul>

      <h3>Least Favorite Categories:</h3>
      <ul>
        ${leastFavoriteCategory.map(category => `<li>${category}</li>`).join('')}
      </ul>

      <hr>
      <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email
    const emailData = await resend.emails.send({
      from: 'User Feedback <noreply@feedback>', // Using verified feedback domain
      to: [process.env.FEEDBACK_EMAIL || 'your-email@gmail.com'], // Replace with your email
      subject: `User Feedback: ${rating}★ Rating - ${getDifficultyText(difficulty)} Difficulty`,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      emailId: emailData.data?.id
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({
      error: 'Failed to submit feedback. Please try again.'
    }, {
      status: 500
    });
  }
}