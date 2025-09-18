import { StateCreator } from 'zustand';
import type { GameStore } from '../../types';
import { storage, STORAGE_KEYS } from '@/utils/localStorage';
import { TIMER } from '@/constants/timer';

export interface TimerSlice {
  // Timer state
  timeRemaining: number;
  isTimerActive: boolean;
  shouldPauseTimer: boolean;
  timerStartTime: number | null; // Timestamp when timer started

  // Hard mode settings
  hardMode: boolean;
  isHardModeEnabled: boolean;

  // Actions
  decrementTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;
  setShouldPauseTimer: (pause: boolean) => void;
  setHardModeEnabled: (enabled: boolean) => void;
  loadTimerData: () => void;
  saveTimerData: () => void;
}

export const createTimerSlice: StateCreator<
  GameStore,
  [],
  [],
  TimerSlice
> = (set, get, _api) => ({
  // Initial state
  timeRemaining: TIMER.NORMAL_MODE_TIME,
  isTimerActive: false,
  shouldPauseTimer: false,
  timerStartTime: null,
  
  // Hard mode settings
  hardMode: false, // Current game's hard mode state (can't be changed after start)
  isHardModeEnabled: false, // Setting that can be toggled before game starts
  
  // Actions
  decrementTimer: () => {
    const { 
      timeRemaining, 
      isTimerActive, 
      gameState, 
      isFinalFiveActive, 
      showFinalFiveTransition, 
      viewingFact,
      isSettingsPanelOpen,
      shouldPauseTimer,
      isProcessingGuess
    } = get();
    
    // Don't decrement if timer should be paused (e.g., during tutorial or guess verification)
    if (shouldPauseTimer || isProcessingGuess) return;
    
    if (isTimerActive) {
      if (timeRemaining <= 1 && !isFinalFiveActive && !showFinalFiveTransition && !gameState.isGameOver) {
        // First close any open fact card if there is one
        if (viewingFact !== null) {
          // Force close the card without animation
          set({
            viewingFact: null,
            cardSourcePosition: null,
            isDrawingFromStack: false,
            isReturningToStack: false,
            isCardAnimatingOut: false
          });
        }
        
        // Close settings panel if it's open
        if (isSettingsPanelOpen) {
          set({ isSettingsPanelOpen: false });
        }
        
        // Then start the Final Five transition
        set({ 
          timeRemaining: 0,
          showFinalFiveTransition: true,
          finalFiveTransitionReason: 'time',
          isTimerActive: false, // Stop the main timer
          isPendingFinalFiveTransition: true // Prevent further interactions
        });

        // Final Five options will be fetched when the modal opens
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }
  },
  
  startTimer: () => {
    const now = Date.now();
    set({
      isTimerActive: true,
      timerStartTime: now
    });
  },
  
  resetTimer: () => {
    const { isHardModeEnabled } = get();
    const timeRemaining = isHardModeEnabled ? TIMER.HARD_MODE_TIME : TIMER.NORMAL_MODE_TIME;

    set({
      timeRemaining,
      hardMode: isHardModeEnabled,
      timerStartTime: null,
      isTimerActive: false
    });
  },
  
  setShouldPauseTimer: (pause: boolean) => set({ shouldPauseTimer: pause }),
  
  setHardModeEnabled: (enabled: boolean) => {
    // Only allow changing if no game is in progress
    const { hasSeenClue } = get();
    if (!hasSeenClue) {
      set({ isHardModeEnabled: enabled });

      // Reset the timer immediately to show the correct time based on hard mode
      const timeRemaining = enabled ? TIMER.HARD_MODE_TIME : TIMER.NORMAL_MODE_TIME;
      set({
        timeRemaining,
        finalFiveTimeRemaining: enabled ? TIMER.HARD_MODE_FINAL_FIVE_TIME : TIMER.NORMAL_MODE_FINAL_FIVE_TIME
      });
    }
  },

  loadTimerData: () => {
    const savedData = storage.get(STORAGE_KEYS.TIMER_DATA, {
      timeRemaining: TIMER.NORMAL_MODE_TIME,
      isTimerActive: false,
      shouldPauseTimer: false,
      timerStartTime: null,
      hardMode: false,
      isHardModeEnabled: false
    });

    // If timer was active when saved, calculate elapsed time
    if (savedData.isTimerActive && savedData.timerStartTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - savedData.timerStartTime) / 1000);
      const adjustedTime = Math.max(0, savedData.timeRemaining - elapsed);

      set({
        ...savedData,
        timeRemaining: adjustedTime,
        isTimerActive: adjustedTime > 0
      });
    } else {
      set(savedData);
    }
  },

  saveTimerData: () => {
    const {
      timeRemaining,
      isTimerActive,
      shouldPauseTimer,
      timerStartTime,
      hardMode,
      isHardModeEnabled
    } = get();

    const dataToSave = {
      timeRemaining,
      isTimerActive,
      shouldPauseTimer,
      timerStartTime,
      hardMode,
      isHardModeEnabled
    };

    storage.set(STORAGE_KEYS.TIMER_DATA, dataToSave);
  }
});
