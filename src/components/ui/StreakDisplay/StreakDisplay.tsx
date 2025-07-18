'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useStreakDisplay } from './useStreakDisplay';
import { streakDisplayStyles } from './StreakDisplay.styles';
import { useTranslation } from 'react-i18next';

interface StreakDisplayProps {
  className?: string;
  shouldAnimate?: boolean;
}

/**
 * Displays the current streak with flame icon and weekly calendar
 */
export default function StreakDisplay({ className = '', shouldAnimate = false }: StreakDisplayProps) {
  const {
    currentStreak,
    weeklyCompletions,
    dayNames,
    colors,
    animatedDays,
    shouldShowStreak
  } = useStreakDisplay();
  
  const { t } = useTranslation();
  
  // Animation values for the ticking counter
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0.3 });
  const displayValue = useTransform(springValue, (value) => Math.round(value));
  
  // Get current day for enhanced animation
  const currentDay = new Date().getDay();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showCurrentDaySymbol, setShowCurrentDaySymbol] = useState(!shouldAnimate);
  
  // Animate the counter when shouldAnimate is true
  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      // Delay the counter animation to start after the streak display appears
      const timer = setTimeout(() => {
        motionValue.set(currentStreak);
        setHasAnimated(true);
      }, 400); // Increased delay since streak appears first
      
      return () => clearTimeout(timer);
    } else if (!shouldAnimate) {
      motionValue.set(currentStreak);
    }
  }, [shouldAnimate, currentStreak, motionValue, hasAnimated]);

  // Show current day symbol after the appropriate delay
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShowCurrentDaySymbol(true);
      }, 400 + currentDay * 100); // Same delay as the symbol animation
      
      return () => clearTimeout(timer);
    } else {
      setShowCurrentDaySymbol(true);
    }
  }, [shouldAnimate, currentDay]);
  
  // Don't show anything if streak is 0 or no days completed
  if (!shouldShowStreak) {
    return null;
  }
  
  return (
    <div
      className={`${streakDisplayStyles.container} ${className}`}
    >
      {/* Flame icon and streak count */}
      <div className={streakDisplayStyles.flameSection}>
        <div className={streakDisplayStyles.flameIcon}>
          <div 
            style={{ 
              width: '40px',
              height: '40px',
              maskImage: `url(/icons/${currentStreak === 0 ? 'ice' : 'flame'}.svg)`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url(/icons/${currentStreak === 0 ? 'ice' : 'flame'}.svg)`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              backgroundColor: `var(--color-${colors.primary})`
            }}
          />
        </div>
        <div className={streakDisplayStyles.streakText}>
          <motion.span 
            className={streakDisplayStyles.streakNumber}
            style={{ color: `var(--color-${colors.primary})` }}
          >
            {shouldAnimate ? displayValue : currentStreak}
          </motion.span>
          <span className={streakDisplayStyles.streakLabel}>
            {t('game.streak.dayStreak')}
          </span>
        </div>
      </div>
      
      {/* Weekly calendar */}
      <div className={streakDisplayStyles.calendar}>
        <div className={streakDisplayStyles.calendarGrid}>
          {dayNames.map((day, index) => (
            <div key={day} className={streakDisplayStyles.dayColumn}>
              <div className={streakDisplayStyles.dayLabel}>
                {day}
              </div>
                            <motion.div
                className={`${streakDisplayStyles.dayIndicator} ${
                  index < currentDay || (index === currentDay && showCurrentDaySymbol)
                    ? (weeklyCompletions[index] === 'completed' ? streakDisplayStyles.completedDay :
                       weeklyCompletions[index] === 'failed' ? streakDisplayStyles.failedDay :
                       weeklyCompletions[index] === 'missed' ? streakDisplayStyles.missedDay :
                       streakDisplayStyles.futureDay)
                    : index === currentDay && !showCurrentDaySymbol
                    ? streakDisplayStyles.transparentDay
                    : ''
                } border-gray-800`}
                style={{
                  backgroundColor: (() => {
                                         // Current day logic
                     if (index === currentDay) {
                       // If symbol hasn't appeared yet, transparent
                       if (!showCurrentDaySymbol) {
                         return 'transparent';
                       }
                      // If symbol is showing, use theme color for completed/failed
                      if (weeklyCompletions[index] === 'completed' || weeklyCompletions[index] === 'failed') {
                        return `var(--color-${colors.primary})`;
                      }
                      if (weeklyCompletions[index] === 'missed') {
                        return 'var(--color-gray-400)';
                      }
                      return 'transparent';
                    }
                    
                    // Past days
                    if (index < currentDay) {
                      if (weeklyCompletions[index] === 'completed' || weeklyCompletions[index] === 'failed') {
                        return `var(--color-${colors.primary})`;
                      }
                      if (weeklyCompletions[index] === 'missed') {
                        return 'var(--color-gray-400)';
                      }
                      return 'var(--color-gray-300)';
                    }
                    
                    // Future days
                    return 'var(--color-gray-300)';
                  })(),
                  borderColor: `var(--color-${colors.primary})`
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: animatedDays[index] ? 1 : 0.8,
                  opacity: animatedDays[index] ? 1 : 0.5
                }}
                transition={{ 
                  duration: 0.3,
                  delay: shouldAnimate ? index * 0.1 : 0
                }}
              >
                {weeklyCompletions[index] === 'completed' && (index < currentDay || (index === currentDay && showCurrentDaySymbol)) && (
                  <motion.div
                    className={`${streakDisplayStyles.checkmark} ${streakDisplayStyles.completedSymbol}`}
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.4,
                      delay: shouldAnimate ? 
                        (index === currentDay ? 0.4 + index * 0.1 : index * 0.1) : 0,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    ✔
                  </motion.div>
                )}
                {weeklyCompletions[index] === 'failed' && (index < currentDay || (index === currentDay && showCurrentDaySymbol)) && (
                  <motion.div
                    className={`${streakDisplayStyles.checkmark} ${streakDisplayStyles.failedSymbol}`}
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.4,
                      delay: shouldAnimate ? 
                        (index === currentDay ? 0.4 + index * 0.1 : index * 0.1) : 0,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    ✖
                  </motion.div>
                )}
                {weeklyCompletions[index] === 'missed' && (index < currentDay || (index === currentDay && showCurrentDaySymbol)) && (
                  <motion.div
                    className={streakDisplayStyles.checkmark}
                    style={{ color: `var(--color-${colors.dark})` }}
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.4,
                      delay: shouldAnimate ? 
                        (index === currentDay ? 0.4 + index * 0.1 : index * 0.1) : 0,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    –
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 