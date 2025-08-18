import { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export const useStreakDisplay = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  // Get streak data from store
  const currentStreak = useGameStore(state => state.currentStreak);
  const weeklyCompletions = useGameStore(state => state.weeklyCompletions);
  const updateMissedDays = useGameStore(state => state.updateMissedDays);
  

  
  // State for progressive animations
  const [animatedDays, setAnimatedDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  
  // Update missed days when component mounts (but not immediately after game completion)
  useEffect(() => {
    // Add a small delay to avoid interfering with game completion streak updates
    const timer = setTimeout(() => {
      updateMissedDays();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [updateMissedDays]);
  
  // Get day names based on current language
  const dayNames = useMemo(() => {
    const currentLang = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';
    
    if (currentLang === 'es') {
      return ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    } else {
      return ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
    }
  }, []);
  
  // Determine if we should show the streak display
  const shouldShowStreak = useMemo(() => {
    // Show if there's a current streak OR if any day has been played (completed, failed, or missed)
    const hasStreak = currentStreak > 0;
    const hasCompletions = weeklyCompletions.some(day => day !== null);
    
    return hasStreak || hasCompletions;
  }, [currentStreak, weeklyCompletions]);
  
  // Progressive animation effect
  useEffect(() => {
    if (!shouldShowStreak) return;
    
    // Reset all animations
    setAnimatedDays([false, false, false, false, false, false, false]);
    
    // Find the current day of the week
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Animate days progressively from Sunday to current day
    const animateDay = (dayIndex: number) => {
      if (dayIndex > currentDay) return;
      
      setTimeout(() => {
        setAnimatedDays(prev => {
          const newAnimated = [...prev];
          newAnimated[dayIndex] = true;
          return newAnimated;
        });
        
        // If this day has any state (completed, failed, or missed), animate the next day
        if (weeklyCompletions[dayIndex] !== null && dayIndex < currentDay) {
          animateDay(dayIndex + 1);
        }
      }, dayIndex * 150); // 150ms delay between each day
    };
    
    // Start animation from Sunday (index 0)
    animateDay(0);
  }, [shouldShowStreak, weeklyCompletions, currentStreak]);
  
  return {
    currentStreak,
    weeklyCompletions,
    dayNames,
    colors,
    animatedDays,
    shouldShowStreak
  };
}; 