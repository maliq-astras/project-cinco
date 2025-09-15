import { StateCreator } from 'zustand';
import type { GameStore } from '../../types';

export interface StreakSlice {
  // Streak tracking
  currentStreak: number;
  weeklyCompletions: ('completed' | 'failed' | 'missed' | null)[]; // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  lastCompletionDate: string | null; // ISO date string
  
  // Actions
  updateStreak: () => void;
  trackFailedAttempt: () => void;
  resetWeeklyStreak: () => void;
  updateMissedDays: () => void;
  hasPlayedToday: () => boolean;
}

export const createStreakSlice: StateCreator<
  GameStore,
  [],
  [],
  StreakSlice
> = (set, get, _api) => ({
  // Initial state
  currentStreak: 0,
  weeklyCompletions: [null, null, null, null, null, null, null], // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  lastCompletionDate: null,
  
  // Streak tracking methods
  updateStreak: () => {
    // First, mark any missed days before processing current day
    get().updateMissedDays();
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    const { lastCompletionDate, weeklyCompletions, currentStreak } = get();
    
    // Check if already completed today
    if (lastCompletionDate === today) {
      return; // Already completed today
    }
    
    // Check if it's a new week (Sunday) - reset if so
    if (dayOfWeek === 0) {
      const newWeeklyCompletions: ('completed' | 'failed' | 'missed' | null)[] = [null, null, null, null, null, null, null];
      newWeeklyCompletions[0] = 'completed'; // Mark Sunday as completed
      
      set({
        weeklyCompletions: newWeeklyCompletions,
        lastCompletionDate: today,
        currentStreak: 1
      });
      return;
    }
    
    // Check if this is consecutive from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const newWeeklyCompletions = [...weeklyCompletions];
    newWeeklyCompletions[dayOfWeek] = 'completed';
    
    let newStreak = currentStreak;
    
    // If last completion was yesterday, increment streak
    if (lastCompletionDate === yesterdayStr) {
      newStreak = currentStreak + 1;
    } else {
      // Check if there's a gap in this week
      let hasGap = false;
      for (let i = 0; i < dayOfWeek; i++) {
        if (newWeeklyCompletions[i] !== 'completed') {
          hasGap = true;
          break;
        }
      }
      
      if (hasGap) {
        // Start fresh streak when there's a gap
        newStreak = 1;
      } else {
        // Continue streak if no gap
        newStreak = currentStreak + 1;
      }
    }
    
    set({
      weeklyCompletions: newWeeklyCompletions,
      lastCompletionDate: today,
      currentStreak: newStreak
    });
  },
  
  resetWeeklyStreak: () => {
    set({
      weeklyCompletions: [null, null, null, null, null, null, null],
      currentStreak: 0
    });
  },
  
  trackFailedAttempt: () => {
    // First, mark any missed days before processing current day
    get().updateMissedDays();
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay();
    
    const { lastCompletionDate, weeklyCompletions } = get();
    
    // Check if already completed or failed today
    if (lastCompletionDate === today) {
      return; // Already processed today
    }
    
    const newWeeklyCompletions = [...weeklyCompletions];
    newWeeklyCompletions[dayOfWeek] = 'failed';
    
    set({
      weeklyCompletions: newWeeklyCompletions,
      lastCompletionDate: today,
      currentStreak: 0 // Failed attempts break the streak
    });
  },
  
  updateMissedDays: () => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const today = now.toISOString().split('T')[0];
    
    const { weeklyCompletions, currentStreak, todayGameData } = get();
    const newWeeklyCompletions = [...weeklyCompletions];
    let hasChanges = false;
    
    // Clear today's game data if it's from a previous day
    if (todayGameData && todayGameData.completionDate !== today) {
      get().clearTodayGameData();
    }
    
    // Mark all days from Sunday to yesterday as missed if they're null
    for (let i = 0; i < currentDayOfWeek; i++) {
      if (newWeeklyCompletions[i] === null) {
        newWeeklyCompletions[i] = 'missed';
        hasChanges = true;
      }
    }
    
    // Only update the weeklyCompletions if there were changes
    // Don't reset streak if today is already completed
    if (hasChanges) {
      const todayCompleted = newWeeklyCompletions[currentDayOfWeek] === 'completed';
      
      set({
        weeklyCompletions: newWeeklyCompletions,
        // Only reset streak if today is not completed
        currentStreak: todayCompleted ? Math.max(currentStreak, 1) : 0
      });
    }
  },
  
  hasPlayedToday: () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastCompletionDate } = get();
    return lastCompletionDate === today;
  }
});
