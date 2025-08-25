/**
 * Tests for unified breakpoint system
 */

import { 
  getBreakpoint, 
  isBreakpointOrAbove, 
  isBreakpointBelow,
  isLandscape,
  isPortrait,
  getOrientationResponsiveValue
} from '../../src/helpers/breakpoints';

describe('Unified Breakpoint System', () => {
  describe('getBreakpoint', () => {
    it('should return correct breakpoint for different dimensions', () => {
      // xs: { minWidth: 0, minHeight: 0 }
      expect(getBreakpoint(375, 667)).toBe('xs');
      expect(getBreakpoint(480, 500)).toBe('xs'); // Height too small
      
      // sm: { minWidth: 480, minHeight: 600 }
      expect(getBreakpoint(480, 600)).toBe('sm');
      expect(getBreakpoint(768, 600)).toBe('sm'); // Width larger but height constraint
      expect(getBreakpoint(480, 800)).toBe('sm'); // Height larger but width constraint
      
      // md: { minWidth: 768, minHeight: 800 }
      expect(getBreakpoint(768, 800)).toBe('md');
      expect(getBreakpoint(1024, 800)).toBe('md');
      
      // lg: { minWidth: 1024, minHeight: 1000 }
      expect(getBreakpoint(1024, 1000)).toBe('lg');
      expect(getBreakpoint(1280, 1000)).toBe('lg');
      
      // xl: { minWidth: 1280, minHeight: 1000 }
      expect(getBreakpoint(1280, 1000)).toBe('xl');
      expect(getBreakpoint(1920, 1080)).toBe('xl');
    });
  });

  describe('isBreakpointOrAbove', () => {
    it('should return true for dimensions at or above breakpoint', () => {
      expect(isBreakpointOrAbove(768, 800, 'md')).toBe(true);
      expect(isBreakpointOrAbove(1024, 1000, 'md')).toBe(true);
    });

    it('should return false for dimensions below breakpoint', () => {
      expect(isBreakpointOrAbove(767, 800, 'md')).toBe(false); // Width too small
      expect(isBreakpointOrAbove(768, 799, 'md')).toBe(false); // Height too small
      expect(isBreakpointOrAbove(480, 600, 'md')).toBe(false); // Both too small
    });
  });

  describe('isBreakpointBelow', () => {
    it('should return true for dimensions below breakpoint', () => {
      expect(isBreakpointBelow(767, 800, 'md')).toBe(true);
      expect(isBreakpointBelow(768, 799, 'md')).toBe(true);
      expect(isBreakpointBelow(480, 600, 'md')).toBe(true);
    });

    it('should return false for dimensions at or above breakpoint', () => {
      expect(isBreakpointBelow(768, 800, 'md')).toBe(false);
      expect(isBreakpointBelow(1024, 1000, 'md')).toBe(false);
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
