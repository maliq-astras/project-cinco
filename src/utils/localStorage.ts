import { getEasternDateString } from './easternTime';

// Storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'factfive_game_state',
  STREAK_DATA: 'factfive_streak_data',
  PREFERENCES: 'factfive_preferences',
  LAST_CHALLENGE_DATE: 'factfive_last_challenge_date',
  TIMER_DATA: 'factfive_timer_data'
} as const;

// Type-safe localStorage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to parse localStorage item ${key}:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to save to localStorage ${key}:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage item ${key}:`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};

// Check if stored game data is for current challenge
export const isGameDataCurrent = (): boolean => {
  const storedDate = storage.get(STORAGE_KEYS.LAST_CHALLENGE_DATE, '');
  const currentDate = getEasternDateString();
  return storedDate === currentDate;
};

// Clear game data when new challenge is available
// NOTE: This function is deprecated in favor of the centralized daily reset manager
// It's kept for backward compatibility but should not be used for new reset logic
export const clearStaleGameData = (): void => {
  console.log('⚠️  DEPRECATED: clearStaleGameData() called - use dailyResetManager instead');

  if (!isGameDataCurrent()) {
    console.log('🗑️ LEGACY RESET: Clearing stale data using old system');

    // Clear legacy manual localStorage keys only
    storage.remove(STORAGE_KEYS.GAME_STATE);
    storage.remove('factfive_timer_data');
    storage.remove(STORAGE_KEYS.STREAK_DATA);
    storage.remove(STORAGE_KEYS.TIMER_DATA);

    // Update challenge date tracker
    updateChallengeDate();

    console.log('✅ LEGACY RESET COMPLETE');
  }
};

// Update challenge date tracker
export const updateChallengeDate = (): void => {
  const currentDate = getEasternDateString();
  storage.set(STORAGE_KEYS.LAST_CHALLENGE_DATE, currentDate);
};