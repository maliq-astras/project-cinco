/**
 * Session ID utilities for rate limiting and user identification
 *
 * This replaces IP-based rate limiting with session-based rate limiting
 * to prevent multiple users from sharing the same rate limit bucket.
 */

/**
 * Generate a cryptographically secure random session ID
 */
function generateSessionId(): string {
  // Use crypto API if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for older environments
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get or create a session ID for the current user
 * Persists across browser sessions but not across devices/browsers
 */
export function getSessionId(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: generate temporary session ID
    return generateSessionId();
  }

  try {
    // Try to get existing session ID from localStorage
    let sessionId = localStorage.getItem('fact5_session_id');

    if (!sessionId || sessionId.length < 10) {
      // Generate new session ID if none exists or invalid
      sessionId = generateSessionId();
      localStorage.setItem('fact5_session_id', sessionId);
    }

    return sessionId;
  } catch (error) {
    // localStorage might be disabled or throw errors
    console.warn('Could not access localStorage for session ID:', error);

    // Try sessionStorage as fallback
    try {
      let sessionId = sessionStorage.getItem('fact5_session_id');
      if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('fact5_session_id', sessionId);
      }
      return sessionId;
    } catch (sessionError) {
      // Both storage methods failed - generate temporary ID
      console.warn('Could not access sessionStorage either:', sessionError);
      return generateSessionId();
    }
  }
}

/**
 * Generate a fallback identifier from browser fingerprint
 * Used as backup when session storage isn't available
 */
export function generateFingerprintId(): string {
  if (typeof window === 'undefined') {
    return 'server_' + Math.random().toString(36).substr(2, 9);
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.platform
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return 'fp_' + Math.abs(hash).toString(36);
}

/**
 * Get the best available user identifier for rate limiting
 * Priority: Session ID > Fingerprint > Random ID
 */
export function getUserIdentifier(): string {
  try {
    return getSessionId();
  } catch (error) {
    console.warn('Session ID failed, falling back to fingerprint:', error);
    try {
      return generateFingerprintId();
    } catch (fpError) {
      console.warn('Fingerprint failed, using random ID:', fpError);
      return 'temp_' + Math.random().toString(36).substr(2, 9);
    }
  }
}