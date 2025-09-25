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

/**
 * Get the best available user identifier for rate limiting
 * Priority: Session ID > IP + User-Agent hash > IP > unknown
 */
function getUserIdentifier(request: Request): string {
  // First priority: Session ID from headers
  const sessionId = request.headers.get('x-session-id');
  if (sessionId && sessionId.length > 5 && !sessionId.includes('temp_')) {
    return `session_${sessionId}`;
  }

  // Second priority: IP + User-Agent hash (for users without session storage)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : null;
  const userAgent = request.headers.get('user-agent');

  if (ip && userAgent) {
    // Create a simple hash of IP + User-Agent for better uniqueness
    let hash = 0;
    const combined = ip + '|' + userAgent;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `ip_hash_${Math.abs(hash).toString(36)}`;
  }

  // Third priority: IP only
  if (ip && ip !== '127.0.0.1' && ip !== 'localhost') {
    return `ip_${ip}`;
  }

  // Last resort: unknown bucket (this should be rare now)
  return 'unknown';
}

export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): NextResponse | null {
  // Skip rate limiting in development (temporarily enabled for testing)
  // if (process.env.NODE_ENV === 'development') {
  //   return null;
  // }

  // Get the best available user identifier
  const identifier = getUserIdentifier(request);

  if (rateLimiter.isRateLimited(identifier, config)) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(config.windowMs / 1000) // Seconds until reset
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
          'X-RateLimit-Reset': (Date.now() + config.windowMs).toString()
        }
      }
    );
  }

  return null; // Not rate limited
}

// Sophisticated rate limit configs - generous to users, strict on abuse
export const RATE_LIMITS = {
  // Game guesses: Allow normal gameplay, block rapid-fire abuse
  GUESS: { 
    windowMs: 5 * 60 * 1000, // 5 minutes - generous for normal gameplay
    maxRequests: process.env.NODE_ENV === 'development' ? 100 : 50, // 50 guesses per 5 min - plenty for gameplay
    burstLimit: process.env.NODE_ENV === 'development' ? 50 : 15, // 15 rapid guesses in 30 seconds - allow retry logic
    burstWindowMs: 30 * 1000 // 30 second burst window
  },
  
  // Final Five: Allow multiple attempts, block automation
  // TEMPORARY: Increased limits to handle multiple users in shared IP buckets
  FINAL_FIVE: {
    windowMs: 5 * 60 * 1000, // 5 minutes (Final Five session duration)
    maxRequests: process.env.NODE_ENV === 'development' ? 100 : 50, // 50 per 5 min - accommodate multiple users
    burstLimit: process.env.NODE_ENV === 'development' ? 30 : 15, // 15 rapid requests - handle retry logic + multiple users
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
