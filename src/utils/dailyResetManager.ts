import { getEasternDateString } from './easternTime';
import { storage, STORAGE_KEYS } from './localStorage';
import type { GameStore } from '../types';

/**
 * Centralized Daily Reset Manager
 *
 * Single source of truth for daily reset logic.
 * Handles the transition from one day's game to the next while preserving user data.
 */

/**
 * Check if it's a new Eastern Time day since last recorded
 */
const isNewDay = (): boolean => {
  const storedDate = storage.get(STORAGE_KEYS.LAST_CHALLENGE_DATE, '');
  const currentDate = getEasternDateString();
  return storedDate !== currentDate;
};

/**
 * Check if current game data is for a different challenge date
 */
const isNewChallenge = (currentState: GameStore): boolean => {
  const currentDate = getEasternDateString();
  return !!(currentState.todayGameData && currentState.todayGameData.completionDate !== currentDate);
};

/**
 * Get initial/default game state for a fresh game
 */
const getInitialGameState = () => ({
  // Core game state - fresh start
  gameState: {
    loading: false,
    error: null,
    challenge: null,
    revealedFacts: [],
    guesses: [],
    isGameOver: false,
    finalFiveOptions: null
  },

  // Today's game data - cleared
  todayGameData: null,
  todayChallenge: null,

  // Game progress - reset
  hasSeenClue: false,
  canRevealNewClue: true,
  canMakeGuess: false,
  lastRevealedFactIndex: null,
  hasMadeGuess: false,
  isMainGameSectionOver: false,
  isPendingFinalFiveTransition: false,

  // Victory/endgame state - cleared
  isVictoryAnimationActive: false,
  victoryAnimationStep: null,
  gameOutcome: null,
  showGameMessage: false,

  // Timer state - reset
  timeRemaining: 300, // 5 minutes default
  isTimerActive: false,
  timerStartTime: null,
  shouldPauseTimer: false,

  // Final Five state - reset
  isFinalFiveCompleted: false,
  showFinalFiveTransition: false,
  finalFiveTransitionReason: null,
  finalFiveTimeRemaining: 60, // 1 minute default
  isFinalFiveActive: false,

  // UI state - cleared
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
  hasSeenTodaysLoadingAnimation: false // Reset daily - user sees loading animation once per day
});

/**
 * Extract user data that should persist across daily resets
 */
const extractUserData = (state: GameStore) => ({
  // Streak tracking - ALWAYS PERSISTS
  currentStreak: state.currentStreak || 0,
  weeklyCompletions: state.weeklyCompletions || [null, null, null, null, null, null, null],
  lastCompletionDate: state.lastCompletionDate || null,

  // User preferences - ALWAYS PERSISTS
  isHardModeEnabled: state.isHardModeEnabled || false,
  isAutocompleteEnabled: state.isAutocompleteEnabled || false
});

/**
 * Perform daily reset if needed
 *
 * @param currentState - Current Zustand state
 * @returns Partial state update (empty object if no reset needed)
 */
export const performDailyReset = (currentState: GameStore): Partial<GameStore> => {
  // Reset if it's a new day OR if completion data is for a different challenge
  if (!isNewDay() && !isNewChallenge(currentState)) {
    return {}; // No reset needed
  }

  // Extract user data to preserve
  const preservedUserData = extractUserData(currentState);

  // Get fresh game state
  const freshGameState = getInitialGameState();

  // Update the stored date to current Eastern date
  const newDate = getEasternDateString();
  storage.set(STORAGE_KEYS.LAST_CHALLENGE_DATE, newDate);

  // Return combined fresh game state + preserved user data
  return {
    ...freshGameState,
    ...preservedUserData,
    // Ensure timer is properly reset during daily transitions
    isTimerActive: false,
    shouldPauseTimer: false,
    timeRemaining: preservedUserData.isHardModeEnabled ? 60 : 300,
    timerStartTime: null
  };
};

/**
 * Check if user data exists and needs to be migrated
 * Used for backward compatibility during system updates
 */
export const shouldMigrateUserData = (): boolean => {
  const hasLegacyStreakData = !!storage.get(STORAGE_KEYS.STREAK_DATA, null);
  const hasLegacyGameData = !!storage.get(STORAGE_KEYS.GAME_STATE, null);
  return hasLegacyStreakData || hasLegacyGameData;
};

/**
 * Migrate user data from legacy manual localStorage to current system
 * Only preserves user settings and streak data, discards game state
 */
export const migrateLegacyUserData = (): Partial<GameStore> => {
  // Extract legacy streak data if it exists
  const legacyStreakData = storage.get(STORAGE_KEYS.STREAK_DATA, {
    currentStreak: 0,
    weeklyCompletions: [null, null, null, null, null, null, null],
    lastCompletionDate: null
  });

  // Clean up legacy keys
  storage.remove(STORAGE_KEYS.STREAK_DATA);
  storage.remove(STORAGE_KEYS.GAME_STATE);
  storage.remove(STORAGE_KEYS.TIMER_DATA);

  return legacyStreakData;
};