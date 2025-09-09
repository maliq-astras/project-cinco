import React, { useEffect, useMemo } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getDayNames, shouldShowStreak as calculateShouldShowStreak, getCurrentDay } from '../helpers';

interface UseStreakDisplayLogicProps {
  shouldAnimate: boolean;
  animatedDays: boolean[];
  setAnimatedDays: React.Dispatch<React.SetStateAction<boolean[]>>;
  hasAnimated: boolean;
  setHasAnimated: React.Dispatch<React.SetStateAction<boolean>>;
  showCurrentDaySymbol: boolean;
  setShowCurrentDaySymbol: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useStreakDisplayLogic = ({
  shouldAnimate,
  animatedDays,
  setAnimatedDays,
  hasAnimated,
  setHasAnimated,
  showCurrentDaySymbol,
  setShowCurrentDaySymbol
}: UseStreakDisplayLogicProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  // Get streak data from store
  const currentStreak = useGameStore(state => state.currentStreak);
  const weeklyCompletions = useGameStore(state => state.weeklyCompletions);
  const updateMissedDays = useGameStore(state => state.updateMissedDays);

  // Animation values for the ticking counter
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0.3 });
  const displayValue = useTransform(springValue, (value) => Math.round(value));
  
  // Get current day for enhanced animation
  const currentDay = getCurrentDay();

  // Update missed days when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      updateMissedDays();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [updateMissedDays]);

  // Set initial state based on shouldAnimate
  useEffect(() => {
    setShowCurrentDaySymbol(!shouldAnimate);
  }, [shouldAnimate, setShowCurrentDaySymbol]);

  // Animate the counter when shouldAnimate is true
  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      const timer = setTimeout(() => {
        motionValue.set(currentStreak);
        setHasAnimated(true);
      }, 400);
      
      return () => clearTimeout(timer);
    } else if (!shouldAnimate) {
      motionValue.set(currentStreak);
    }
  }, [shouldAnimate, currentStreak, motionValue, hasAnimated, setHasAnimated]);

  // Show current day symbol after the appropriate delay
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShowCurrentDaySymbol(true);
      }, 400 + currentDay * 100);
      
      return () => clearTimeout(timer);
    } else {
      setShowCurrentDaySymbol(true);
    }
  }, [shouldAnimate, currentDay, setShowCurrentDaySymbol]);

  // Get day names based on current language
  const dayNames = useMemo(() => getDayNames(), []);
  
  // Determine if we should show the streak display
  const shouldShow = useMemo(() => 
    calculateShouldShowStreak(currentStreak, weeklyCompletions), 
    [currentStreak, weeklyCompletions]
  );

  // Progressive animation effect
  useEffect(() => {
    if (!shouldShow) return;
    
    // Reset all animations
    setAnimatedDays([false, false, false, false, false, false, false]);
    
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
      }, dayIndex * 150);
    };
    
    // Start animation from Sunday (index 0)
    animateDay(0);
  }, [shouldShow, weeklyCompletions, currentStreak, currentDay, setAnimatedDays]);

  return {
    currentStreak,
    weeklyCompletions,
    dayNames,
    colors,
    shouldShow,
    currentDay,
    displayValue,
    motionValue,
    t
  };
};