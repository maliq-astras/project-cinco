export const TIMEOUTS = {
  // Debounce delays
  RESIZE_DEBOUNCE: 16, // 60fps
  INPUT_DEBOUNCE: 300,
  SEARCH_DEBOUNCE: 500,

  // Animation durations (in milliseconds)
  FAST_ANIMATION: 200,
  NORMAL_ANIMATION: 300,
  SLOW_ANIMATION: 500,

  // Loading and API timeouts
  API_TIMEOUT: 10000, // 10 seconds
  LOADING_MIN_DURATION: 1000, // Minimum loading time for UX
  
  // User interaction delays
  HOVER_DELAY: 100,
  TOOLTIP_DELAY: 500,
  DOUBLE_CLICK_TIMEOUT: 300
} as const;