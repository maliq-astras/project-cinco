import { StateCreator } from 'zustand';
import type { GameStore } from '../../types';
import { getEasternDateString, getEasternDayOfWeek, getEasternTime } from '@/utils/easternTime';
import { storage, STORAGE_KEYS } from '@/utils/localStorage';

export interface StreakSlice {
  // Streak tracking
  currentStreak: number;
  weeklyCompletions: ('completed' | 'failed' | 'missed' | null)[]; // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  lastCompletionDate: string | null; // ISO date string
  
  // Actions
  updateStreak: () => void;
  trackFailedAttempt: () => void;
  resetWeeklyStreak: () => void;
  hasPlayedToday: () => boolean | null;
  loadStreakData: () => void;
  saveStreakData: () => void;
}

export const createStreakSlice: StateCreator<
  GameStore,
  [],
  [],
  StreakSlice
> = (set, get, _api) => ({
  // Initial state - will be overridden by loadStreakData
  currentStreak: 0,
  weeklyCompletions: [null, null, null, null, null, null, null], // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  lastCompletionDate: null,
  
  // Streak tracking methods
  updateStreak: () => {
    const today = getEasternDateString(); // Get Eastern Time YYYY-MM-DD format
    const dayOfWeek = getEasternDayOfWeek(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
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
    
    // Check if this is consecutive from yesterday (Eastern Time)
    const easternTime = getEasternTime();
    const yesterday = new Date(easternTime);
    yesterday.setDate(easternTime.getDate() - 1);
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

    // Save to localStorage
    get().saveStreakData();
  },
  
  resetWeeklyStreak: () => {
    set({
      weeklyCompletions: [null, null, null, null, null, null, null],
      currentStreak: 0
    });

    // Save to localStorage
    get().saveStreakData();
  },
  
  trackFailedAttempt: () => {

    const today = getEasternDateString();
    const dayOfWeek = getEasternDayOfWeek();
    
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

    // Save to localStorage
    get().saveStreakData();
  },
  
  
  hasPlayedToday: () => {
    const today = getEasternDateString();
    const { lastCompletionDate, todayGameData } = get();
    
    // Check both streak completion and today's game data
    const streakCompleted = lastCompletionDate === today;
    const gameCompleted = todayGameData && todayGameData.completionDate === today;
    
    return streakCompleted || gameCompleted;
  },

  loadStreakData: () => {
    const savedData = storage.get(STORAGE_KEYS.STREAK_DATA, {
      currentStreak: 0,
      weeklyCompletions: [null, null, null, null, null, null, null],
      lastCompletionDate: null
    });

    set(savedData);
  },

  saveStreakData: () => {
    const { currentStreak, weeklyCompletions, lastCompletionDate } = get();
    storage.set(STORAGE_KEYS.STREAK_DATA, {
      currentStreak,
      weeklyCompletions,
      lastCompletionDate
    });
  }
});
