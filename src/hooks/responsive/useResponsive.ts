import { useState, useEffect, useMemo } from 'react';
import { 
  getBreakpoint, 
  getResponsiveValue,
  isLandscape,
  isPortrait,
  willContentFitInHeight,
  getAvailableContentHeight,
  type Breakpoint
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
  const breakpoint = useMemo(() => getBreakpoint(width, height), [width, height]);

  // Orientation detection
  const isLandscapeMode = useMemo(() => isLandscape(width, height), [width, height]);
  const isPortraitMode = useMemo(() => isPortrait(width, height), [width, height]);

  // Responsive values for different components
  const responsiveValues = useMemo(() => {
    // Hybrid bubble sizing: dynamic above 750px, aggressive breakpoint below
    const getBubbleSize = () => {
      if (height >= 750) {
        // Dynamic sizing for taller screens
        const gridColumns = 4;
        const gridRows = 2;
        const availableWidth = width - 40;
        const reservedHeight = isLandscapeMode ? 400 : 350;
        const availableHeight = Math.max(0, height - reservedHeight);
        const minSpacing = 12;
        
        const maxWidthBubbleSize = (availableWidth - (minSpacing * (gridColumns - 1))) / gridColumns;
        const maxHeightBubbleSize = (availableHeight - (minSpacing * (gridRows - 1))) / gridRows;
        const optimalSize = Math.min(maxWidthBubbleSize, maxHeightBubbleSize);
        
        return Math.max(60, Math.min(120, optimalSize));
      } else {
        // Aggressive breakpoint-based sizing for shorter screens
        return getResponsiveValue(
          { xxs: 65, xs: 70, sm: 80, md: 75, lg: 85, xl: 95, xxl: 105 },
          breakpoint
        );
      }
    };

    const bubbleSize = getBubbleSize();

    return {
      // Bubble sizes - hybrid approach
      bubbleSize: bubbleSize,
      
      // Bubble spacing - proportional to bubble size for dynamic, fixed for breakpoint
      bubbleSpacing: height >= 750 
        ? Math.max(8, Math.min(20, bubbleSize * 0.15))
        : getResponsiveValue(
            { xxs: 6, xs: 8, sm: 10, md: 12, lg: 15, xl: 18, xxl: 20 },
            breakpoint
          ),

      // Card sizes - smaller cards to fit better
      cardSize: getResponsiveValue(
        { 
          xxs: { width: 50, height: 75 }, 
          xs: { width: 60, height: 90 }, 
          sm: { width: 65, height: 98 }, 
          md: { width: 70, height: 105 }, 
          lg: { width: 75, height: 113 }, 
          xl: { width: 80, height: 120 },
          xxl: { width: 85, height: 128 }
        },
        breakpoint
      ),

      // Grid columns (use width for layout)
      gridColumns: getResponsiveValue(
        { xxs: 3, xs: 3, sm: 4, md: 5, lg: 6, xl: 7, xxl: 8 },
        breakpoint
      ),

      // Container heights - more aggressive for limited space
      containerHeight: getResponsiveValue(
        { xxs: 100, xs: 120, sm: 130, md: 140, lg: 150, xl: 160, xxl: 170 },
        breakpoint
      ),

      // Font sizes (use width for readability)
      fontSize: getResponsiveValue(
        { xxs: 12, xs: 14, sm: 15, md: 16, lg: 17, xl: 18, xxl: 19 },
        breakpoint
      ),

      // Spacing - more aggressive for limited space
      spacing: getResponsiveValue(
        { xxs: 4, xs: 6, sm: 7, md: 8, lg: 10, xl: 12, xxl: 14 },
        breakpoint
      ),

      // Modal sizes
      modalSize: getResponsiveValue(
        { 
          xxs: { width: 280, height: 380 }, 
          xs: { width: 300, height: 400 }, 
          sm: { width: 320, height: 420 }, 
          md: { width: 350, height: 450 }, 
          lg: { width: 380, height: 480 }, 
          xl: { width: 400, height: 500 },
          xxl: { width: 420, height: 520 }
        },
        breakpoint
      ),

      // Input bar height
      inputBarHeight: getResponsiveValue(
        { xxs: 40, xs: 44, sm: 46, md: 48, lg: 50, xl: 52, xxl: 54 },
        breakpoint
      ),

      // Timer size
      timerSize: getResponsiveValue(
        { xxs: 45, xs: 50, sm: 55, md: 60, lg: 65, xl: 70, xxl: 75 },
        breakpoint
      ),

      // Progress bar height
      progressBarHeight: getResponsiveValue(
        { xxs: 5, xs: 6, sm: 7, md: 8, lg: 9, xl: 10, xxl: 11 },
        breakpoint
      )
    };
  }, [width, height, breakpoint, isLandscapeMode]);

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
    
    // Orientation
    isLandscape: isLandscapeMode,
    isPortrait: isPortraitMode,
    
    // Responsive values
    responsiveValues,
    
    // Content fitting utilities
    willFit,
    availableContentHeight,
    
    // Helper functions for components
    getResponsiveValue: <T>(values: Record<Breakpoint, T>) => getResponsiveValue(values, breakpoint)
  };
};
