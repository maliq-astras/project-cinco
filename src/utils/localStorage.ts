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
export const clearStaleGameData = (): void => {
  if (!isGameDataCurrent()) {
    console.log('🗑️ CLEARING STALE GAME DATA - New day detected');

    // STEP 1: Extract preserve-worthy data from Zustand persist
    const zustandardData = (() => {
      try {
        const rawData = localStorage.getItem('cinco-game-storage');
        if (!rawData) return {};
        const parsed = JSON.parse(rawData);
        return parsed.state || {};
      } catch (error) {
        console.warn('Failed to parse Zustand persisted data:', error);
        return {};
      }
    })();

    console.log('💾 PRESERVING USER DATA:', {
      currentStreak: zustandardData.currentStreak,
      weeklyCompletions: zustandardData.weeklyCompletions,
      lastCompletionDate: zustandardData.lastCompletionDate,
      isHardModeEnabled: zustandardData.isHardModeEnabled,
      isAutocompleteEnabled: zustandardData.isAutocompleteEnabled
    });

    // Extract ONLY user settings and achievements
    const preservedData = {
      isHardModeEnabled: zustandardData.isHardModeEnabled || false,
      isAutocompleteEnabled: zustandardData.isAutocompleteEnabled || false,
      currentStreak: zustandardData.currentStreak || 0,
      weeklyCompletions: zustandardData.weeklyCompletions || [null, null, null, null, null, null, null],
      lastCompletionDate: zustandardData.lastCompletionDate || null
    };

    // STEP 2: Clear EVERYTHING - both old and new localStorage systems
    console.log('🧹 CLEARING ALL GAME DATA');

    // Clear Zustand persist completely
    localStorage.removeItem('cinco-game-storage');

    // Clear old manual localStorage keys
    storage.remove(STORAGE_KEYS.GAME_STATE);
    storage.remove(STORAGE_KEYS.LAST_CHALLENGE_DATE);
    storage.remove('factfive_timer_data');
    storage.remove(STORAGE_KEYS.STREAK_DATA); // Clear legacy streak data too
    storage.remove(STORAGE_KEYS.TIMER_DATA); // Clear legacy timer data too

    // STEP 3: Restore ONLY preserved user data to Zustand persist
    console.log('♻️ RESTORING PRESERVED USER DATA');

    const restoredZustandardData = {
      state: preservedData,
      version: 2 // Match current Zustand persist version
    };

    localStorage.setItem('cinco-game-storage', JSON.stringify(restoredZustandardData));

    console.log('✅ STALE DATA CLEARING COMPLETE - Fresh start with preserved user data');
  }
};

// Update challenge date tracker
export const updateChallengeDate = (): void => {
  const currentDate = getEasternDateString();
  storage.set(STORAGE_KEYS.LAST_CHALLENGE_DATE, currentDate);
};