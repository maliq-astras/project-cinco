const MS_PER_DAY = 86_400_000;

/**
 * Whole days from startDate to endDate. Both values are YYYY-MM-DD.
 * Returns null when either value is not a real calendar date.
 */
export function daysBetweenDateStrings(startDate: string, endDate: string): number | null {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.round((end - start) / MS_PER_DAY);
}

/**
 * Pick the challenge for a calendar day.
 *
 * A challenge whose stored date matches `today` is used as-is.
 * Once the schedule runs out (or skips a day), the roster repeats in date
 * order. The copy served for that day has `date` set to today so streaks
 * and the daily reset keep treating it as the current puzzle.
 */
export function selectChallengeForDate<T extends { date: string }>(
  challenges: T[],
  today: string
): { challenge: T; recycled: boolean } | null {
  if (challenges.length === 0) return null;

  const ordered = [...challenges].sort((a, b) => a.date.localeCompare(b.date));
  const exact = ordered.find((challenge) => challenge.date === today);
  if (exact) {
    return { challenge: exact, recycled: false };
  }

  const elapsed = daysBetweenDateStrings(ordered[0].date, today);
  const rosterSize = ordered.length;
  const index = elapsed === null
    ? 0
    : ((elapsed % rosterSize) + rosterSize) % rosterSize;

  return {
    challenge: {
      ...ordered[index],
      date: today,
    },
    recycled: true,
  };
}
