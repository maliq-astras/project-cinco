import {
  getEasternDateString,
  wasEasternYesterday,
  formatEasternCountdown
} from '../../src/utils/easternTime';

// Simple Date mocking for consistent testing
const originalDate = global.Date;

const mockDate = (dateString: string) => {
  const mockNow = new originalDate(dateString);
  global.Date = jest.fn(() => mockNow) as any;
  global.Date.now = jest.fn(() => mockNow.getTime());
  // Copy over static methods and prototype
  Object.setPrototypeOf(global.Date, originalDate);
  Object.getOwnPropertyNames(originalDate).forEach(name => {
    if (name !== 'length' && name !== 'name' && name !== 'prototype') {
      (global.Date as any)[name] = (originalDate as any)[name];
    }
  });
};

const restoreDate = () => {
  global.Date = originalDate;
};

describe('Eastern Time Utilities', () => {
  afterEach(() => {
    restoreDate();
  });

  describe('getEasternDateString', () => {
    it('should return YYYY-MM-DD format for Eastern date', () => {
      // Mock UTC time that translates to specific Eastern date
      mockDate('2025-09-23T04:00:00.000Z'); // 12:00 AM EDT on Sept 23

      const dateString = getEasternDateString();
      
      expect(dateString).toBe('2025-09-23');
      expect(dateString).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should handle timezone boundary correctly', () => {
      // Mock UTC time that is Sept 24 in UTC but Sept 23 in Eastern
      mockDate('2025-09-24T03:59:59.999Z'); // 11:59:59 PM EDT on Sept 23

      const dateString = getEasternDateString();
      
      expect(dateString).toBe('2025-09-23'); // Should be Sept 23 in Eastern
    });

    it('should handle date rollover correctly', () => {
      // Mock UTC time that is Sept 23 in UTC but Sept 24 in Eastern
      mockDate('2025-09-23T04:00:01.000Z'); // 12:00:01 AM EDT on Sept 24

      const dateString = getEasternDateString();
      
      expect(dateString).toBe('2025-09-23'); // Should be Sept 23 in Eastern
    });

    it('should handle DST transitions', () => {
      // Test during spring DST transition
      mockDate('2025-03-09T07:00:00.000Z'); // Spring forward day
      expect(getEasternDateString()).toBe('2025-03-09');
      
      // Test during fall DST transition
      mockDate('2025-11-02T06:00:00.000Z'); // Fall back day
      expect(getEasternDateString()).toBe('2025-11-02');
    });
  });

  describe('wasEasternYesterday', () => {
    it('should correctly identify yesterday\'s date', () => {
      // Mock Sept 24, 2025
      mockDate('2025-09-24T04:00:00.000Z'); // Midnight EDT on Sept 24

      const result = wasEasternYesterday('2025-09-23');
      
      expect(result).toBe(true);
    });

    it('should return false for today\'s date', () => {
      // Mock Sept 23, 2025
      mockDate('2025-09-23T04:00:00.000Z'); // Midnight EDT on Sept 23

      const result = wasEasternYesterday('2025-09-23');
      
      expect(result).toBe(false);
    });

    it('should return false for dates that are not yesterday', () => {
      // Mock Sept 25, 2025
      mockDate('2025-09-25T04:00:00.000Z'); // Midnight EDT on Sept 25

      const result = wasEasternYesterday('2025-09-23'); // Two days ago
      
      expect(result).toBe(false);
    });

    it('should handle month boundaries', () => {
      // Mock Oct 1, 2025
      mockDate('2025-10-01T04:00:00.000Z'); // Midnight EDT on Oct 1

      const result = wasEasternYesterday('2025-09-30');
      
      expect(result).toBe(true);
    });

    it('should handle invalid date strings gracefully', () => {
      mockDate('2025-09-23T04:00:00.000Z');

      // Test with invalid date formats
      expect(wasEasternYesterday('invalid-date')).toBe(false);
      expect(wasEasternYesterday('')).toBe(false);
      expect(wasEasternYesterday('2025-13-45')).toBe(false); // Invalid month/day
    });
  });

  describe('Edge cases', () => {
    it('should handle leap year correctly', () => {
      // Mock Feb 29, 2024 (leap year)
      mockDate('2024-02-29T05:00:00.000Z'); // Midnight EST

      const dateString = getEasternDateString();
      expect(dateString).toBe('2024-02-29');
    });

    it('should handle year boundaries', () => {
      // Mock New Year's Eve
      mockDate('2025-01-01T05:00:00.000Z'); // Midnight EST on Jan 1

      const dateString = getEasternDateString();
      const wasYesterday = wasEasternYesterday('2024-12-31');
      
      expect(dateString).toBe('2025-01-01');
      expect(wasYesterday).toBe(true);
    });
  });
});
