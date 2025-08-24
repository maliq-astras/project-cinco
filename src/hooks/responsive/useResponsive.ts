import { useState, useEffect, useMemo } from 'react';
import { 
  getBreakpoint, 
  getHeightBreakpoint,
  getPrimaryResponsiveValue,
  getResponsiveValue,
  isLandscape,
  isPortrait,
  willContentFitInHeight,
  getAvailableContentHeight,
  type Breakpoint,
  type HeightBreakpoint
} from '@/helpers/breakpoints';

/**
 * Unified Responsive Hook
 * 
 * Replaces all device-specific logic with a single, consistent responsive system.
 * Prioritizes height for no-scroll pages with vertically stacked elements.
 */
export const useResponsive = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    // Set initial dimensions
    updateDimensions();
    setMounted(true);

    // Listen for resize events
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate breakpoints
  const breakpoint = useMemo(() => getBreakpoint(width), [width]);
  const heightBreakpoint = useMemo(() => getHeightBreakpoint(height), [height]);

  // Orientation detection
  const isLandscapeMode = useMemo(() => isLandscape(width, height), [width, height]);
  const isPortraitMode = useMemo(() => isPortrait(width, height), [width, height]);

  // Responsive values for different components
  const responsiveValues = useMemo(() => {
    // Calculate optimal bubble size based on available grid space
    const calculateOptimalBubbleSize = () => {
      // Grid layout: 2 rows, 4 columns = 8 bubbles total
      const gridColumns = 4;
      const gridRows = 2;
      
      // Available space (accounting for margins and other UI elements)
      const availableWidth = width - 40; // 20px margin on each side
      
      // Much more aggressive height calculation for no-scroll constraint
      // Reserve more space for header, fact area, controls, and margins
      const reservedHeight = isLandscapeMode ? 400 : 350; // More space reserved in landscape
      const availableHeight = Math.max(0, height - reservedHeight);
      
      // Minimum spacing between bubbles
      const minSpacing = 12;
      
      // Calculate max possible bubble size based on width
      const maxWidthBubbleSize = (availableWidth - (minSpacing * (gridColumns - 1))) / gridColumns;
      
      // Calculate max possible bubble size based on height
      const maxHeightBubbleSize = (availableHeight - (minSpacing * (gridRows - 1))) / gridRows;
      
      // Use the smaller of the two to ensure bubbles fit
      const optimalSize = Math.min(maxWidthBubbleSize, maxHeightBubbleSize);
      
      // Set reasonable bounds (not too small, not too large)
      const minSize = 50; // Lower minimum for very constrained spaces
      const maxSize = 100; // Lower maximum to prevent overflow
      
      return Math.max(minSize, Math.min(maxSize, optimalSize));
    };

    const optimalBubbleSize = calculateOptimalBubbleSize();

    return {
      // Bubble sizes - calculated dynamically based on available space
      bubbleSize: optimalBubbleSize,
      
      // Bubble spacing - proportional to bubble size
      bubbleSpacing: Math.max(8, Math.min(20, optimalBubbleSize * 0.15)),

      // Card sizes (prioritize height for no-scroll) - more aggressive sizing
      cardSize: getPrimaryResponsiveValue(
        { 
          short: { width: 70, height: 105 }, 
          medium: { width: 80, height: 120 }, 
          tall: { width: 90, height: 135 } 
        },
        { 
          xs: { width: 70, height: 105 }, 
          sm: { width: 75, height: 113 }, 
          md: { width: 80, height: 120 }, 
          lg: { width: 85, height: 128 }, 
          xl: { width: 90, height: 135 } 
        },
        width,
        height
      ),

      // Grid columns (use width for layout)
      gridColumns: getResponsiveValue(
        { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
        breakpoint
      ),

      // Container heights (prioritize height) - more aggressive for limited space
      containerHeight: getPrimaryResponsiveValue(
        { short: 120, medium: 140, tall: 160 },
        { xs: 120, sm: 130, md: 140, lg: 150, xl: 160 },
        width,
        height
      ),

      // Font sizes (use width for readability)
      fontSize: getResponsiveValue(
        { xs: 14, sm: 15, md: 16, lg: 17, xl: 18 },
        breakpoint
      ),

      // Spacing (prioritize height for no-scroll) - more aggressive for limited space
      spacing: getPrimaryResponsiveValue(
        { short: 6, medium: 8, tall: 12 },
        { xs: 6, sm: 7, md: 8, lg: 10, xl: 12 },
        width,
        height
      ),

      // Modal sizes (prioritize height)
      modalSize: getPrimaryResponsiveValue(
        { 
          short: { width: 300, height: 400 }, 
          medium: { width: 350, height: 450 }, 
          tall: { width: 400, height: 500 } 
        },
        { 
          xs: { width: 300, height: 400 }, 
          sm: { width: 320, height: 420 }, 
          md: { width: 350, height: 450 }, 
          lg: { width: 380, height: 480 }, 
          xl: { width: 400, height: 500 } 
        },
        width,
        height
      ),

      // Input bar height (prioritize height)
      inputBarHeight: getPrimaryResponsiveValue(
        { short: 44, medium: 48, tall: 52 },
        { xs: 44, sm: 46, md: 48, lg: 50, xl: 52 },
        width,
        height
      ),

      // Timer size (prioritize height)
      timerSize: getPrimaryResponsiveValue(
        { short: 50, medium: 60, tall: 70 },
        { xs: 50, sm: 55, md: 60, lg: 65, xl: 70 },
        width,
        height
      ),

      // Progress bar height (prioritize height)
      progressBarHeight: getPrimaryResponsiveValue(
        { short: 6, medium: 8, tall: 10 },
        { xs: 6, sm: 7, md: 8, lg: 9, xl: 10 },
        width,
        height
      )
    };
  }, [width, height, breakpoint, heightBreakpoint]);

  // Utility functions
  const willFit = useMemo(() => ({
    // Check if bubble grid will fit
    bubbleGrid: (gridHeight: number) => willContentFitInHeight(gridHeight, height - 200), // Account for header/nav
    
    // Check if card stack will fit
    cardStack: (stackHeight: number) => willContentFitInHeight(stackHeight, height - 300), // Account for more fixed elements
    
    // Check if modal will fit
    modal: (modalHeight: number) => willContentFitInHeight(modalHeight, height - 100), // Account for padding
    
    // Check if game controls will fit
    gameControls: (controlsHeight: number) => willContentFitInHeight(controlsHeight, height - 400) // Account for all content
  }), [height]);

  // Available content height (accounts for fixed elements)
  const availableContentHeight = useMemo(() => 
    getAvailableContentHeight(height, 200), // 200px for header/nav
    [height]
  );

  return {
    // Dimensions
    width,
    height,
    mounted,
    
    // Breakpoints
    breakpoint,
    heightBreakpoint,
    
    // Orientation
    isLandscape: isLandscapeMode,
    isPortrait: isPortraitMode,
    
    // Responsive values
    responsiveValues,
    
    // Utility functions
    willFit,
    availableContentHeight,
    
    // Helper functions for components
    getResponsiveValue: <T>(values: Record<Breakpoint, T>) => getResponsiveValue(values, breakpoint),
    getHeightResponsiveValue: <T>(values: Record<HeightBreakpoint, T>) => values[heightBreakpoint],
    getPrimaryResponsiveValue: <T>(
      heightValues: Record<HeightBreakpoint, T>,
      widthValues: Record<Breakpoint, T>
    ) => getPrimaryResponsiveValue(heightValues, widthValues, width, height)
  };
};
