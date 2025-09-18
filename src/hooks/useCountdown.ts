import { useState, useEffect } from 'react';
import { getTimeUntilEasternMidnight } from '@/utils/easternTime';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export const useCountdown = () => {
  const [timeUntilNext, setTimeUntilNext] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const { hours, minutes, seconds } = getTimeUntilEasternMidnight();
      setTimeUntilNext({ hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = () => {
    const { hours, minutes, seconds } = timeUntilNext;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return {
    timeUntilNext,
    formatCountdown
  };
};