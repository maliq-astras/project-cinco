/**
 * Tests for breakpoint system
 */

import { 
  getBreakpoint, 
  getHeightBreakpoint,
  isBreakpointOrAbove, 
  isBreakpointBelow,
  isHeightBreakpointOrAbove,
  isHeightBreakpointBelow,
  isLandscape,
  isPortrait,
  getOrientationResponsiveValue
} from '../../src/helpers/breakpoints';

describe('Breakpoint System', () => {
  describe('getBreakpoint', () => {
    it('should return correct breakpoint for different widths', () => {
      expect(getBreakpoint(375)).toBe('xs');
      expect(getBreakpoint(480)).toBe('sm');
      expect(getBreakpoint(768)).toBe('md');
      expect(getBreakpoint(1024)).toBe('lg');
      expect(getBreakpoint(1280)).toBe('xl');
    });
  });

  describe('getHeightBreakpoint', () => {
    it('should return correct height breakpoint for different heights', () => {
      expect(getHeightBreakpoint(500)).toBe('short');
      expect(getHeightBreakpoint(700)).toBe('medium');
      expect(getHeightBreakpoint(900)).toBe('tall');
    });
  });

  describe('isBreakpointOrAbove', () => {
    it('should return true for width at or above breakpoint', () => {
      expect(isBreakpointOrAbove(768, 'md')).toBe(true);
      expect(isBreakpointOrAbove(1024, 'md')).toBe(true);
    });

    it('should return false for width below breakpoint', () => {
      expect(isBreakpointOrAbove(767, 'md')).toBe(false);
      expect(isBreakpointOrAbove(480, 'md')).toBe(false);
    });
  });

  describe('isBreakpointBelow', () => {
    it('should return true for width below breakpoint', () => {
      expect(isBreakpointBelow(767, 'md')).toBe(true);
      expect(isBreakpointBelow(480, 'md')).toBe(true);
    });

    it('should return false for width at or above breakpoint', () => {
      expect(isBreakpointBelow(768, 'md')).toBe(false);
      expect(isBreakpointBelow(1024, 'md')).toBe(false);
    });
  });

  describe('isHeightBreakpointOrAbove', () => {
    it('should return true for height at or above breakpoint', () => {
      expect(isHeightBreakpointOrAbove(800, 'medium')).toBe(true);
      expect(isHeightBreakpointOrAbove(1000, 'medium')).toBe(true);
    });

    it('should return false for height below breakpoint', () => {
      expect(isHeightBreakpointOrAbove(799, 'medium')).toBe(false);
      expect(isHeightBreakpointOrAbove(500, 'medium')).toBe(false);
    });
  });

  describe('isHeightBreakpointBelow', () => {
    it('should return true for height below breakpoint', () => {
      expect(isHeightBreakpointBelow(799, 'medium')).toBe(true);
      expect(isHeightBreakpointBelow(500, 'medium')).toBe(true);
    });

    it('should return false for height at or above breakpoint', () => {
      expect(isHeightBreakpointBelow(800, 'medium')).toBe(false);
      expect(isHeightBreakpointBelow(1000, 'medium')).toBe(false);
    });
  });

  describe('Orientation Detection', () => {
    it('should detect landscape orientation', () => {
      expect(isLandscape(1024, 768)).toBe(true);
      expect(isLandscape(800, 600)).toBe(true);
    });

    it('should detect portrait orientation', () => {
      expect(isPortrait(768, 1024)).toBe(true);
      expect(isPortrait(375, 812)).toBe(true);
    });

    it('should return correct orientation-aware values', () => {
      const landscapeValues = { xs: 'landscape-xs', sm: 'landscape-sm', md: 'landscape-md', lg: 'landscape-lg', xl: 'landscape-xl' };
      const portraitValues = { xs: 'portrait-xs', sm: 'portrait-sm', md: 'portrait-md', lg: 'portrait-lg', xl: 'portrait-xl' };
      
      expect(getOrientationResponsiveValue(landscapeValues, portraitValues, 1024, 768)).toBe('landscape-lg');
      expect(getOrientationResponsiveValue(landscapeValues, portraitValues, 768, 1024)).toBe('portrait-md');
    });
  });
});
