import { daysBetweenDateStrings, selectChallengeForDate } from '../../src/utils/challengeSchedule';

const roster = [
  { challengeId: 'a', date: '2026-01-01' },
  { challengeId: 'b', date: '2026-01-02' },
  { challengeId: 'c', date: '2026-01-03' },
];

describe('selectChallengeForDate', () => {
  it('returns the challenge scheduled for today', () => {
    const selected = selectChallengeForDate(roster, '2026-01-02');

    expect(selected).toEqual({
      challenge: roster[1],
      recycled: false,
    });
  });

  it('wraps to the first challenge the day after the schedule ends', () => {
    const selected = selectChallengeForDate(roster, '2026-01-04');

    expect(selected).toEqual({
      challenge: { challengeId: 'a', date: '2026-01-04' },
      recycled: true,
    });
  });

  it('keeps advancing one challenge per day across later cycles', () => {
    const selected = selectChallengeForDate(roster, '2026-01-05');

    expect(selected).toEqual({
      challenge: { challengeId: 'b', date: '2026-01-05' },
      recycled: true,
    });
  });

  it('still serves a challenge when today is before the schedule', () => {
    const selected = selectChallengeForDate(roster, '2025-12-31');

    expect(selected?.recycled).toBe(true);
    expect(selected?.challenge.date).toBe('2025-12-31');
    expect(selected?.challenge.challengeId).toBe('c');
  });

  it('recycles across a gap inside the schedule', () => {
    const gapped = [
      { challengeId: 'a', date: '2026-01-01' },
      { challengeId: 'c', date: '2026-01-03' },
    ];

    const selected = selectChallengeForDate(gapped, '2026-01-02');

    expect(selected).toEqual({
      challenge: { challengeId: 'c', date: '2026-01-02' },
      recycled: true,
    });
  });

  it('returns null when there are no challenges', () => {
    expect(selectChallengeForDate([], '2026-10-15')).toBeNull();
  });
});

describe('daysBetweenDateStrings', () => {
  it('counts whole calendar days', () => {
    expect(daysBetweenDateStrings('2026-01-01', '2026-01-04')).toBe(3);
  });

  it('returns null for a date that cannot be parsed', () => {
    expect(daysBetweenDateStrings('not-a-date', '2026-01-04')).toBeNull();
  });
});
