/**
 * Eastern Time utilities for consistent challenge timing
 * All daily challenges sync to Eastern Time midnight globally
 */

export const getEasternTime = (): Date => {
  const now = new Date();

  // Get Eastern Time using proper timezone conversion
  const easternFormatter = new Intl.DateTimeFormat('en', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const easternParts = easternFormatter.formatToParts(now);
  
  // Extract the parts
  const year = parseInt(easternParts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(easternParts.find(p => p.type === 'month')?.value || '0') - 1; // Month is 0-indexed
  const day = parseInt(easternParts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(easternParts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(easternParts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(easternParts.find(p => p.type === 'second')?.value || '0');
  
  // Create a Date object that represents the Eastern time
  // Note: This creates a local Date object with Eastern time values
  return new Date(year, month, day, hour, minute, second);
};

export const getEasternDateString = (): string => {
  const now = new Date();
  
  // Get Eastern date directly using Intl.DateTimeFormat
  const easternFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // This returns YYYY-MM-DD format directly
  return easternFormatter.format(now);
};

export const getEasternDayOfWeek = (): number => {
  const easternTime = getEasternTime();
  return easternTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const getTimeUntilEasternMidnight = (): {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} => {
  // Get current time in Eastern timezone
  const easternNow = getEasternTime();

  // Create next Eastern midnight by adding one day and setting to start of day
  const nextEasternMidnight = new Date(easternNow);
  nextEasternMidnight.setDate(nextEasternMidnight.getDate() + 1);
  nextEasternMidnight.setHours(0, 0, 0, 0);

  // Calculate time difference
  const timeDiff = nextEasternMidnight.getTime() - easternNow.getTime();

  // Handle negative values (shouldn't happen, but safety check)
  const safeDiff = Math.max(0, timeDiff);

  const hours = Math.floor(safeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((safeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((safeDiff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, totalMs: safeDiff };
};

export const wasEasternYesterday = (dateString: string): boolean => {
  // Get yesterday's date in Eastern Time
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Format yesterday's date using Eastern timezone
  const easternFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const easternYesterday = easternFormatter.format(yesterday);
  return dateString === easternYesterday;
};

export const formatEasternCountdown = (): string => {
  const { hours, minutes, seconds } = getTimeUntilEasternMidnight();

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};