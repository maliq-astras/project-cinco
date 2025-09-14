export const TIMEOUTS = {
  // Debounce delays
  RESIZE_DEBOUNCE: 16, // 60fps
  INPUT_DEBOUNCE: 300,
  SEARCH_DEBOUNCE: 500,

  // Animation durations (in milliseconds)
  FAST_ANIMATION: 200,
  NORMAL_ANIMATION: 300,
  SLOW_ANIMATION: 500,

  // API Request Timeouts
  API_FAST: 8000,        // 8s - Final Five, quick operations
  API_STANDARD: 12000,   // 12s - Standard game operations  
  API_SLOW: 20000,       // 20s - Challenge fetching, heavy operations
  
  // Database Timeouts
  DB_QUERY: 10000,       // 10s - Standard DB queries
  DB_HEAVY_QUERY: 15000, // 15s - Complex queries (Final Five)
  
  // Loading UX
  LOADING_MIN_DURATION: 1500, // Minimum loading time for UX
  
  // User interaction delays
  HOVER_DELAY: 100,
  TOOLTIP_DELAY: 500,
  DOUBLE_CLICK_TIMEOUT: 300
} as const;

export const RETRY_CONFIG = {
  // Retry Attempts
  FAST: 2,      // Quick operations
  STANDARD: 3,  // Standard operations
  
  // Backoff Settings
  BASE_DELAY: 1000,    // 1s base for exponential backoff
  MAX_DELAY: 5000,     // 5s maximum backoff
} as const;