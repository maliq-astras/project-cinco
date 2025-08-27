/**
 * Unified Breakpoint System
 * 
 * Combined width and height breakpoints for no-scroll pages.
 * Each breakpoint considers both dimensions to ensure proper fit.
 */

export const BREAKPOINTS = {
  xs: { minWidth: 375, minHeight: 600 },   // Small phones
  sm: { minWidth: 480, minHeight: 700 },   // Large phones 
  md: { minWidth: 768, minHeight: 800 },   // Tablets, small laptops
  lg: { minWidth: 1024, minHeight: 900 },  // Laptops, desktops
  xl: { minWidth: 1280, minHeight: 1000 }, // Large desktops and above
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type BreakpointValue = typeof BREAKPOINTS[Breakpoint];

/**
 * Get the current breakpoint based on both width and height
 * Prioritizes the more constrained dimension for no-scroll pages
 */
export const getBreakpoint = (width: number, height: number): Breakpoint => {
  // Check from largest to smallest breakpoint
  if (width >= BREAKPOINTS.xl.minWidth && height >= BREAKPOINTS.xl.minHeight) return 'xl';
  if (width >= BREAKPOINTS.lg.minWidth && height >= BREAKPOINTS.lg.minHeight) return 'lg';
  if (width >= BREAKPOINTS.md.minWidth && height >= BREAKPOINTS.md.minHeight) return 'md';
  if (width >= BREAKPOINTS.sm.minWidth && height >= BREAKPOINTS.sm.minHeight) return 'sm';
  return 'xs';
};

/**
 * Check if current dimensions are at or above a specific breakpoint
 */
export const isBreakpointOrAbove = (width: number, height: number, breakpoint: Breakpoint): boolean => {
  const currentBreakpoint = getBreakpoint(width, height);
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  return currentIndex >= targetIndex;
};

/**
 * Check if current dimensions are below a specific breakpoint
 */
export const isBreakpointBelow = (width: number, height: number, breakpoint: Breakpoint): boolean => {
  return !isBreakpointOrAbove(width, height, breakpoint);
};

/**
 * Get responsive value based on breakpoint
 */
export const getResponsiveValue = <T>(
  values: Record<Breakpoint, T>,
  currentBreakpoint: Breakpoint
): T => {
  return values[currentBreakpoint];
};

/**
 * Get responsive value with fallback to smaller breakpoints
 */
export const getResponsiveValueWithFallback = <T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint
): T | undefined => {
  const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Check current breakpoint and all smaller ones
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
};

/**
 * Check if device is in landscape orientation
 */
export const isLandscape = (width: number, height: number): boolean => {
  return width > height;
};

/**
 * Check if device is in portrait orientation
 */
export const isPortrait = (width: number, height: number): boolean => {
  return height > width;
};

/**
 * Check if dimensions require mobile layout (narrow/cramped)
 * Mobile layout is used when:
 * - Width is less than 800px (too narrow for side-by-side)
 * - OR when screen is taller than wide with sufficient height (narrow tall windows)
 */
export const isMobileLayout = (width: number, height: number): boolean => {
  // Simple width cutoff for desktop
  if (width >= 800 && height <= width) return false;
  
  // Use mobile layout if width < 800 OR if it's a tall narrow window
  return width < 800 || (height > width && height > 1000);
};


/**
 * Determine optimal layout mode based on dimensions
 * Default to desktop layout unless screen is too constrained
 */
export const getLayoutMode = (width: number, height: number): 'mobile' | 'desktop' => {
  if (isMobileLayout(width, height)) return 'mobile';
  return 'desktop';
};

/**
 * Get orientation-aware responsive value
 */
export const getOrientationResponsiveValue = <T>(
  landscapeValues: Record<Breakpoint, T>,
  portraitValues: Record<Breakpoint, T>,
  width: number,
  height: number
): T => {
  const breakpoint = getBreakpoint(width, height);
  return isLandscape(width, height) ? landscapeValues[breakpoint] : portraitValues[breakpoint];
};

/**
 * Check if content will fit in available height
 * Critical for no-scroll pages
 */
export const willContentFitInHeight = (
  contentHeight: number,
  availableHeight: number,
  buffer: number = 20 // 20px buffer for safety
): boolean => {
  return contentHeight <= (availableHeight - buffer);
};

/**
 * Calculate available height for content
 * Accounts for fixed elements like header, navigation, etc.
 */
export const getAvailableContentHeight = (
  viewportHeight: number,
  fixedElementsHeight: number = 0
): number => {
  return viewportHeight - fixedElementsHeight;
};
