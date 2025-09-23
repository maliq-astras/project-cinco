import { StateCreator } from 'zustand';
import type { GameStore } from '../../types';
// Eastern time utilities no longer needed - using challenge date directly
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
    // Use the current challenge's date to prevent timezone manipulation
    const { gameState } = get();
    const challengeDate = gameState?.challenge?.date;
    
    if (!challengeDate) {
      return; // No challenge loaded, can't update streak
    }
    
    // Calculate day of week from challenge date
    const challengeDateObj = new Date(challengeDate + 'T12:00:00.000Z');
    const dayOfWeek = challengeDateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    const { lastCompletionDate, weeklyCompletions, currentStreak } = get();
    
    // Check if already completed this challenge
    if (lastCompletionDate === challengeDate) {
      return; // Already completed this challenge
    }
    
    // Check if it's a new week (Sunday) - reset if so
    if (dayOfWeek === 0) {
      const newWeeklyCompletions: ('completed' | 'failed' | 'missed' | null)[] = [null, null, null, null, null, null, null];
      newWeeklyCompletions[0] = 'completed'; // Mark Sunday as completed
      
      set({
        weeklyCompletions: newWeeklyCompletions,
        lastCompletionDate: challengeDate,
        currentStreak: 1
      });
      return;
    }
    
    // Check if this is consecutive from yesterday (Eastern Time)
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    
    // Format yesterday's date using Eastern timezone
    const easternFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const yesterdayStr = easternFormatter.format(yesterday);
    
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
      lastCompletionDate: challengeDate,
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
    // Use the current challenge's date to prevent timezone manipulation
    const { gameState } = get();
    const challengeDate = gameState?.challenge?.date;
    
    if (!challengeDate) {
      return; // No challenge loaded, can't track failure
    }
    
    // Calculate day of week from challenge date
    const challengeDateObj = new Date(challengeDate + 'T12:00:00.000Z');
    const dayOfWeek = challengeDateObj.getDay();
    
    const { lastCompletionDate, weeklyCompletions } = get();
    
    // Check if already completed or failed this challenge
    if (lastCompletionDate === challengeDate) {
      return; // Already processed this challenge
    }
    
    const newWeeklyCompletions = [...weeklyCompletions];
    newWeeklyCompletions[dayOfWeek] = 'failed';
    
    set({
      weeklyCompletions: newWeeklyCompletions,
      lastCompletionDate: challengeDate,
      currentStreak: 0 // Failed attempts break the streak
    });

    // Save to localStorage
    get().saveStreakData();
  },
  
  
  hasPlayedToday: () => {
    const { gameState, lastCompletionDate, todayGameData } = get();
    const currentChallengeDate = gameState?.challenge?.date;
    
    if (!currentChallengeDate) {
      return null; // No challenge loaded
    }
    
    // Check both streak completion and today's game data for current challenge
    const streakCompleted = lastCompletionDate === currentChallengeDate;
    const gameCompleted = todayGameData && todayGameData.completionDate === currentChallengeDate;
    
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
