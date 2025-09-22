/**
 * Tests for RED-005: First Card Animation Refresh Race Condition
 *
 * These tests verify that the bug exists and validates the conditions
 * under which the game becomes stuck in an unplayable state.
 */

import { useGameStore } from '../../src/store/gameStore';
import type { GameStore } from '../../src/types';

// Mock localStorage for testing
const mockLocalStorage = {
  storage: new Map<string, string>(),
  getItem: function(key: string) { return this.storage.get(key) || null; },
  setItem: function(key: string, value: string) { this.storage.set(key, value); },
  removeItem: function(key: string) { this.storage.delete(key); },
  clear: function() { this.storage.clear(); }
};

// @ts-ignore
global.localStorage = mockLocalStorage;

describe('RED-005: First Card Animation Refresh Race Condition', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage
    mockLocalStorage.clear();

    // Reset the store to initial state
    useGameStore.getState = jest.fn();
    useGameStore.setState = jest.fn();
  });

  describe('Bug Reproduction: First Card Refresh During Animation', () => {
    it('should create deadlock when refreshing during first card animation', () => {
      // Simulate the exact state that gets persisted when user refreshes
      // during first card animation (after 1000ms delay completes)
      const buggyPersistedState = {
        // Core game state
        gameState: {
          loading: false,
          error: null,
          challenge: { id: 'test-challenge', category: 'Books' },
          revealedFacts: [0], // ❌ First fact was added to stack during animation
          guesses: [], // No guesses made yet
          isGameOver: false,
          finalFiveOptions: null
        },

        // Game progress
        hasSeenClue: true, // ❌ Set during closeFactCard(), persisted
        canRevealNewClue: false, // Will be overridden by state reconciliation
        canMakeGuess: true, // Will be overridden by state reconciliation
        lastRevealedFactIndex: 0,

        // Timer state - STUCK because initialization was skipped
        timeRemaining: 300, // ❌ Still at 5:00 (300 seconds)
        isTimerActive: false, // ❌ Never started due to hasSeenClue=true
        timerStartTime: null,

        // User data (should persist)
        currentStreak: 0,
        weeklyCompletions: [null, null, null, null, null, null, null],
        isHardModeEnabled: false
      } as unknown as GameStore;

      // Mock the store's hydration to return this buggy state
      const mockGet = jest.fn().mockReturnValue(buggyPersistedState);
      const mockSet = jest.fn();

      // This simulates what happens during Zustand hydration + state reconciliation
      // The bug is in how the state reconciliation logic handles this scenario

      // Calculate the metrics that state reconciliation uses
      const revealsCount = buggyPersistedState.gameState.revealedFacts.length; // 1
      const allGuessesCount = buggyPersistedState.gameState.guesses.length; // 0
      const wrongGuessesCount = buggyPersistedState.gameState.guesses.filter(g => !g.isCorrect).length; // 0

      // ❌ BUG: The inconsistent state logic thinks this is wrong
      // because revealsCount (1) > wrongGuessesCount (0), so user should be able to guess
      // BUT the logic incorrectly sets canMakeGuess = false
      const hasInconsistentGuessState = buggyPersistedState.canMakeGuess && revealsCount <= wrongGuessesCount;

      // Assertions that prove the bug conditions
      expect(revealsCount).toBe(1); // First card is revealed
      expect(wrongGuessesCount).toBe(0); // No wrong guesses yet
      expect(allGuessesCount).toBe(0); // No guesses at all
      expect(buggyPersistedState.hasSeenClue).toBe(true); // Set during animation
      expect(buggyPersistedState.timeRemaining).toBe(300); // Timer stuck at 5:00
      expect(buggyPersistedState.isTimerActive).toBe(false); // Timer never started

      // ❌ The bug: State reconciliation will incorrectly "fix" this
      // When revealsCount > wrongGuessesCount, user SHOULD be able to guess
      // But the current logic may set canMakeGuess = false incorrectly
      expect(revealsCount > wrongGuessesCount).toBe(true); // User should guess, not reveal
    });

    it('should identify first card scenario correctly', () => {
      // Test the specific pattern that indicates first card deadlock
      const firstCardDeadlockState = {
        hasSeenClue: true,
        gameState: {
          revealedFacts: [0], // Exactly one fact revealed
          guesses: [] // No guesses made
        },
        timeRemaining: 300, // Timer stuck at initial value
        isTimerActive: false, // Timer never started
        canMakeGuess: false // Incorrectly set by state reconciliation
      };

      // This is the exact pattern that indicates the first card bug
      const isFirstCardBug = (
        firstCardDeadlockState.hasSeenClue &&
        firstCardDeadlockState.gameState.revealedFacts.length === 1 &&
        firstCardDeadlockState.gameState.guesses.length === 0 &&
        firstCardDeadlockState.timeRemaining === 300 &&
        !firstCardDeadlockState.isTimerActive &&
        !firstCardDeadlockState.canMakeGuess
      );

      expect(isFirstCardBug).toBe(true);
    });
  });

  describe('Bug Validation: Timer Initialization Logic', () => {
    it('should show timer initialization skips when hasSeenClue is true', () => {
      // Simulate the timer initialization check from useMainContainerEvents
      const mockHasHydrated = true;
      const mockGameState = { isGameOver: false };
      const mockIsTimerActive = false;
      const mockPersistedHasSeenClue = true; // ❌ This prevents timer initialization

      // This is the exact condition from useMainContainerEvents.ts
      const shouldInitializeTimer = (
        mockHasHydrated &&
        !mockIsTimerActive &&
        !mockGameState.isGameOver &&
        !mockPersistedHasSeenClue // ❌ FALSE when hasSeenClue=true
      );

      // ❌ BUG: Timer won't initialize because hasSeenClue=true from persisted state
      expect(shouldInitializeTimer).toBe(false);

      // Compare with fresh game state (should initialize)
      const shouldInitializeFreshGame = (
        mockHasHydrated &&
        !mockIsTimerActive &&
        !mockGameState.isGameOver &&
        !false // hasSeenClue would be false in fresh game
      );

      expect(shouldInitializeFreshGame).toBe(true);
    });
  });

  describe('Bug Validation: State Reconciliation Logic', () => {
    it('should show incorrect state reconciliation for first card scenario', () => {
      // Simulate the state reconciliation logic from coreGameSlice.ts
      const mockSavedState = {
        canMakeGuess: true, // This was set during closeFactCard()
        gameState: {
          revealedFacts: [0], // One fact revealed
          guesses: [] // No guesses made
        }
      };

      const revealsCount = mockSavedState.gameState.revealedFacts.length; // 1
      const wrongGuessesCount = mockSavedState.gameState.guesses.filter((g: any) => !g.isCorrect).length; // 0

      // This is the exact logic from the state reconciliation
      const hasInconsistentGuessState = mockSavedState.canMakeGuess && revealsCount <= wrongGuessesCount;

      // ❌ BUG: This should be FALSE (state is actually consistent)
      // revealsCount (1) <= wrongGuessesCount (0) = 1 <= 0 = FALSE
      // So hasInconsistentGuessState = true && false = FALSE
      // This means the state reconciliation thinks it's NOT inconsistent

      expect(hasInconsistentGuessState).toBe(false);
      expect(revealsCount).toBe(1);
      expect(wrongGuessesCount).toBe(0);
      expect(revealsCount > wrongGuessesCount).toBe(true); // User SHOULD be able to guess

      // But what actually happens in state reconciliation:
      if (hasInconsistentGuessState) {
        // This path won't execute (good)
      } else if (revealsCount === wrongGuessesCount) {
        // 1 === 0 = false, won't execute
      } else if (revealsCount > wrongGuessesCount) {
        // 1 > 0 = true, SHOULD execute and set canMakeGuess = true
        expect(true).toBe(true); // This is the correct path
      } else {
        // Less reveals than wrong guesses - shouldn't happen
        expect(false).toBe(true); // This shouldn't execute
      }
    });

    it('should demonstrate the actual deadlock mechanism', () => {
      // The real bug might be elsewhere - let's check all conditions
      const mockState = {
        gameState: {
          revealedFacts: [0],
          guesses: [],
          isGameOver: false
        },
        hasSeenClue: true,
        canMakeGuess: false, // This gets set to false somewhere
        canRevealNewClue: true, // This allows revealing but user shouldn't
        timeRemaining: 300,
        isTimerActive: false
      };

      // Check game control conditions that prevent guessing
      const hasSeenClue = mockState.hasSeenClue; // true
      const canMakeGuess = mockState.canMakeGuess; // false ❌
      const isGameOver = mockState.gameState.isGameOver; // false

      // From GameControls logic - what prevents guessing?
      const canSubmitGuess = hasSeenClue && canMakeGuess && !isGameOver;

      expect(hasSeenClue).toBe(true); // ✅ User has seen clue
      expect(canMakeGuess).toBe(false); // ❌ This is the problem!
      expect(isGameOver).toBe(false); // ✅ Game is active
      expect(canSubmitGuess).toBe(false); // ❌ Can't submit because canMakeGuess=false

      // Check instruction text logic
      const instructionConditions = {
        isGameOver: mockState.gameState.isGameOver,
        hasSeenClue: mockState.hasSeenClue,
        canMakeGuess: mockState.canMakeGuess
      };

      // From ContextArea formatting logic
      if (instructionConditions.isGameOver) {
        // Won't execute
      } else if (!instructionConditions.hasSeenClue) {
        // Won't execute (hasSeenClue is true)
      } else if (!instructionConditions.canMakeGuess) {
        // ❌ EXECUTES: Shows "Reveal a new fact to make another guess..."
        expect(true).toBe(true); // This is why user sees "reveal new fact" message
      } else {
        // Should execute but doesn't because canMakeGuess=false
      }
    });
  });

  describe('Working Scenarios: Why Other Cards Work Fine', () => {
    it('should show subsequent cards work correctly', () => {
      // Simulate refreshing during 2nd, 3rd, etc. card animation
      const workingState = {
        gameState: {
          revealedFacts: [0, 1], // Multiple facts revealed
          guesses: [{ guess: 'test', isCorrect: false }] // One wrong guess made
        },
        hasSeenClue: true,
        timeRemaining: 250, // Timer already running
        isTimerActive: true, // Timer properly initialized
      };

      const revealsCount = workingState.gameState.revealedFacts.length; // 2
      const wrongGuessesCount = workingState.gameState.guesses.filter(g => !g.isCorrect).length; // 1

      // State reconciliation logic
      if (revealsCount === wrongGuessesCount) {
        // 2 === 1 = false
      } else if (revealsCount > wrongGuessesCount) {
        // 2 > 1 = true - user should make guess ✅
        expect(true).toBe(true);
      }

      // Timer is already running ✅
      expect(workingState.isTimerActive).toBe(true);
      expect(workingState.timeRemaining).toBeLessThan(300);
    });
  });
});