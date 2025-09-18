import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCoreGameSlice } from './slices/coreGameSlice';
import { createTimerSlice } from './slices/timerSlice';
import { createFinalFiveSlice } from './slices/finalFiveSlice';
import { createUISlice } from './slices/uiSlice';
import { createStreakSlice } from './slices/streakSlice';
import type { GameStore } from '../types';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get, api) => ({
      // Combine all slices using the spread operator
      ...createCoreGameSlice(set, get, api),
      ...createTimerSlice(set, get, api),
      ...createFinalFiveSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createStreakSlice(set, get, api),
    }),
    {
      name: 'cinco-game-storage', // Unique name for localStorage key
      version: 2, // Version for handling data migrations
      skipHydration: false, // Ensure hydration happens
      partialize: (state) => ({
        // Settings and streak data
        isHardModeEnabled: state.isHardModeEnabled,
        isAutocompleteEnabled: state.isAutocompleteEnabled,
        currentStreak: state.currentStreak,
        weeklyCompletions: state.weeklyCompletions,
        lastCompletionDate: state.lastCompletionDate,
        // Today's game data for full endgame experience on refresh
        todayGameData: state.todayGameData,
        todayChallenge: state.todayChallenge,
        // Persist game state for resuming gameplay
        gameState: state.gameState,
        hasSeenClue: state.hasSeenClue,
        canRevealNewClue: state.canRevealNewClue,
        canMakeGuess: state.canMakeGuess,
        lastRevealedFactIndex: state.lastRevealedFactIndex,
        hasMadeGuess: state.hasMadeGuess,
        // Persist timer state
        timeRemaining: state.timeRemaining,
        isTimerActive: state.isTimerActive,
        timerStartTime: state.timerStartTime,
        hardMode: state.hardMode,
        shouldPauseTimer: state.shouldPauseTimer,
        // Persist Final Five completion state
        isFinalFiveCompleted: state.isFinalFiveCompleted
      }),
      migrate: (persistedState: unknown, version: number) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState;
        }

        // Migration from version 0 to 1: convert boolean[] to new format
        if (version === 0) {
          const state = persistedState as Record<string, unknown>;
          const oldCompletions = state.weeklyCompletions;
          if (Array.isArray(oldCompletions) && oldCompletions.length === 7) {
            // Convert boolean array to new format
            const newCompletions = oldCompletions.map((completed: unknown) =>
              (typeof completed === 'boolean' && completed) ? 'completed' : null
            );
            return {
              ...state,
              weeklyCompletions: newCompletions
            };
          }
        }
        // Migration from version 1 to 2: add game state persistence
        if (version <= 1) {
          // Previous versions didn't persist game state, so keep only the old fields
          return persistedState;
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if game is in progress - should NEVER show resume modal if entire game is completed
          // Game is completed if: main game over AND Final Five completed, OR if there's no time left
          const isEntireGameCompleted = state.gameState?.isGameOver && state.isFinalFiveCompleted;

          if (state.hasSeenClue && !isEntireGameCompleted && state.timeRemaining > 0) {
            state.isResumeModalOpen = true;
            state.shouldPauseTimer = true;
            state.isTimerActive = false;
          }
        }
      }
    }
  )
); 