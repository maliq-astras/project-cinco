import { useState, useEffect, useMemo } from 'react';
import { 
  getBreakpoint, 
  getResponsiveValue,
  isLandscape,
  isPortrait,
  isMobileLayout,
  isCompactLayout,
  getLayoutMode,
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
  
  // Height breakpoint for vertical constraints
  const heightBreakpoint = useMemo(() => {
    if (height < 600) return 'short';
    if (height < 800) return 'medium';
    return 'tall';
  }, [height]);

  // Orientation detection
  const isLandscapeMode = useMemo(() => isLandscape(width, height), [width, height]);
  const isPortraitMode = useMemo(() => isPortrait(width, height), [width, height]);
  
  // Layout mode detection
  const isNarrow = useMemo(() => isMobileLayout(width, height), [width, height]);
  const isCompact = useMemo(() => isCompactLayout(width, height), [width, height]);
  const layoutMode = useMemo(() => getLayoutMode(width, height), [width, height]);

  // Responsive values for different components
  const responsiveValues = useMemo(() => {
    // Height cutoff - below this, show screen size warning instead of trying to fit
    const minimumHeight = isNarrow ? 650 : 600;
    
    // Smart dynamic bubble sizing - layout aware, works for all heights
    const getBubbleSize = () => {
      // If height is too small, use reasonable fixed sizes instead of shrinking
      if (height < minimumHeight) {
        return isNarrow ? 85 : 95; // Fixed reasonable sizes
      }
      const gridColumns = 4;
      const gridRows = 2;
      
      // Calculate available width based on layout mode
      let availableWidth;
      if (isNarrow) {
        // Vertical layout: bubbles get full width minus container padding
        availableWidth = width - 40;
      } else {
        // Wide layout: bubbles only get their panel width
        // Account for: half screen - horizontal gap (1.5rem) - container padding (1rem each side)
        availableWidth = (width / 2) - 24 - 16; // 24px = 1.5rem gap, 16px = 1rem padding each side
      }
      
      const reservedHeight = isLandscapeMode ? 400 : 350;
      const availableHeight = Math.max(0, height - reservedHeight);
      const minSpacing = 12;
      
      const maxWidthBubbleSize = (availableWidth - (minSpacing * (gridColumns - 1))) / gridColumns;
      const maxHeightBubbleSize = (availableHeight - (minSpacing * (gridRows - 1))) / gridRows;
      const optimalSize = Math.min(maxWidthBubbleSize, maxHeightBubbleSize);
    
      return Math.max(60, Math.min(120, optimalSize));
    };

    const baseBubbleSize = getBubbleSize();
    
    // Apply compact scaling (45% smaller) if in compact layout
    const bubbleSize = isCompact ? Math.round(baseBubbleSize * 0.55) : baseBubbleSize;

    // Smart dynamic card sizing - layout aware
    const getCardSize = () => {
      // If height is too small, use reasonable fixed sizes instead of shrinking
      if (height < minimumHeight) {
        return { width: 100, height: 150 }; // Fixed reasonable card size
      }
      
      // Calculate available space for cards based on layout mode
      let availableWidth;
      let availableHeight;
      
      if (isNarrow) {
        // Vertical layout: cards get full width for the stack area
        availableWidth = Math.min(400, width - 40); // Max 400px width, minus padding
        availableHeight = Math.max(250, height * 0.35); // 35% of screen height, min 250px
      } else {
        // Wide layout: cards get their panel width
        availableWidth = (width / 2) - 24 - 16; // Half width minus gap and padding
        availableHeight = Math.max(350, height * 0.7); // 70% of screen height, min 350px
      }
      
      // Calculate optimal card dimensions (maintaining 2:3 aspect ratio)
      const aspectRatio = 1.5; // height / width = 3/2
      
      // Start with width-based sizing (cards are typically width-constrained)
      const maxCardWidth = Math.min(availableWidth * 0.6, 140); // 60% of available width, max 140px
      let cardWidth = Math.max(55, maxCardWidth);
      let cardHeight = cardWidth * aspectRatio;
      
      // Check if height fits, if not, constrain by height
      const maxCardHeight = Math.min(availableHeight * 0.5, 210); // 50% of available height, max 210px
      if (cardHeight > maxCardHeight) {
        cardHeight = Math.max(83, maxCardHeight); // Min 83px height
        cardWidth = Math.max(55, cardHeight / aspectRatio);
      }
      
      return {
        width: Math.round(cardWidth),
        height: Math.round(cardHeight)
      };
    };

    const baseCardSize = getCardSize();
    
    // Apply compact scaling (45% smaller) if in compact layout
    const cardSize = isCompact ? {
      width: Math.round(baseCardSize.width * 0.55),
      height: Math.round(baseCardSize.height * 0.55)
    } : baseCardSize;

    return {
      // Bubble sizes - dynamic and layout-aware
      bubbleSize: bubbleSize,
      
      // Bubble spacing - always dynamic and proportional to bubble size
      bubbleSpacing: Math.max(8, Math.min(20, bubbleSize * 0.15)),

      // Card sizes - dynamic and layout-aware
      cardSize: cardSize,

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
  }, [width, height, breakpoint, isLandscapeMode, isNarrow, isCompact]);

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
    
    // Layout modes
    isNarrow,
    isCompact,
    layoutMode,
    
    // Responsive values
    responsiveValues,
    
    // Content fitting utilities
    willFit,
    availableContentHeight,
    
    // Helper functions for components
    getResponsiveValue: <T>(values: Record<Breakpoint, T>) => getResponsiveValue(values, breakpoint)
  };
};
