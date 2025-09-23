import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCoreGameSlice } from './slices/coreGameSlice';
import { createTimerSlice } from './slices/timerSlice';
import { createFinalFiveSlice } from './slices/finalFiveSlice';
import { createUISlice } from './slices/uiSlice';
import { createStreakSlice } from './slices/streakSlice';
import { performDailyReset, shouldMigrateUserData, migrateLegacyUserData } from '../utils/dailyResetManager';
import { getEasternDateString } from '../utils/easternTime';
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
        
        // Core game state for resuming gameplay
        gameState: state.gameState,
        hasSeenClue: state.hasSeenClue,
        canRevealNewClue: state.canRevealNewClue,
        canMakeGuess: state.canMakeGuess,
        lastRevealedFactIndex: state.lastRevealedFactIndex,
        hasMadeGuess: state.hasMadeGuess,
        isMainGameSectionOver: state.isMainGameSectionOver,
        isPendingFinalFiveTransition: state.isPendingFinalFiveTransition,
        
        // Victory/endgame state
        isVictoryAnimationActive: state.isVictoryAnimationActive,
        victoryAnimationStep: state.victoryAnimationStep,
        gameOutcome: state.gameOutcome,
        showGameMessage: state.showGameMessage,
        
        // Timer state
        timeRemaining: state.timeRemaining,
        isTimerActive: state.isTimerActive,
        timerStartTime: state.timerStartTime,
        hardMode: state.hardMode,
        shouldPauseTimer: state.shouldPauseTimer,
        
        // Final Five state
        isFinalFiveCompleted: state.isFinalFiveCompleted,
        showFinalFiveTransition: state.showFinalFiveTransition,
        finalFiveTransitionReason: state.finalFiveTransitionReason,
        finalFiveTimeRemaining: Math.max(5, state.finalFiveTimeRemaining), // Never less than 5 seconds
        isFinalFiveActive: state.isFinalFiveActive,
        
        // Daily UI state
        hasSeenTodaysLoadingAnimation: state.hasSeenTodaysLoadingAnimation
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
          // Check for legacy data migration
          if (shouldMigrateUserData()) {
            const migratedData = migrateLegacyUserData();
            Object.assign(state, migratedData);
          }

          // Perform daily reset if it's a new Eastern Time day
          const resetData = performDailyReset(state);
          if (Object.keys(resetData).length > 0) {
            Object.assign(state, resetData);
          }
          // CRITICAL: Check if user already completed current challenge before any Final Five logic
          const currentChallengeDate = getEasternDateString(); // Current Eastern date
          const hasCompletedCurrentChallenge = state.todayGameData && state.todayGameData.completionDate === currentChallengeDate;
          
          if (hasCompletedCurrentChallenge && state.todayGameData) {
            // User already completed today - force them to endgame view
            state.showFinalFiveTransition = false;
            state.isFinalFiveActive = false;
            state.isMainGameSectionOver = false;
            state.isPendingFinalFiveTransition = false;
            state.gameState.isGameOver = true;
            state.gameOutcome = state.todayGameData.outcome;
            state.isVictoryAnimationActive = false;
            state.victoryAnimationStep = state.todayGameData.outcome.includes('win') ? 'summary' : null;
            state.showGameMessage = true;
            state.shouldPauseTimer = true;
            state.isTimerActive = false;
            state.isResumeModalOpen = false;
          } else if (state.showFinalFiveTransition || state.isMainGameSectionOver) {
            // User was in or heading to Final Five - show transition
            state.showFinalFiveTransition = true;
            state.shouldPauseTimer = true;
            state.isTimerActive = false;
            state.isResumeModalOpen = false;
          } else {
            // CRITICAL: Clear all transient states that could cause conflicts
            state.viewingFact = null;
            state.cardSourcePosition = null;
            state.isDrawingFromStack = false;
            state.isReturningToStack = false;
            state.isCardAnimatingOut = false;
            state.shouldFocusInput = false;
            state.hoveredFact = null;
            state.isProcessingGuess = false;
            state.hasUserInput = false;
            
            // Clear modal states (they should reopen naturally if needed)
            state.isSettingsPanelOpen = false;
            state.isTutorialOpen = false;
            
            // Normal game resume logic
            const shouldShowResumeModal = state.hasSeenClue &&
                                         !state.gameState?.isGameOver &&
                                         state.timeRemaining > 0;

            if (shouldShowResumeModal) {
              state.isResumeModalOpen = true;
              state.shouldPauseTimer = true;
              state.isTimerActive = false;
            }
          }

          // TIMER FIX: Check for timer state corruption after hydration
          if (state.hasSeenClue && !state.isTimerActive && !state.gameState?.isGameOver && state.timeRemaining > 0 && !hasCompletedCurrentChallenge) {
            state.isTimerActive = true;
            state.shouldPauseTimer = false;
            state.timerStartTime = Date.now();
          }
        }
      }
    }
  )
); 