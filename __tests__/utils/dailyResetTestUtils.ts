/**
 * Test Utilities for Daily Reset System
 * 
 * Helper functions to simulate different daily reset scenarios without waiting 24 hours
 */

import { getEasternDateString, getEasternTime } from '../../src/utils/easternTime';
import { storage, STORAGE_KEYS } from '../../src/utils/localStorage';
import type { GameStore } from '../../src/types';

// Mock storage for testing
export const createMockStorage = () => {
  const mockStorage: Record<string, string> = {};
  
  return {
    storage: mockStorage,
    mockStorageImplementation: {
      get: jest.fn((key: string, defaultValue: any) => {
        const item = mockStorage[key];
        return item ? JSON.parse(item) : defaultValue;
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
    }
  };
};

/**
 * Simulate a specific Eastern Time date for testing
 */
export const mockEasternDate = (dateString: string) => {
  const mockGetEasternDateString = getEasternDateString as jest.MockedFunction<typeof getEasternDateString>;
  const mockGetEasternTime = getEasternTime as jest.MockedFunction<typeof getEasternTime>;
  
  mockGetEasternDateString.mockReturnValue(dateString);
  
  // Create a corresponding Date object for the mocked date
  const [year, month, day] = dateString.split('-').map(Number);
  const mockDate = new Date(year, month - 1, day, 12, 0, 0); // Noon Eastern
  mockGetEasternTime.mockReturnValue(mockDate);
};

/**
 * Create a mock game state with specific properties
 */
export const createMockGameState = (overrides: Partial<GameStore> = {}): GameStore => {
  const defaultState = {
    // Core game state
    gameState: {
      loading: false,
      error: null,
      challenge: null,
      revealedFacts: [],
      guesses: [],
      isGameOver: false,
      finalFiveOptions: null
    },
    hasSeenClue: false,
    canRevealNewClue: true,
    canMakeGuess: false,
    lastRevealedFactIndex: null,
    isPendingFinalFiveTransition: false,
    isProcessingGuess: false,
    hasMadeGuess: false,
    isMainGameSectionOver: false,
    
    // Today's game data
    todayGameData: null,
    todayChallenge: null,
    
    // Victory/endgame state
    isVictoryAnimationActive: false,
    victoryAnimationStep: null,
    gameOutcome: null,
    showGameMessage: false,
    
    // Timer state
    timeRemaining: 300,
    isTimerActive: false,
    timerStartTime: null,
    shouldPauseTimer: false,
    hardMode: false,
    
    // Final Five state
    isFinalFiveCompleted: false,
    showFinalFiveTransition: false,
    finalFiveTransitionReason: null,
    finalFiveTimeRemaining: 60,
    isFinalFiveActive: false,
    
    // UI state
    viewingFact: null,
    cardSourcePosition: null,
    isDrawingFromStack: false,
    isReturningToStack: false,
    isCardAnimatingOut: false,
    shouldFocusInput: false,
    hoveredFact: null,
    hasUserInput: false,
    isSettingsPanelOpen: false,
    isTutorialOpen: false,
    isResumeModalOpen: false,
    hasSeenTodaysLoadingAnimation: false,
    
    // User data
    currentStreak: 0,
    weeklyCompletions: [null, null, null, null, null, null, null],
    lastCompletionDate: null,
    isHardModeEnabled: false,
    isAutocompleteEnabled: false,
    
    // Mock functions (not used in reset testing)
    fetchChallenge: jest.fn(),
    revealFact: jest.fn(),
    handleCardClick: jest.fn(),
    closeFactCard: jest.fn(),
    completeCardAnimation: jest.fn(),
    submitGuess: jest.fn(),
    saveTodayGameData: jest.fn(),
    clearTodayGameData: jest.fn(),
    saveGameData: jest.fn(),
    startTimer: jest.fn(),
    resetTimer: jest.fn(),
    setShouldPauseTimer: jest.fn(),
    setHardModeEnabled: jest.fn(),
    updateStreak: jest.fn(),
    trackFailedAttempt: jest.fn(),
    resetWeeklyStreak: jest.fn(),
    hasPlayedToday: jest.fn(),
    loadStreakData: jest.fn(),
    saveStreakData: jest.fn(),
    // Only include methods that actually exist on GameStore type
  };

  return { ...defaultState, ...overrides } as GameStore;
};

/**
 * Simulate a user who completed today's challenge
 */
export const createCompletedTodayState = (completionDate: string): GameStore => {
  return createMockGameState({
    currentStreak: 5,
    weeklyCompletions: ['completed', 'completed', null, null, null, null, null],
    lastCompletionDate: completionDate,
    todayGameData: {
      outcome: 'standard-win',
      correctAnswer: 'Test Answer',
      numberOfTries: 3,
      timeSpent: 180,
      completionDate: completionDate
    },
    gameState: {
      loading: false,
      error: null,
      challenge: { challengeId: 'test-challenge' } as any,
      revealedFacts: [0, 1, 2],
      guesses: [
        { guess: 'wrong1', isCorrect: false },
        { guess: 'wrong2', isCorrect: false },
        { guess: 'Test Answer', isCorrect: true }
      ] as any,
      isGameOver: true,
      finalFiveOptions: null
    }
  });
};

/**
 * Simulate a user with a streak who hasn't played today
 */
export const createStreakUserState = (streak: number, lastCompletionDate: string): GameStore => {
  return createMockGameState({
    currentStreak: streak,
    weeklyCompletions: ['completed', 'completed', 'completed', null, null, null, null],
    lastCompletionDate: lastCompletionDate,
    isHardModeEnabled: true,
    isAutocompleteEnabled: false
  });
};

/**
 * Set up a scenario where it's a new day (trigger daily reset)
 */
export const setupNewDayScenario = (mockStorage: Record<string, string>, yesterday: string, today: string) => {
  // Set stored date to yesterday
  mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify(yesterday);
  
  // Mock current date as today
  mockEasternDate(today);
};

/**
 * Set up a scenario where it's the same day (no reset)
 */
export const setupSameDayScenario = (mockStorage: Record<string, string>, today: string) => {
  // Set stored date to today
  mockStorage[STORAGE_KEYS.LAST_CHALLENGE_DATE] = JSON.stringify(today);
  
  // Mock current date as today
  mockEasternDate(today);
};

/**
 * Test scenario: User plays at 11:59 PM, then system checks at 12:01 AM
 */
export const setupMidnightTransitionScenario = () => {
  const yesterday = '2025-09-23';
  const today = '2025-09-24';
  
  return {
    yesterday,
    today,
    // User completed just before midnight
    userState: createCompletedTodayState(yesterday),
    // Now it's past midnight
    setupMidnight: (mockStorage: Record<string, string>) => {
      setupNewDayScenario(mockStorage, yesterday, today);
    }
  };
};

/**
 * Test scenario: User with long streak continues playing
 */
export const setupStreakContinuationScenario = () => {
  const yesterday = '2025-09-22';
  const today = '2025-09-23';
  
  return {
    yesterday,
    today,
    // User with 10-day streak
    userState: createStreakUserState(10, yesterday),
    setupNewDay: (mockStorage: Record<string, string>) => {
      setupNewDayScenario(mockStorage, yesterday, today);
    }
  };
};

/**
 * Verify that daily reset preserved user data correctly
 */
export const verifyUserDataPreserved = (resetData: Partial<GameStore>, originalState: GameStore) => {
  expect(resetData.currentStreak).toBe(originalState.currentStreak);
  expect(resetData.weeklyCompletions).toEqual(originalState.weeklyCompletions);
  expect(resetData.lastCompletionDate).toBe(originalState.lastCompletionDate);
  expect(resetData.isHardModeEnabled).toBe(originalState.isHardModeEnabled);
  expect(resetData.isAutocompleteEnabled).toBe(originalState.isAutocompleteEnabled);
};

/**
 * Verify that game state was reset correctly
 */
export const verifyGameStateReset = (resetData: Partial<GameStore>) => {
  expect(resetData.todayGameData).toBeNull();
  expect(resetData.todayChallenge).toBeNull();
  expect(resetData.gameState?.challenge).toBeNull();
  expect(resetData.gameState?.revealedFacts).toEqual([]);
  expect(resetData.gameState?.guesses).toEqual([]);
  expect(resetData.gameState?.isGameOver).toBe(false);
  
  // UI state should be reset
  expect(resetData.hasSeenClue).toBe(false);
  expect(resetData.canRevealNewClue).toBe(true);
  expect(resetData.canMakeGuess).toBe(false);
  expect(resetData.lastRevealedFactIndex).toBeNull();
  expect(resetData.hasMadeGuess).toBe(false);
  expect(resetData.isMainGameSectionOver).toBe(false);
  
  // Timer should be reset
  expect(resetData.timeRemaining).toBe(300);
  expect(resetData.isTimerActive).toBe(false);
  expect(resetData.timerStartTime).toBeNull();
  
  // Victory state should be reset
  expect(resetData.isVictoryAnimationActive).toBe(false);
  expect(resetData.victoryAnimationStep).toBeNull();
  expect(resetData.gameOutcome).toBeNull();
  expect(resetData.showGameMessage).toBe(false);
  
  // Final Five should be reset
  expect(resetData.isFinalFiveCompleted).toBe(false);
  expect(resetData.showFinalFiveTransition).toBe(false);
  expect(resetData.finalFiveTransitionReason).toBeNull();
  expect(resetData.finalFiveTimeRemaining).toBe(60);
  expect(resetData.isFinalFiveActive).toBe(false);
  
  // Daily UI state should be reset
  expect(resetData.hasSeenTodaysLoadingAnimation).toBe(false);
};

/**
 * Run a complete daily reset test scenario
 */
export const runDailyResetScenario = (
  scenarioName: string,
  setupFn: (mockStorage: Record<string, string>) => void,
  userState: GameStore,
  expectedResetTriggered: boolean = true
) => {
  const { storage: mockStorage, mockStorageImplementation } = createMockStorage();
  
  // Mock the storage implementation
  (storage.get as jest.Mock) = mockStorageImplementation.get;
  (storage.set as jest.Mock) = mockStorageImplementation.set;
  (storage.remove as jest.Mock) = mockStorageImplementation.remove;
  (storage.clear as jest.Mock) = mockStorageImplementation.clear;
  
  // Set up the scenario
  setupFn(mockStorage);
  
  // Import and run the daily reset (must be after mocking)
  const { performDailyReset } = require('../../src/utils/dailyResetManager');
  const resetData = performDailyReset(userState);
  
  const resetTriggered = Object.keys(resetData).length > 0;
  
  return {
    resetData,
    resetTriggered,
    mockStorage,
    mockStorageImplementation,
    testResult: {
      scenarioName,
      expectedResetTriggered,
      actualResetTriggered: resetTriggered,
      passed: resetTriggered === expectedResetTriggered
    }
  };
};

export default {
  createMockStorage,
  mockEasternDate,
  createMockGameState,
  createCompletedTodayState,
  createStreakUserState,
  setupNewDayScenario,
  setupSameDayScenario,
  setupMidnightTransitionScenario,
  setupStreakContinuationScenario,
  verifyUserDataPreserved,
  verifyGameStateReset,
  runDailyResetScenario
};
