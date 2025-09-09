import { useState } from 'react';

export const useStreakDisplayState = () => {
  const [animatedDays, setAnimatedDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showCurrentDaySymbol, setShowCurrentDaySymbol] = useState(false);

  return {
    animatedDays,
    setAnimatedDays,
    hasAnimated,
    setHasAnimated,
    showCurrentDaySymbol,
    setShowCurrentDaySymbol
  };
};