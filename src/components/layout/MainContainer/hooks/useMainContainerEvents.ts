import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChallenge } from '@/hooks/api';
import { ResponsiveValues } from '@/types/responsive';
import { GameState } from '@/types';
import type { GameControlsHandle } from '../../../game/GameControls';

interface UseMainContainerEventsProps {
  mounted: boolean;
  responsiveValues: ResponsiveValues;
  shouldFocusInput: boolean;
  gameControlsRef: React.RefObject<GameControlsHandle | null>;
  setShouldFocusInput: (value: boolean) => void;
  setScaleFactor: (factor: number) => void;
  isTimerActive: boolean;
  shouldPauseTimer: boolean;
  gameState: GameState;
  resetTimer: () => void;
  isHardModeEnabled: boolean;
  timeRemaining: number;
  decrementTimer: () => void;
  fetchChallenge: (language: string) => void;
}

export const useMainContainerEvents = ({
  mounted,
  responsiveValues,
  shouldFocusInput,
  gameControlsRef,
  setShouldFocusInput,
  setScaleFactor,
  isTimerActive,
  shouldPauseTimer,
  gameState,
  resetTimer,
  isHardModeEnabled,
  timeRemaining,
  decrementTimer,
  fetchChallenge
}: UseMainContainerEventsProps) => {
  const { language } = useLanguage();

  // Check if store has been hydrated
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Small delay to ensure Zustand hydration completes
    const timer = setTimeout(() => setHasHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch challenge using React Query
  const { data: challenge } = useChallenge(language);

  // Set scale factor based on responsive values
  useEffect(() => {
    if (mounted) {
      const scaleFactor = responsiveValues.bubbleSize / 60; // Base size is 60px
      setScaleFactor(scaleFactor);
    }
  }, [mounted, responsiveValues.bubbleSize, setScaleFactor]);

  // Focus the input after card closes
  useEffect(() => {
    if (shouldFocusInput && gameControlsRef.current) {
      setTimeout(() => {
        gameControlsRef.current?.focusInput();
        setShouldFocusInput(false);
      }, 100);
    }
  }, [shouldFocusInput, setShouldFocusInput, gameControlsRef]);

  // Initialize the timer based on hard mode setting (only for fresh games)
  useEffect(() => {
    const { hasSeenClue: persistedHasSeenClue } = useGameStore.getState();
    if (hasHydrated && !isTimerActive && !gameState.isGameOver && !persistedHasSeenClue) {
      resetTimer();
    }
  }, [hasHydrated, isHardModeEnabled, gameState.isGameOver, resetTimer, isTimerActive]);

  // Update game state when challenge data is fetched (only for fresh games)
  useEffect(() => {
    const { hasSeenClue: persistedHasSeenClue } = useGameStore.getState();
    if (hasHydrated && challenge && !persistedHasSeenClue && !gameState.isGameOver) {
      fetchChallenge(language);
    }
  }, [hasHydrated, challenge, language, fetchChallenge, gameState.isGameOver]);

  // Handle the timer
  useEffect(() => {
    if (isTimerActive && !gameState.isGameOver && !shouldPauseTimer) {
      const timer = setInterval(() => {
        const currentTimeRemaining = useGameStore.getState().timeRemaining;

        if (currentTimeRemaining > 0 && !useGameStore.getState().gameState.isGameOver) {
          decrementTimer();
        } else {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimerActive, shouldPauseTimer, timeRemaining, decrementTimer, gameState.isGameOver]);

  return {};
};