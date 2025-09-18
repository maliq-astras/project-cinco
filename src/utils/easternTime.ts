/**
 * Eastern Time utilities for consistent challenge timing
 * All daily challenges sync to Eastern Time midnight globally
 */

export const getEasternTime = (): Date => {
  const now = new Date();
  // Convert to Eastern Time using Intl API (handles EST/EDT automatically)
  const easternTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  return easternTime;
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
  const now = new Date();
  const easternTime = getEasternTime();

  // Create next Eastern midnight
  const nextEasternMidnight = new Date(easternTime);
  nextEasternMidnight.setDate(easternTime.getDate() + 1);
  nextEasternMidnight.setHours(0, 0, 0, 0);

  // Convert back to UTC for comparison
  const nextMidnightUTC = new Date(nextEasternMidnight.toLocaleString("en-US", { timeZone: "UTC" }));

  const timeDiff = nextMidnightUTC.getTime() - now.getTime();

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, totalMs: timeDiff };
};

export const wasEasternYesterday = (dateString: string): boolean => {
  const easternTime = getEasternTime();

  const yesterday = new Date(easternTime);
  yesterday.setDate(easternTime.getDate() - 1);
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