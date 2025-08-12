// src/middleware/requestSize.ts
import { NextResponse } from 'next/server';

export async function validateRequestSize(
  request: Request,
  maxSizeBytes: number = 10 * 1024 // Default 10KB
): Promise<NextResponse | null> {
  const contentLength = request.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength) > maxSizeBytes) {
    return NextResponse.json(
      { error: 'Request payload too large' },
      { status: 413 }
    );
  }

  return null; // Size is acceptable
}

// Predefined size limits
export const SIZE_LIMITS = {
  SMALL: 1024, // 1KB - for simple requests
  MEDIUM: 10 * 1024, // 10KB - for game data
  LARGE: 100 * 1024 // 100KB - for file uploads
};
