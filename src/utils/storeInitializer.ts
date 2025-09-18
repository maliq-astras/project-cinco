import { useGameStore } from '@/store/gameStore';

/**
 * Initialize store with persisted data on app start
 * Call this once when the app loads
 */
export const initializeStore = (): void => {
  const store = useGameStore.getState();

  // Load persisted data (Zustand handles game/timer state automatically)
  store.loadStreakData();
};