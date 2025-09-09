export const getDayNames = (language?: string): string[] => {
  const currentLang = language || (typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en');
  
  if (currentLang === 'es') {
    return ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  } else {
    return ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  }
};

export const shouldShowStreak = (
  currentStreak: number, 
  weeklyCompletions: Array<string | null>
): boolean => {
  // Show if there's a current streak OR if any day has been played (completed, failed, or missed)
  const hasStreak = currentStreak > 0;
  const hasCompletions = weeklyCompletions.some(day => day !== null);
  
  return hasStreak || hasCompletions;
};

export const getCurrentDay = (): number => {
  return new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const shouldShowSymbol = (
  index: number, 
  currentDay: number, 
  showCurrentDaySymbol: boolean
): boolean => {
  return index < currentDay || (index === currentDay && showCurrentDaySymbol);
};