import { describe, it, expect } from 'vitest';
import { calculateNextReview, LEITNER_INTERVALS_DAYS, formatISODate } from '../srsAlgorithm';

describe('SRS Leitner Algorithm', () => {
  const fixedBaseDate = new Date(2026, 9, 17); // 2026-10-17

  it('promotes level by +1 on rating "good"', () => {
    const result = calculateNextReview(1, 'good', fixedBaseDate);
    expect(result.newLevel).toBe(2);
    expect(result.intervalDays).toBe(LEITNER_INTERVALS_DAYS[2]);
    expect(result.isLapse).toBe(false);
  });

  it('promotes level by +2 on rating "easy" capped at level 5', () => {
    const result = calculateNextReview(2, 'easy', fixedBaseDate);
    expect(result.newLevel).toBe(4);

    const maxResult = calculateNextReview(4, 'easy', fixedBaseDate);
    expect(maxResult.newLevel).toBe(5);
  });

  it('keeps current level on rating "hard"', () => {
    const result = calculateNextReview(3, 'hard', fixedBaseDate);
    expect(result.newLevel).toBe(3);
    expect(result.intervalDays).toBe(LEITNER_INTERVALS_DAYS[3]);
    expect(result.isLapse).toBe(false);
  });

  it('resets level to 1 on rating "again" and flags lapse when level > 1', () => {
    const result = calculateNextReview(4, 'again', fixedBaseDate);
    expect(result.newLevel).toBe(1);
    expect(result.intervalDays).toBe(1);
    expect(result.isLapse).toBe(true);

    const fromLevelOne = calculateNextReview(1, 'again', fixedBaseDate);
    expect(fromLevelOne.newLevel).toBe(1);
    expect(fromLevelOne.isLapse).toBe(false);
  });

  it('formats dates to standard ISO YYYY-MM-DD correctly', () => {
    const testDate = new Date(2026, 0, 5); // 5 Jan 2026
    expect(formatISODate(testDate)).toBe('2026-01-05');
  });
});
