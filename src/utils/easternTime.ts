/**
 * Eastern Time utilities for consistent challenge timing
 * All daily challenges sync to Eastern Time midnight globally
 */

export const getEasternTime = (): Date => {
  const now = new Date();

  // Get Eastern Time offset in minutes (handles EST/EDT automatically)
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
  const easternDateStr = `${easternParts.find(p => p.type === 'year')?.value}-${easternParts.find(p => p.type === 'month')?.value}-${easternParts.find(p => p.type === 'day')?.value}T${easternParts.find(p => p.type === 'hour')?.value}:${easternParts.find(p => p.type === 'minute')?.value}:${easternParts.find(p => p.type === 'second')?.value}`;

  return new Date(easternDateStr);
};

export const getEasternDateString = (): string => {
  const easternTime = getEasternTime();
  return easternTime.toISOString().split('T')[0]; // YYYY-MM-DD format
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
  const easternTime = getEasternTime();

  const yesterday = new Date(easternTime);
  yesterday.setDate(yesterday.getDate() - 1);
  const easternYesterday = yesterday.toISOString().split('T')[0];

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