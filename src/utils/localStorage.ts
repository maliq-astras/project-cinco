import { getEasternDateString } from './easternTime';

// Storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'factfive_game_state',
  STREAK_DATA: 'factfive_streak_data',
  PREFERENCES: 'factfive_preferences',
  LAST_CHALLENGE_DATE: 'factfive_last_challenge_date',
  TIMER_DATA: 'factfive_timer_data',
  WELCOME_SEEN: 'factfive_welcome_seen'
} as const;

// Type-safe localStorage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Handle string values that might be double-encoded
      if (typeof defaultValue === 'string') {
        // For string defaults, try to parse but fall back to raw value
        try {
          const parsed = JSON.parse(item);
          return (typeof parsed === 'string' ? parsed : item) as T;
        } catch {
          return item as T;
        }
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Failed to parse localStorage item ${key}:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      // Handle string values directly to avoid double JSON encoding
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, stringValue);
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

// REMOVED: clearStaleGameData() - deprecated function eliminated
// All daily reset logic is now handled by dailyResetManager.ts
// This function was causing potential conflicts with the new centralized system

// Update challenge date tracker
export const updateChallengeDate = (): void => {
  const currentDate = getEasternDateString();
  storage.set(STORAGE_KEYS.LAST_CHALLENGE_DATE, currentDate);
};