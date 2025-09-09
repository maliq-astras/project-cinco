import styles from '../StreakDisplay.module.css';

export const streakDisplayStyles = {
  container: styles.container,
  flameSection: styles.flameSection,
  flameIcon: styles.flameIcon,
  streakText: styles.streakText,
  streakNumber: styles.streakNumber,
  streakLabel: styles.streakLabel,
  calendar: styles.calendar,
  calendarGrid: styles.calendarGrid,
  dayColumn: styles.dayColumn,
  dayLabel: styles.dayLabel,
  dayIndicator: styles.dayIndicator,
  completedDay: styles.completedDay,
  failedDay: styles.failedDay,
  missedDay: styles.missedDay,
  futureDay: styles.futureDay,
  transparentDay: styles.transparentDay,
  checkmark: styles.checkmark,
  completedSymbol: styles.completedSymbol,
  failedSymbol: styles.failedSymbol
} as const;

export const getFlameIconStyle = (currentStreak: number, primaryColor: string) => ({
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
  backgroundColor: `var(--color-${primaryColor})`
});

export const getDayIndicatorStyle = (
  index: number,
  currentDay: number,
  weeklyCompletions: Array<string | null>,
  primaryColor: string,
  showCurrentDaySymbol: boolean
) => {
  // Current day logic
  if (index === currentDay) {
    // If symbol hasn't appeared yet, transparent
    if (!showCurrentDaySymbol) {
      return 'transparent';
    }
    // If symbol is showing, use theme color for completed/failed
    if (weeklyCompletions[index] === 'completed' || weeklyCompletions[index] === 'failed') {
      return `var(--color-${primaryColor})`;
    }
    if (weeklyCompletions[index] === 'missed') {
      return 'var(--color-gray-400)';
    }
    return 'transparent';
  }
  
  // Past days
  if (index < currentDay) {
    if (weeklyCompletions[index] === 'completed' || weeklyCompletions[index] === 'failed') {
      return `var(--color-${primaryColor})`;
    }
    if (weeklyCompletions[index] === 'missed') {
      return 'var(--color-gray-400)';
    }
    return 'var(--color-gray-300)';
  }
  
  // Future days
  return 'var(--color-gray-300)';
};