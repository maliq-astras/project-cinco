import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  getBreakpoint,
  getResponsiveValue,
  isLandscape,
  isPortrait,
  isMobileLayout,
  isMobileMenu,
  getLayoutMode,
  willContentFitInHeight,
  getAvailableContentHeight,
  type Breakpoint
} from '@/constants/breakpoints';
import { TIMEOUTS } from '@/constants/timeouts';

// Performance optimization: Height breakpoint ranges
const HEIGHT_BREAKPOINT_RANGES = {
  short: { min: 0, max: 599 },
  medium: { min: 600, max: 799 },
  tall: { min: 800, max: Infinity }
} as const;

// Cached calculation results to prevent redundant computation
interface CalculationCache {
  dimensions: { width: number; height: number };
  breakpoint: Breakpoint;
  heightBreakpoint: 'short' | 'medium' | 'tall';
  orientation: { isLandscape: boolean; isPortrait: boolean };
  layout: { isMobileLayout: boolean; layoutMode: string };
  bubbleSize: number;
  cardSize: { width: number; height: number };
  responsiveValues: ResponsiveValues;
}

interface ResponsiveValues {
  bubbleSize: number;
  bubbleSpacing: number;
  cardSize: { width: number; height: number };
  gridColumns: number;
  containerHeight: number;
  fontSize: number;
  spacing: number;
  modalSize: { width: number; height: number };
  inputBarHeight: number;
  timerSize: number;
  progressBarHeight: number;
  header: {
    titleFontSize: string;
    titleMaxWidth: string;
    headerHeight: number;
  };
  navigation: {
    dropdownButtonPadding: string;
    iconSize: string;
  };
}

/**
 * Performance-optimized responsive hook
 * 
 * Key optimizations:
 * - Debounced resize handling (16ms = 60fps)
 * - Memoized calculation cache with stable references
 * - Reduced dependency arrays and computation splitting
 * - Pre-computed breakpoint ranges
 * - Stable object references to prevent child re-renders
 */
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);
  
  // Stable cache reference to prevent unnecessary recalculations
  const cacheRef = useRef<CalculationCache | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced resize handler - prevents excessive calculations during resize
  const handleResize = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Only update if dimensions actually changed (avoids unnecessary re-renders)
      setDimensions(prev => {
        if (prev.width === newDimensions.width && prev.height === newDimensions.height) {
          return prev;
        }
        return newDimensions;
      });
    }, TIMEOUTS.RESIZE_DEBOUNCE);
  }, []);

  // Initial mount and resize listener setup
  useEffect(() => {
    const initialDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    setDimensions(initialDimensions);
    setMounted(true);

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // CORRECTED: Use proper width+height breakpoint calculation like original
  const breakpoint = useMemo(() => 
    getBreakpoint(dimensions.width, dimensions.height), 
    [dimensions.width, dimensions.height]
  );

  // Fast height breakpoint calculation
  const heightBreakpoint = useMemo((): 'short' | 'medium' | 'tall' => {
    const { height } = dimensions;
    if (height <= HEIGHT_BREAKPOINT_RANGES.short.max) return 'short';
    if (height <= HEIGHT_BREAKPOINT_RANGES.medium.max) return 'medium';
    return 'tall';
  }, [dimensions]);

  // Orientation detection - memoized separately to avoid recalculation
  const orientation = useMemo(() => ({
    isLandscape: isLandscape(dimensions.width, dimensions.height),
    isPortrait: isPortrait(dimensions.width, dimensions.height)
  }), [dimensions]);

  // Layout detection - memoized separately
  const layout = useMemo(() => ({
    isMobileLayout: isMobileLayout(dimensions.width, dimensions.height),
    isMobileMenu: isMobileMenu(dimensions.width),
    layoutMode: getLayoutMode(dimensions.width, dimensions.height)
  }), [dimensions]);

  // Optimized bubble size calculation - extracted and memoized separately
  const bubbleSize = useMemo(() => {
    const { width, height } = dimensions;
    const { isMobileLayout: isMobile } = layout;
    
    // Early return for invalid dimensions
    if (width <= 0 || height <= 0) return 80;
    
    const gridColumns = 4;
    const gridRows = 2;
    const minSpacing = 12;
    
    // Calculate available width based on layout
    const availableWidth = isMobile 
      ? width - 40  // Mobile: full width minus padding
      : (width / 2) - 40; // Desktop: half width minus gaps and padding
    
    // Simplified height calculation
    const reservedHeight = isMobile ? 520 : 320; // Pre-calculated common cases
    const availableHeight = Math.max(0, height - reservedHeight);
    
    const maxWidthBubbleSize = (availableWidth - (minSpacing * (gridColumns - 1))) / gridColumns;
    const maxHeightBubbleSize = (availableHeight - (minSpacing * (gridRows - 1))) / gridRows;
    const optimalSize = Math.min(maxWidthBubbleSize, maxHeightBubbleSize);
    
    // Apply scaling for specific width ranges
    const scaledSize = (width > 940 && width < 1140) ? optimalSize * 0.95 : optimalSize;
    
    return Math.max(60, Math.min(120, scaledSize));
  }, [dimensions, layout]);

  // Optimized card size calculation - extracted and memoized separately
  const cardSize = useMemo(() => {
    const { width, height } = dimensions;
    const { isMobileLayout: isMobile } = layout;
    
    // Early return for invalid dimensions
    if (width <= 0 || height <= 0) return { width: 80, height: 120 };
    
    // Pre-calculated card percentage based on layout
    let cardPercentage: number;
    if (isMobile && height < 940) cardPercentage = 0.25;
    else if (isMobile && width < 560) cardPercentage = 0.25;
    else if (isMobile && width >= 800) cardPercentage = 0.4;
    else if (!isMobile && width < 1000) cardPercentage = 0.28;
    else cardPercentage = 0.45;
    
    // Calculate available space
    const availableWidth = isMobile 
      ? Math.min(400, width - 40)
      : (width / 2) - 40;
    
    const maxCardWidth = Math.min(availableWidth * cardPercentage, 130);
    const cardWidth = Math.max(55, maxCardWidth);
    const cardHeight = cardWidth * 1.5; // 2:3 aspect ratio
    
    return {
      width: Math.round(cardWidth),
      height: Math.round(cardHeight)
    };
  }, [dimensions, layout]);

  // Main responsive values calculation - optimized with stable references
  const responsiveValues = useMemo((): ResponsiveValues => {
    // Check cache first - avoid recalculation if inputs haven't changed
    const currentCache = cacheRef.current;
    if (currentCache && 
        currentCache.dimensions.width === dimensions.width &&
        currentCache.dimensions.height === dimensions.height &&
        currentCache.breakpoint === breakpoint) {
      return currentCache.responsiveValues;
    }

    // Calculate new values
    const values: ResponsiveValues = {
      bubbleSize,
      bubbleSpacing: Math.max(16, Math.min(26, bubbleSize * 0.16)),
      cardSize,
      gridColumns: getResponsiveValue(
        { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
        breakpoint
      ),
      containerHeight: getResponsiveValue(
        { xs: 120, sm: 130, md: 140, lg: 150, xl: 160 },
        breakpoint
      ),
      fontSize: getResponsiveValue(
        { xs: 14, sm: 15, md: 16, lg: 17, xl: 18 },
        breakpoint
      ),
      spacing: getResponsiveValue(
        { xs: 6, sm: 7, md: 8, lg: 10, xl: 12 },
        breakpoint
      ),
      modalSize: getResponsiveValue(
        { 
          xs: { width: 300, height: 400 }, 
          sm: { width: 320, height: 420 }, 
          md: { width: 350, height: 450 }, 
          lg: { width: 380, height: 480 }, 
          xl: { width: 400, height: 500 },
        },
        breakpoint
      ),
      inputBarHeight: getResponsiveValue(
        { xs: 44, sm: 46, md: 48, lg: 50, xl: 52 },
        breakpoint
      ),
      timerSize: getResponsiveValue(
        { xs: 50, sm: 55, md: 60, lg: 65, xl: 70 },
        breakpoint
      ),
      progressBarHeight: getResponsiveValue(
        { xs: 6, sm: 7, md: 8, lg: 9, xl: 10 },
        breakpoint
      ),
      header: {
        titleFontSize: getResponsiveValue({
          xs: "clamp(25px, 3.5vh, 32px)",
          sm: "clamp(30px, 4vh, 38px)", 
          md: "clamp(35px, 4.5vh, 44px)",
          lg: "clamp(40px, 5vh, 50px)",
          xl: "clamp(45px, 5.5vh, 56px)"
        }, breakpoint),
        titleMaxWidth: getResponsiveValue({
          xs: "263px",
          sm: "315px", 
          md: "368px",
          lg: "420px",
          xl: "473px"
        }, breakpoint),
        headerHeight: getResponsiveValue({
          xs: 120, sm: 140, md: 160, lg: 180, xl: 200
        }, breakpoint)
      },
      navigation: {
        dropdownButtonPadding: getResponsiveValue({
          xs: "0.375rem",
          sm: "0.375rem", 
          md: "0.4375rem",
          lg: "0.5rem",
          xl: "0.625rem"
        }, breakpoint),
        iconSize: getResponsiveValue({
          xs: "1.125rem",
          sm: "1.125rem",
          md: "1.25rem",
          lg: "1.375rem",
          xl: "1.5rem"
        }, breakpoint)
      }
    };

    // Update cache
    cacheRef.current = {
      dimensions,
      breakpoint,
      heightBreakpoint,
      orientation,
      layout,
      bubbleSize,
      cardSize,
      responsiveValues: values
    };

    return values;
  }, [dimensions, breakpoint, heightBreakpoint, orientation, layout, bubbleSize, cardSize]);

  // Utility functions - memoized to prevent recreation
  const willFit = useMemo(() => ({
    bubbleGrid: (gridHeight: number) => willContentFitInHeight(gridHeight, dimensions.height - 200),
    cardStack: (stackHeight: number) => willContentFitInHeight(stackHeight, dimensions.height - 300),
    modal: (modalHeight: number) => willContentFitInHeight(modalHeight, dimensions.height - 100),
    gameControls: (controlsHeight: number) => willContentFitInHeight(controlsHeight, dimensions.height - 400)
  }), [dimensions.height]);

  // Available content height calculation
  const availableContentHeight = useMemo(() => 
    getAvailableContentHeight(dimensions.height, 200),
    [dimensions.height]
  );

  // Stable getResponsiveValue function reference
  const getResponsiveValueFn = useCallback(<T>(values: Record<Breakpoint, T>) => 
    getResponsiveValue(values, breakpoint), [breakpoint]);

  // Return stable object reference to prevent unnecessary child re-renders
  return useMemo(() => ({
    // Dimensions
    width: dimensions.width,
    height: dimensions.height,
    mounted,
    
    // Breakpoints
    breakpoint,
    heightBreakpoint,
    
    // Orientation - stable references
    isLandscape: orientation.isLandscape,
    isPortrait: orientation.isPortrait,
    
    // Layout modes - stable references
    isMobileLayout: layout.isMobileLayout,
    isMobileMenu: layout.isMobileMenu,
    layoutMode: layout.layoutMode,
    
    // Responsive values - stable reference
    responsiveValues,
    
    // Content fitting utilities - stable reference
    willFit,
    availableContentHeight,
    
    // Helper functions - stable reference
    getResponsiveValue: getResponsiveValueFn
  }), [
    dimensions.width, 
    dimensions.height, 
    mounted, 
    breakpoint, 
    heightBreakpoint, 
    orientation.isLandscape, 
    orientation.isPortrait, 
    layout.isMobileLayout,
    layout.isMobileMenu,
    layout.layoutMode,
    responsiveValues, 
    willFit, 
    availableContentHeight, 
    getResponsiveValueFn
  ]);
};