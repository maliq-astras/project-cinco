'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStreakDisplay } from './hooks';
import { 
  streakDisplayAnimations, 
  streakDisplayStyles, 
  getFlameIconStyle, 
  getDayIndicatorStyle,
  shouldShowSymbol
} from './helpers';

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
    showCurrentDaySymbol,
    shouldShow,
    currentDay,
    displayValue,
    t
  } = useStreakDisplay({ shouldAnimate });
  
  // Don't show anything if streak is 0 or no days completed
  if (!shouldShow) {
    return null;
  }
  
  return (
    <div
      className={`${streakDisplayStyles.container} ${className}`}
    >
      {/* Flame icon and streak count */}
      <div className={streakDisplayStyles.flameSection}>
        <div className={streakDisplayStyles.flameIcon}>
          <div style={getFlameIconStyle(currentStreak, colors.primary)} />
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
                className={`${streakDisplayStyles.dayIndicator} border-gray-800`}
                style={{
                  borderColor: `var(--color-${colors.primary})`
                }}
                {...streakDisplayAnimations.dayIndicator(
                  shouldAnimate,
                  index,
                  animatedDays,
                  getDayIndicatorStyle(
                    index,
                    currentDay,
                    weeklyCompletions,
                    colors.primary,
                    showCurrentDaySymbol
                  )
                )}
              >
                {weeklyCompletions[index] === 'completed' && shouldShowSymbol(index, currentDay, showCurrentDaySymbol) && (
                  <motion.div
                    className={`${streakDisplayStyles.checkmark} ${streakDisplayStyles.completedSymbol}`}
                    style={{ color: 'white' }}
                    {...streakDisplayAnimations.completedSymbol(shouldAnimate, index, currentDay)}
                  >
                    ✔
                  </motion.div>
                )}
                {weeklyCompletions[index] === 'failed' && shouldShowSymbol(index, currentDay, showCurrentDaySymbol) && (
                  <motion.div
                    className={`${streakDisplayStyles.checkmark} ${streakDisplayStyles.failedSymbol}`}
                    style={{ color: 'white' }}
                    {...streakDisplayAnimations.failedSymbol(shouldAnimate, index, currentDay)}
                  >
                    ✖
                  </motion.div>
                )}
                {(weeklyCompletions[index] === 'missed' || (weeklyCompletions[index] === null && index < currentDay)) && shouldShowSymbol(index, currentDay, showCurrentDaySymbol) && (
                  <motion.div
                    className={streakDisplayStyles.checkmark}
                    style={{ color: `var(--color-${colors.dark})` }}
                    {...streakDisplayAnimations.missedSymbol(shouldAnimate, index, currentDay)}
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