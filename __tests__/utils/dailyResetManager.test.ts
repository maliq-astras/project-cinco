/**
 * Tests for Daily Reset Manager
 * Professional test suite for RED-003 daily reset functionality
 */

import { performDailyReset, shouldMigrateUserData, migrateLegacyUserData } from '../../src/utils/dailyResetManager';
import { storage, STORAGE_KEYS } from '../../src/utils/localStorage';
import * as easternTime from '../../src/utils/easternTime';
import type { GameStore } from '../../src/types/index';

// Mock dependencies
jest.mock('../../src/utils/localStorage', () => ({
  storage: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn()
  },
  STORAGE_KEYS: {
    LAST_CHALLENGE_DATE: 'lastChallengeDate',
    STREAK_DATA: 'streakData',
    GAME_STATE: 'gameState',
    TIMER_DATA: 'timerData'
  }
}));

jest.mock('../../src/utils/easternTime', () => ({
  getEasternDateString: jest.fn()
}));

describe('Daily Reset Manager', () => {
  const mockStorage = storage as jest.Mocked<typeof storage>;
  const mockEasternTime = easternTime as jest.Mocked<typeof easternTime>;

  const mockCurrentState = {
      // Game state that should be cleared
      gameState: {
        loading: false,
        error: null,
        challenge: { id: 'test-challenge', category: 'science' } as any,
        revealedFacts: [1, 2],
        guesses: [{ guess: 'test guess', timestamp: Date.now() }],
        isGameOver: true,
        finalFiveOptions: ['a', 'b', 'c', 'd', 'e']
      },
      todayGameData: { completionDate: '2025-09-21' } as any,
      todayChallenge: { id: 'old-challenge' } as any,
      hasSeenClue: true,
      canRevealNewClue: false,
      canMakeGuess: false,
      lastRevealedFactIndex: 1,
      hasMadeGuess: true,
      isMainGameSectionOver: true,
      isPendingFinalFiveTransition: false,
      isVictoryAnimationActive: true,
      victoryAnimationStep: null,
      gameOutcome: null,
      showGameMessage: false,
      timeRemaining: 150,
      isTimerActive: true,
      timerStartTime: null,
      shouldPauseTimer: false,
      isFinalFiveCompleted: false,
      showFinalFiveTransition: false,
      finalFiveTransitionReason: null,
      finalFiveTimeRemaining: 30,
      isFinalFiveActive: false,
      viewingFact: null,
      cardSourcePosition: null,
      isDrawingFromStack: false,
      isReturningToStack: false,
      isCardAnimatingOut: false,
      shouldFocusInput: false,
      hoveredFact: null,
      isProcessingGuess: false,
      hasUserInput: false,
      isSettingsPanelOpen: false,
      isTutorialOpen: false,
      isResumeModalOpen: false,

      // User data that should persist
      currentStreak: 5,
      weeklyCompletions: ['completed', 'completed', 'failed', null, null, null, null] as const,
      lastCompletionDate: '2025-09-21',
      isHardModeEnabled: true,
      isAutocompleteEnabled: false,
      scaleFactor: 1.2
    } as unknown as GameStore;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('performDailyReset', () => {
    it('should return empty object when it is not a new day', () => {
      // Arrange: Same date stored and current
      mockStorage.get.mockReturnValue('2025-09-22');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      // Act
      const result = performDailyReset(mockCurrentState);

      // Assert
      expect(result).toEqual({});
      expect(mockStorage.set).not.toHaveBeenCalled();
    });

    it('should perform reset when it is a new day', () => {
      // Arrange: Different dates (stored vs current)
      mockStorage.get.mockReturnValue('2025-09-21'); // Yesterday
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22'); // Today

      // Act
      const result = performDailyReset(mockCurrentState);

      // Assert
      expect(result).toBeDefined();
      expect(mockStorage.set).toHaveBeenCalledWith('lastChallengeDate', '2025-09-22');
    });

    it('should preserve user data during reset', () => {
      // Arrange
      mockStorage.get.mockReturnValue('2025-09-21');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      // Act
      const result = performDailyReset(mockCurrentState);

      // Assert: User data is preserved
      expect(result.currentStreak).toBe(5);
      expect(result.weeklyCompletions).toEqual(['completed', 'completed', 'failed', null, null, null, null]);
      expect(result.lastCompletionDate).toBe('2025-09-21');
      expect(result.isHardModeEnabled).toBe(true);
      expect(result.isAutocompleteEnabled).toBe(false);
      expect(result.scaleFactor).toBe(1.2);
    });

    it('should clear game state during reset', () => {
      // Arrange
      mockStorage.get.mockReturnValue('2025-09-21');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      // Act
      const result = performDailyReset(mockCurrentState);

      // Assert: Game state is cleared to defaults
      expect(result.gameState?.challenge).toBe(null);
      expect(result.gameState?.revealedFacts).toEqual([]);
      expect(result.gameState?.guesses).toEqual([]);
      expect(result.gameState?.isGameOver).toBe(false);
      expect(result.todayGameData).toBe(null);
      expect(result.todayChallenge).toBe(null);
      expect(result.hasSeenClue).toBe(false);
      expect(result.canRevealNewClue).toBe(true);
      expect(result.isVictoryAnimationActive).toBe(false);
      expect(result.timeRemaining).toBe(300); // Reset to 5 minutes
      expect(result.isTimerActive).toBe(false);
      expect(result.hasSeenTodaysLoadingAnimation).toBe(false); // Reset daily
    });

    it('should reset loading animation state during daily reset', () => {
      // Arrange: State where user has seen loading animation
      const stateWithLoadingAnimationSeen = {
        ...mockCurrentState,
        hasSeenTodaysLoadingAnimation: true
      } as unknown as GameStore;

      mockStorage.get.mockReturnValue('2025-09-21');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      // Act
      const result = performDailyReset(stateWithLoadingAnimationSeen);

      // Assert: Loading animation state is reset
      expect(result.hasSeenTodaysLoadingAnimation).toBe(false);
    });

    it('should handle empty stored date gracefully', () => {
      // Arrange: No stored date (empty string)
      mockStorage.get.mockReturnValue('');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      // Act
      const result = performDailyReset(mockCurrentState);

      // Assert: Should trigger reset since empty != current date
      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should handle null user data gracefully', () => {
      // Arrange: State with missing user data
      const stateWithNulls = {
        ...mockCurrentState,
        currentStreak: undefined,
        weeklyCompletions: undefined,
        isHardModeEnabled: undefined
      } as unknown as GameStore;

      mockStorage.get.mockReturnValue('2025-09-21');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      // Act
      const result = performDailyReset(stateWithNulls);

      // Assert: Should provide defaults
      expect(result.currentStreak).toBe(0);
      expect(result.weeklyCompletions).toEqual([null, null, null, null, null, null, null]);
      expect(result.isHardModeEnabled).toBe(false);
    });
  });

  describe('shouldMigrateUserData', () => {
    it('should return true when legacy streak data exists', () => {
      mockStorage.get.mockImplementation((key) => {
        if (key === STORAGE_KEYS.STREAK_DATA) return { currentStreak: 3 };
        return null;
      });

      expect(shouldMigrateUserData()).toBe(true);
    });

    it('should return true when legacy game data exists', () => {
      mockStorage.get.mockImplementation((key) => {
        if (key === STORAGE_KEYS.GAME_STATE) return { someGameData: true };
        return null;
      });

      expect(shouldMigrateUserData()).toBe(true);
    });

    it('should return false when no legacy data exists', () => {
      mockStorage.get.mockReturnValue(null);

      expect(shouldMigrateUserData()).toBe(false);
    });
  });

  describe('migrateLegacyUserData', () => {
    it('should migrate legacy streak data correctly', () => {
      // Arrange
      const legacyStreakData = {
        currentStreak: 7,
        weeklyCompletions: ['completed', 'completed', 'completed', null, null, null, null],
        lastCompletionDate: '2025-09-20'
      };

      mockStorage.get.mockReturnValue(legacyStreakData);

      // Act
      const result = migrateLegacyUserData();

      // Assert
      expect(result).toEqual(legacyStreakData);
      expect(mockStorage.remove).toHaveBeenCalledWith(STORAGE_KEYS.STREAK_DATA);
      expect(mockStorage.remove).toHaveBeenCalledWith(STORAGE_KEYS.GAME_STATE);
      expect(mockStorage.remove).toHaveBeenCalledWith(STORAGE_KEYS.TIMER_DATA);
    });

    it('should provide defaults when no legacy data exists', () => {
      // Arrange
      mockStorage.get.mockReturnValue({
        currentStreak: 0,
        weeklyCompletions: [null, null, null, null, null, null, null],
        lastCompletionDate: null
      });

      // Act
      const result = migrateLegacyUserData();

      // Assert
      expect(result.currentStreak).toBe(0);
      expect(result.weeklyCompletions).toEqual([null, null, null, null, null, null, null]);
      expect(result.lastCompletionDate).toBe(null);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete daily reset flow', () => {
      // Arrange: Simulate transition from September 21 to 22
      mockStorage.get.mockReturnValue('2025-09-21');
      mockEasternTime.getEasternDateString.mockReturnValue('2025-09-22');

      const gameInProgress = {
        ...mockCurrentState,
        gameState: {
          ...mockCurrentState.gameState,
          challenge: { id: 'active-challenge' } as any,
          revealedFacts: [1, 2, 3],
          isGameOver: false
        },
        timeRemaining: 180,
        isTimerActive: true
      } as unknown as GameStore;

      // Act
      const result = performDailyReset(gameInProgress);

      // Assert: Complete reset with preserved user data
      expect(result.gameState?.challenge).toBe(null);
      expect(result.gameState?.revealedFacts).toEqual([]);
      expect(result.gameState?.isGameOver).toBe(false);
      expect(result.timeRemaining).toBe(300);
      expect(result.isTimerActive).toBe(false);
      expect(result.currentStreak).toBe(5); // Preserved
      expect(result.isHardModeEnabled).toBe(true); // Preserved
      expect(mockStorage.set).toHaveBeenCalledWith('lastChallengeDate', '2025-09-22');
    });
  });
});