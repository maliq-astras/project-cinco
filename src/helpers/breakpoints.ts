/**
 * Unified Breakpoint System
 * 
 * Replaces the complex device detection system with a simple, standard breakpoint approach.
 * Based on common device sizes and responsive design best practices.
 * PRIORITIZES HEIGHT over width for no-scroll pages with vertically stacked elements.
 */

export const BREAKPOINTS = {
  xs: 0,    // 0-479px (Small phones)
  sm: 480,  // 480-767px (Large phones, small tablets)
  md: 768,  // 768-1023px (Tablets, small laptops)
  lg: 1024, // 1024-1279px (Laptops, desktops)
  xl: 1280  // 1280px+ (Large desktops, 4K)
} as const;

export const HEIGHT_BREAKPOINTS = {
  short: 600,   // Short screens (landscape phones, small tablets)
  medium: 800,  // Medium screens (portrait phones, tablets)
  tall: 1000    // Tall screens (desktops, large tablets)
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type BreakpointValue = typeof BREAKPOINTS[Breakpoint];
export type HeightBreakpoint = keyof typeof HEIGHT_BREAKPOINTS;

/**
 * Get the current breakpoint based on window width
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Get the current height breakpoint based on window height
 * This is MORE important than width for no-scroll pages
 */
export const getHeightBreakpoint = (height: number): HeightBreakpoint => {
  if (height >= HEIGHT_BREAKPOINTS.tall) return 'tall';
  if (height >= HEIGHT_BREAKPOINTS.medium) return 'medium';
  return 'short';
};

/**
 * Check if current width is at or above a specific breakpoint
 */
export const isBreakpointOrAbove = (width: number, breakpoint: Breakpoint): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Check if current width is below a specific breakpoint
 */
export const isBreakpointBelow = (width: number, breakpoint: Breakpoint): boolean => {
  return width < BREAKPOINTS[breakpoint];
};

/**
 * Check if current height is at or above a specific height breakpoint
 * This is MORE important than width checks for no-scroll pages
 */
export const isHeightBreakpointOrAbove = (height: number, breakpoint: HeightBreakpoint): boolean => {
  return height >= HEIGHT_BREAKPOINTS[breakpoint];
};

/**
 * Check if current height is below a specific height breakpoint
 * This is MORE important than width checks for no-scroll pages
 */
export const isHeightBreakpointBelow = (height: number, breakpoint: HeightBreakpoint): boolean => {
  return height < HEIGHT_BREAKPOINTS[breakpoint];
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
 * Get responsive value based on both width and height breakpoints
 * PRIORITIZES HEIGHT for no-scroll pages with vertically stacked elements
 */
export const getResponsiveValueWithHeight = <T>(
  widthValues: Record<Breakpoint, T>,
  heightValues: Record<HeightBreakpoint, T>,
  currentWidthBreakpoint: Breakpoint,
  currentHeightBreakpoint: HeightBreakpoint,
  priority: 'width' | 'height' = 'height' // Default to height priority
): T => {
  if (priority === 'height') {
    return heightValues[currentHeightBreakpoint];
  }
  return widthValues[currentWidthBreakpoint];
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
 * Get orientation-aware responsive value
 * PRIORITIZES HEIGHT for no-scroll pages
 */
export const getOrientationResponsiveValue = <T>(
  landscapeValues: Record<Breakpoint, T>,
  portraitValues: Record<Breakpoint, T>,
  width: number,
  height: number
): T => {
  const breakpoint = getBreakpoint(width);
  return isLandscape(width, height) ? landscapeValues[breakpoint] : portraitValues[breakpoint];
};

/**
 * Get PRIMARY responsive value for no-scroll pages
 * This should be used for most responsive decisions in this app
 * PRIORITIZES HEIGHT over width
 */
export const getPrimaryResponsiveValue = <T>(
  heightValues: Record<HeightBreakpoint, T>,
  widthValues: Record<Breakpoint, T>,
  width: number,
  height: number
): T => {
  const heightBreakpoint = getHeightBreakpoint(height);
  const widthBreakpoint = getBreakpoint(width);
  
  // For no-scroll pages, height is more critical
  // Use height values when available, fall back to width
  return heightValues[heightBreakpoint] ?? widthValues[widthBreakpoint];
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
