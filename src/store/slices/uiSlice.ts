import { StateCreator } from 'zustand';
import type { GameStore } from '../../types';

export interface UISlice {
  // UI and animation states
  hoveredFact: number | null;
  viewingFact: number | null;
  cardSourcePosition: { x: number, y: number } | null;
  isDrawingFromStack: boolean;
  isReturningToStack: boolean;
  isCardAnimatingOut: boolean;
  shouldFocusInput: boolean;
  scaleFactor: number;
  // Input presence flag (do not store the actual text)
  hasUserInput: boolean;
  
  // Panel and modal states
  isSettingsPanelOpen: boolean;
  isTutorialOpen: boolean;
  
  // Autocomplete settings
  isAutocompleteEnabled: boolean;
  
  // Actions
  setHoveredFact: (factIndex: number | null) => void;
  setShouldFocusInput: (shouldFocus: boolean) => void;
  setScaleFactor: (factor: number) => void;
  setSettingsPanelOpen: (isOpen: boolean) => void;
  setTutorialOpen: (isOpen: boolean) => void;
  setAutocompleteEnabled: (enabled: boolean) => void;
  setHasUserInput: (hasInput: boolean) => void;
}

export const createUISlice: StateCreator<
  GameStore,
  [],
  [],
  UISlice
> = (set, get, _api) => ({
  // Initial state
  hoveredFact: null,
  viewingFact: null,
  cardSourcePosition: null,
  isDrawingFromStack: false,
  isReturningToStack: false,
  isCardAnimatingOut: false,
  shouldFocusInput: false,
  scaleFactor: 1, // Default scale factor (1 = 100%)
  hasUserInput: false,
  
  // Panel and modal states
  isSettingsPanelOpen: false,
  isTutorialOpen: false,
  
  // Autocomplete settings
  isAutocompleteEnabled: false, // Default to disabled, like dark mode
  
  // Actions
  setHoveredFact: (factIndex: number | null) => set({ hoveredFact: factIndex }),
  setShouldFocusInput: (shouldFocus: boolean) => set({ shouldFocusInput: shouldFocus }),
  setScaleFactor: (factor: number) => set({ scaleFactor: factor }),
  setHasUserInput: (hasInput: boolean) => set({ hasUserInput: hasInput }),
  
  setAutocompleteEnabled: (enabled: boolean) => {
    set({ isAutocompleteEnabled: enabled });
  },
  
  // Add methods to control the settings panel and tutorial
  setSettingsPanelOpen: (isOpen: boolean) => set({ isSettingsPanelOpen: isOpen }),
  setTutorialOpen: (isOpen: boolean) => {
    // Always set both states to the same value
    set({ 
      isTutorialOpen: isOpen,
    });
    // Also pause/unpause timer through dependency
    get().setShouldPauseTimer(isOpen);
  }
});
