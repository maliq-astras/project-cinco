/**
 * Initialize store with persisted data on app start
 * Call this once when the app loads
 */
export const initializeStore = (): void => {
  // Store initialization is now handled by Zustand persist hydration
  // The centralized daily reset manager handles data loading and daily transitions
  console.log('🚀 Store initialization complete - handled by Zustand persist + daily reset manager');
};