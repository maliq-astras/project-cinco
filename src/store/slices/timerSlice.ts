import { StateCreator } from 'zustand';
import type { GameStore } from '../../types';

export interface TimerSlice {
  // Timer state
  timeRemaining: number;
  isTimerActive: boolean;
  shouldPauseTimer: boolean;
  
  // Hard mode settings
  hardMode: boolean;
  isHardModeEnabled: boolean;
  
  // Actions
  decrementTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;
  setShouldPauseTimer: (pause: boolean) => void;
  setHardModeEnabled: (enabled: boolean) => void;
}

export const createTimerSlice: StateCreator<
  GameStore,
  [],
  [],
  TimerSlice
> = (set, get, _api) => ({
  // Initial state
  timeRemaining: 300, // 5 minutes in normal mode
  isTimerActive: false,
  shouldPauseTimer: false,
  
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
    // Ensure we're setting the timer active state properly
    set({ isTimerActive: true });
  },
  
  resetTimer: () => {
    const { isHardModeEnabled } = get();
    
    // Set timer based on hard mode
    const timeRemaining = isHardModeEnabled ? 55 : 300;
    
    // Lock in the hard mode setting once the game starts
    set({
      timeRemaining,
      hardMode: isHardModeEnabled,
    });
  },
  
  setShouldPauseTimer: (pause: boolean) => set({ shouldPauseTimer: pause }),
  
  setHardModeEnabled: (enabled: boolean) => {
    // Only allow changing if no game is in progress
    const { hasSeenClue } = get();
    if (!hasSeenClue) {
      set({ isHardModeEnabled: enabled });
      
      // Reset the timer immediately to show the correct time based on hard mode
      const timeRemaining = enabled ? 55 : 300;
      set({ 
        timeRemaining,
        finalFiveTimeRemaining: enabled ? 5 : 55 // Also update Final Five timer when toggling hard mode
      });
    }
  }
});
