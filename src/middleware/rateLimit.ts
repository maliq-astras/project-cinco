// src/middleware/rateLimit.ts
import { NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  burstLimit?: number; // Optional: Max requests in short burst (30 seconds)
  burstWindowMs?: number; // Optional: Burst window duration
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private burstRequests: Map<string, { count: number; resetTime: number }> = new Map();

  isRateLimited(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    
    // Check burst limit first (catches rapid-fire attacks)
    if (config.burstLimit && config.burstWindowMs) {
      const burstKey = `${identifier}-burst`;
      const burstRecord = this.burstRequests.get(burstKey);
      
      if (!burstRecord || now > burstRecord.resetTime) {
        this.burstRequests.set(burstKey, {
          count: 1,
          resetTime: now + config.burstWindowMs
        });
      } else {
        if (burstRecord.count >= config.burstLimit) {
          return true; // Burst rate limited
        }
        burstRecord.count++;
      }
    }
    
    // Check regular rate limit
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return false;
    }

    if (record.count >= config.maxRequests) {
      return true; // Rate limited
    }

    // Increment count
    record.count++;
    return false;
  }

  cleanup() {
    const now = Date.now();
    // Clean up regular requests
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
    // Clean up burst requests
    for (const [key, record] of this.burstRequests.entries()) {
      if (now > record.resetTime) {
        this.burstRequests.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Cleanup old entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): NextResponse | null {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  // Use IP address as identifier (in production, consider user ID)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  
  if (rateLimiter.isRateLimited(ip, config)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null; // Not rate limited
}

// Sophisticated rate limit configs - generous to users, strict on abuse
export const RATE_LIMITS = {
  // Game guesses: Allow normal gameplay, block rapid-fire abuse
  GUESS: { 
    windowMs: 2 * 60 * 1000, // 2 minutes (shorter window catches abuse faster)
    maxRequests: process.env.NODE_ENV === 'development' ? 100 : 15, // 15 guesses per 2 min = plenty for gameplay
    burstLimit: process.env.NODE_ENV === 'development' ? 50 : 5, // Max 5 rapid guesses in 30 seconds
    burstWindowMs: 30 * 1000 // 30 second burst window
  },
  
  // Final Five: Allow multiple attempts, block automation
  FINAL_FIVE: { 
    windowMs: 5 * 60 * 1000, // 5 minutes (Final Five session duration)
    maxRequests: process.env.NODE_ENV === 'development' ? 50 : 12, // 12 per 5 min = multiple Final Five attempts
    burstLimit: process.env.NODE_ENV === 'development' ? 20 : 3, // Max 3 rapid Final Five requests in 30 seconds
    burstWindowMs: 30 * 1000 // 30 second burst window
  },
  
  // Daily challenge: Generous for users, catches scraping/DoS
  DAILY_CHALLENGE: { 
    windowMs: 10 * 60 * 1000, // 10 minutes (shorter window = faster abuse detection)
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 20, // 20 per 10 min = 120/hour (very generous)
    burstLimit: process.env.NODE_ENV === 'development' ? 100 : 8, // Max 8 rapid refreshes in 30 seconds (catches DoS/scraping)
    burstWindowMs: 30 * 1000 // 30 second burst window
  }
};
