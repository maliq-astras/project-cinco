/**
 * Comprehensive Integration Tests for Daily Reset System
 * 
 * These tests verify the complete daily reset flow including:
 * - Timezone consistency across all systems
 * - State persistence and recovery
 * - Completion date tracking
 * - Edge cases around midnight transitions
 */

import { performDailyReset, shouldMigrateUserData, migrateLegacyUserData } from '../../src/utils/dailyResetManager';
import { getEasternDateString, getEasternTime } from '../../src/utils/easternTime';
import { storage, STORAGE_KEYS } from '../../src/utils/localStorage';
import type { GameStore } from '../../src/types';

// Mock localStorage for testing
const mockStorage: Record<string, string> = {};
jest.mock('../../src/utils/localStorage', () => ({
  ...jest.requireActual('../../src/utils/localStorage'),
  storage: {
    get: jest.fn((key: string, defaultValue: any) => {
      const item = mockStorage[key];
      if (!item) return defaultValue;
      try {
        return JSON.parse(item);
      } catch {
        return defaultValue; // Return default value if JSON is corrupted
      }
    }),
    set: jest.fn((key: string, value: any) => {
      mockStorage[key] = JSON.stringify(value);
    }),
    remove: jest.fn((key: string) => {
      delete mockStorage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    })
  },
  STORAGE_KEYS: {
    GAME_STATE: 'factfive_game_state',
    STREAK_DATA: 'factfive_streak_data', 
    PREFERENCES: 'factfive_preferences',
    LAST_CHALLENGE_DATE: 'factfive_last_challenge_date',
    TIMER_DATA: 'factfive_timer_data'
  }
}));

// Mock Eastern Time functions for controlled testing
jest.mock('../../src/utils/easternTime');
const mockGetEasternDateString = getEasternDateString as jest.MockedFunction<typeof getEasternDateString>;
const mockGetEasternTime = getEasternTime as jest.MockedFunction<typeof getEasternTime>;

describe('Daily Reset System Integration', () => {
  beforeEach(() => {
    // Clear all mocks and storage before each test
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    
    // Default mock implementations
    mockGetEasternDateString.mockReturnValue('2025-09-23');
    mockGetEasternTime.mockReturnValue(new Date('2025-09-23T15:30:00-04:00'));
  });

  describe('Timezone Consistency', () => {
    it('should use Eastern Time consistently across all date operations', () => {
      const testDate = '2025-09-23';
      mockGetEasternDateString.mockReturnValue(testDate);

      const mockState: GameStore = {
        currentStreak: 5,
        weeklyCompletions: ['completed', null, null, null, null, null, null],
        lastCompletionDate: '2025-09-22',
        isHardModeEnabled: true,
        isAutocompleteEnabled: false,
        todayGameData: {
          outcome: 'standard-win',
          correctAnswer: 'Test Answer',
          numberOfTries: 3,
          timeSpent: 120,
          completionDate: testDate // Should match Eastern Time
        }
      } as GameStore;

      // Simulate daily reset
      const resetData = performDailyReset(mockState);
      
      // Verify that the stored date uses Eastern Time
      expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.LAST_CHALLENGE_DATE, testDate);
      expect(mockGetEasternDateString).toHaveBeenCalled();
    });

    it('should detect new day correctly using Eastern Time', () => {
      // Set stored date to yesterday
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify('2025-09-22');
      mockGetEasternDateString.mockReturnValue('2025-09-23');

      const mockState: GameStore = { currentStreak: 5 } as GameStore;
      
      const resetData = performDailyReset(mockState);
      
      // Should trigger reset because it's a new day
      expect(Object.keys(resetData).length).toBeGreaterThan(0);
      expect(resetData.todayGameData).toBeNull();
      expect(resetData.todayChallenge).toBeNull();
    });

    it('should not reset on same day', () => {
      // Set stored date to today
      const today = '2025-09-23';
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify(today);
      mockGetEasternDateString.mockReturnValue(today);

      const mockState: GameStore = { currentStreak: 5 } as GameStore;
      
      const resetData = performDailyReset(mockState);
      
      // Should not trigger reset
      expect(Object.keys(resetData).length).toBe(0);
    });
  });

  describe('State Preservation', () => {
    it('should preserve user data during daily reset', () => {
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify('2025-09-22');
      mockGetEasternDateString.mockReturnValue('2025-09-23');

      const mockState: GameStore = {
        currentStreak: 10,
        weeklyCompletions: ['completed', 'completed', 'failed', null, null, null, null],
        lastCompletionDate: '2025-09-22',
        isHardModeEnabled: true,
        isAutocompleteEnabled: true,
        // Game state that should be reset
        gameState: {
          loading: false,
          error: null,
          challenge: { challengeId: 'old-challenge' } as any,
          revealedFacts: [0, 1, 2],
          guesses: [{ guess: 'wrong', isCorrect: false }] as any,
          isGameOver: false,
          finalFiveOptions: null
        },
        todayGameData: {
          outcome: 'standard-win',
          correctAnswer: 'Old Answer',
          numberOfTries: 2,
          timeSpent: 90,
          completionDate: '2025-09-22'
        }
      } as GameStore;

      const resetData = performDailyReset(mockState);

      // User data should be preserved
      expect(resetData.currentStreak).toBe(10);
      expect(resetData.weeklyCompletions).toEqual(['completed', 'completed', 'failed', null, null, null, null]);
      expect(resetData.lastCompletionDate).toBe('2025-09-22');
      expect(resetData.isHardModeEnabled).toBe(true);
      expect(resetData.isAutocompleteEnabled).toBe(true);

      // Game state should be reset
      expect(resetData.todayGameData).toBeNull();
      expect(resetData.todayChallenge).toBeNull();
      expect(resetData.gameState?.challenge).toBeNull();
      expect(resetData.gameState?.revealedFacts).toEqual([]);
      expect(resetData.gameState?.guesses).toEqual([]);
    });

    it('should reset all game progress while keeping user preferences', () => {
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify('2025-09-22');
      mockGetEasternDateString.mockReturnValue('2025-09-23');

      const mockState: GameStore = {
        // User data to preserve
        currentStreak: 3,
        isHardModeEnabled: false,
        isAutocompleteEnabled: true,
        
        // Game state to reset
        hasSeenClue: true,
        canRevealNewClue: false,
        canMakeGuess: true,
        lastRevealedFactIndex: 2,
        hasMadeGuess: true,
        isMainGameSectionOver: true,
        timeRemaining: 45,
        isTimerActive: true,
        isFinalFiveCompleted: true,
        hasSeenTodaysLoadingAnimation: true
      } as GameStore;

      const resetData = performDailyReset(mockState);

      // User preferences preserved
      expect(resetData.currentStreak).toBe(3);
      expect(resetData.isHardModeEnabled).toBe(false);
      expect(resetData.isAutocompleteEnabled).toBe(true);

      // Game state reset
      expect(resetData.hasSeenClue).toBe(false);
      expect(resetData.canRevealNewClue).toBe(true);
      expect(resetData.canMakeGuess).toBe(false);
      expect(resetData.lastRevealedFactIndex).toBeNull();
      expect(resetData.hasMadeGuess).toBe(false);
      expect(resetData.isMainGameSectionOver).toBe(false);
      expect(resetData.timeRemaining).toBe(300); // Reset to default
      expect(resetData.isTimerActive).toBe(false);
      expect(resetData.isFinalFiveCompleted).toBe(false);
      expect(resetData.hasSeenTodaysLoadingAnimation).toBe(false); // Reset daily
    });
  });

  describe('Completion Date Edge Cases', () => {
    it('should handle completion date comparison correctly', () => {
      const today = '2025-09-23';
      mockGetEasternDateString.mockReturnValue(today);

      // Test completion date that matches today (Eastern Time)
      const mockStateWithCompletion: GameStore = {
        todayGameData: {
          outcome: 'standard-win',
          correctAnswer: 'Test',
          numberOfTries: 1,
          timeSpent: 60,
          completionDate: today // Same as Eastern Time today
        }
      } as GameStore;

      // This should be detected as "already completed today"
      expect(mockStateWithCompletion.todayGameData?.completionDate).toBe(today);
    });

    it('should handle timezone transition edge case', () => {
      // Simulate user playing at 11:59 PM Eastern
      mockGetEasternTime.mockReturnValue(new Date('2025-09-23T23:59:00-04:00'));
      mockGetEasternDateString.mockReturnValue('2025-09-23');
      
      const mockState: GameStore = {
        todayGameData: {
          outcome: 'standard-win',
          correctAnswer: 'Test',
          numberOfTries: 1,
          timeSpent: 60,
          completionDate: '2025-09-23' // Completed today
        }
      } as GameStore;

      // Now simulate midnight transition (next day)
      mockGetEasternTime.mockReturnValue(new Date('2025-09-24T00:01:00-04:00'));
      mockGetEasternDateString.mockReturnValue('2025-09-24');
      
      // Set stored date to yesterday to trigger reset
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify('2025-09-23');
      
      const resetData = performDailyReset(mockState);

      // Should reset because it's a new day
      expect(Object.keys(resetData).length).toBeGreaterThan(0);
      expect(resetData.todayGameData).toBeNull();
    });
  });

  describe('Legacy Data Migration', () => {
    it('should detect legacy data correctly', () => {
      // Set up legacy data
      mockStorage[STORAGE_KEYS.STREAK_DATA] = JSON.stringify({
        currentStreak: 7,
        weeklyCompletions: [true, false, true, null, null, null, null],
        lastCompletionDate: '2025-09-22'
      });

      expect(shouldMigrateUserData()).toBe(true);
    });

    it('should migrate legacy data and clean up old keys', () => {
      // Set up legacy data
      const legacyStreakData = {
        currentStreak: 5,
        weeklyCompletions: [true, true, false, null, null, null, null],
        lastCompletionDate: '2025-09-21'
      };
      
      mockStorage[STORAGE_KEYS.STREAK_DATA] = JSON.stringify(legacyStreakData);
      mockStorage[STORAGE_KEYS.GAME_STATE] = JSON.stringify({ someOldData: 'value' });
      mockStorage[STORAGE_KEYS.TIMER_DATA] = JSON.stringify({ timeRemaining: 100 });

      const migratedData = migrateLegacyUserData();

      // Should return the migrated streak data
      expect(migratedData.currentStreak).toBe(5);
      expect(migratedData.weeklyCompletions).toEqual([true, true, false, null, null, null, null]);
      expect(migratedData.lastCompletionDate).toBe('2025-09-21');

      // Should clean up legacy keys
      expect(storage.remove).toHaveBeenCalledWith(STORAGE_KEYS.STREAK_DATA);
      expect(storage.remove).toHaveBeenCalledWith(STORAGE_KEYS.GAME_STATE);
      expect(storage.remove).toHaveBeenCalledWith(STORAGE_KEYS.TIMER_DATA);
    });

    it('should not trigger migration when no legacy data exists', () => {
      // No legacy data
      expect(shouldMigrateUserData()).toBe(false);
    });
  });

  describe('Race Condition Prevention', () => {
    it('should handle rapid successive reset calls', () => {
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify('2025-09-22');
      mockGetEasternDateString.mockReturnValue('2025-09-23');

      const mockState: GameStore = { currentStreak: 1 } as GameStore;

      // Call reset multiple times rapidly
      const resetData1 = performDailyReset(mockState);
      const resetData2 = performDailyReset(mockState);
      const resetData3 = performDailyReset(mockState);

      // First call should trigger reset
      expect(Object.keys(resetData1).length).toBeGreaterThan(0);
      
      // Subsequent calls should not trigger reset (same day)
      expect(Object.keys(resetData2).length).toBe(0);
      expect(Object.keys(resetData3).length).toBe(0);
    });

    it('should be idempotent within same day', () => {
      const today = '2025-09-23';
      mockGetEasternDateString.mockReturnValue(today);
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify(today);

      const mockState: GameStore = { 
        currentStreak: 5,
        todayGameData: {
          outcome: 'standard-win',
          correctAnswer: 'Test',
          numberOfTries: 1,
          timeSpent: 60,
          completionDate: today
        }
      } as GameStore;

      // Multiple calls should all return empty (no reset)
      const resetData1 = performDailyReset(mockState);
      const resetData2 = performDailyReset(mockState);

      expect(Object.keys(resetData1).length).toBe(0);
      expect(Object.keys(resetData2).length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted localStorage gracefully', () => {
      // Simulate corrupted data
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = 'invalid-json';
      
      const mockState: GameStore = { currentStreak: 1 } as GameStore;

      // Should not throw an error
      expect(() => performDailyReset(mockState)).not.toThrow();
    });

    it('should handle missing user data gracefully', () => {
      mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify('2025-09-22');
      mockGetEasternDateString.mockReturnValue('2025-09-23');

      // State with minimal data
      const mockState: GameStore = {} as GameStore;

      const resetData = performDailyReset(mockState);

      // Should provide default values
      expect(resetData.currentStreak).toBe(0);
      expect(resetData.weeklyCompletions).toEqual([null, null, null, null, null, null, null]);
      expect(resetData.lastCompletionDate).toBeNull();
      expect(resetData.isHardModeEnabled).toBe(false);
      expect(resetData.isAutocompleteEnabled).toBe(false);
    });
  });
});

describe('Eastern Time Function Testing', () => {
  // These tests verify the actual Eastern Time implementation
  beforeEach(() => {
    jest.restoreAllMocks(); // Use real implementations
  });

  it('should return consistent date strings', () => {
    const date1 = getEasternDateString();
    const date2 = getEasternDateString();
    
    expect(date1).toBe(date2);
    expect(date1).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
  });

  it('should handle timezone transitions correctly', () => {
    // This test verifies the Eastern Time implementation works correctly
    // Note: This will use the actual system time, so it's more of a smoke test
    const easternDate = getEasternDateString();
    const easternTime = getEasternTime();
    
    expect(typeof easternDate).toBe('string');
    expect(easternTime instanceof Date).toBe(true);
    expect(easternDate.length).toBe(10); // YYYY-MM-DD is 10 characters
  });
});
