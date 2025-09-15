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
      version: 1, // Version for handling data migrations
      partialize: (state) => ({ 
        // Only persist the hard mode setting and streak data
        isHardModeEnabled: state.isHardModeEnabled,
        isAutocompleteEnabled: state.isAutocompleteEnabled,
        currentStreak: state.currentStreak,
        weeklyCompletions: state.weeklyCompletions,
        lastCompletionDate: state.lastCompletionDate,
        // Persist today's game data for full endgame experience on refresh
        todayGameData: state.todayGameData,
        todayChallenge: state.todayChallenge
      }),
      migrate: (persistedState: unknown, version: number) => {
        // Migration from version 0 to 1: convert boolean[] to new format
        if (version === 0) {
          const state = persistedState as Partial<GameStore>;
          const oldCompletions = state.weeklyCompletions;
          if (Array.isArray(oldCompletions) && oldCompletions.length === 7) {
            // Convert boolean array to new format
            const newCompletions = oldCompletions.map((completed: unknown) => 
              (typeof completed === 'boolean' && completed) ? 'completed' : null
            );
            return {
              ...(persistedState as Record<string, unknown>),
              weeklyCompletions: newCompletions
            };
          }
        }
        return persistedState;
      },
    }
  )
); 