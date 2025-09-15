import { useState, useEffect, useMemo } from 'react';
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
  const isMobileLayoutDetected = useMemo(() => isMobileLayout(width, height), [width, height]);
  const isMobileMenuDetected = useMemo(() => isMobileMenu(width), [width]);
  const layoutMode = useMemo(() => getLayoutMode(width, height), [width, height]);

  // Responsive values for different components
  const responsiveValues = useMemo(() => {
    // Smart dynamic bubble sizing - layout aware, works for all heights
    const getBubbleSize = () => {
      const gridColumns = 4;
      const gridRows = 2;
      
      // Calculate available width based on layout mode
      let availableWidth;
      if (isMobileLayoutDetected) {
        // Vertical layout: bubbles get full width minus container padding
        availableWidth = width - 40;
      } else {
        // Wide layout: bubbles only get their panel width
        // Account for: half screen - horizontal gap (1.5rem) - container padding (1rem each side)
        availableWidth = (width / 2) - 24 - 16; // 24px = 1.5rem gap, 16px = 1rem padding each side
      }
      
      // Calculate actual reserved height based on layout and UI components
      let calculatedReservedHeight;
      
      if (isMobileLayoutDetected) {
        // Mobile layout: header + card stack area + controls + padding
        const headerHeight = getResponsiveValue(
          { xs: 120, sm: 140, md: 160, lg: 180, xl: 200 }, 
          breakpoint
        );
        const cardStackHeight = 200; // Approximate height of the card placeholder area
        const controlsHeight = 120; // Timer + input + progress bar + buttons
        const mobilePadding = 80; // Mobile-specific margins and spacing
        
        calculatedReservedHeight = headerHeight + cardStackHeight + controlsHeight + mobilePadding;
      } else {
        // Desktop layout: only header + controls (cards are side-by-side)  
        const headerHeight = getResponsiveValue(
          { xs: 120, sm: 160, md: 180, lg: 200, xl: 200 }, 
          breakpoint
        );
        const inputBarHeight = getResponsiveValue(
          { xs: 44, sm: 46, md: 48, lg: 50, xl: 52 },
          breakpoint
        );
        const timerSize = getResponsiveValue(
          { xs: 50, sm: 55, md: 60, lg: 65, xl: 70 },
          breakpoint
        );
        const progressBarHeight = getResponsiveValue(
          { xs: 6, sm: 7, md: 8, lg: 9, xl: 10 },
          breakpoint
        );
        const desktopPadding = 60;
        const instructionTextHeight = 30;
        
        calculatedReservedHeight = headerHeight + inputBarHeight + timerSize + 
          progressBarHeight + desktopPadding + instructionTextHeight;
      }
      
      const availableHeight = Math.max(0, height - calculatedReservedHeight);
      const minSpacing = 12;
      
      const maxWidthBubbleSize = (availableWidth - (minSpacing * (gridColumns - 1))) / gridColumns;
      const maxHeightBubbleSize = (availableHeight - (minSpacing * (gridRows - 1))) / gridRows;
      const optimalSize = Math.min(maxWidthBubbleSize, maxHeightBubbleSize);
      
      // Apply 5% scaling for ultrawide screens with cutoff issues (940-1140px width)
      const scaledSize = (width < 1140 && width > 940) 
        ? optimalSize * 0.95 
        : optimalSize;
    
      return Math.max(60, Math.min(120, scaledSize));
    };

    // Get bubble size directly from available space calculation
    const bubbleSize = getBubbleSize();

    // Smart dynamic card sizing - layout aware
    const getCardSize = () => {
      
      // Calculate available space for cards based on layout mode
      let availableWidth;
      
      if (isMobileLayoutDetected) {
        // Vertical layout: cards get full width for the stack area
        availableWidth = Math.min(400, width - 40); // Max 400px width, minus padding
      } else {
        // Wide layout: cards get their panel width
        availableWidth = (width / 2) - 24 - 16; // Half width minus gap and padding
      }
      
      // Calculate optimal card dimensions (maintaining 2:3 aspect ratio)
      const aspectRatio = 1.5; // height / width = 3/2
      
      // Responsive card sizing - switch case for clarity
      let cardPercentage;
      switch (true) {
        case isMobileLayoutDetected && height < 940:
          cardPercentage = 0.25; 
          break;
        case isMobileLayoutDetected && width < 560:
          cardPercentage = 0.25; 
          break;
        case isMobileLayoutDetected && width >= 800:
          cardPercentage = 0.4; // Wide mobile
          break;
        case !isMobileLayoutDetected && width < 1000:
          cardPercentage = 0.28; // Narrow desktop
          break;
        default:
          cardPercentage = 0.45; // Standard desktop
          break;
      }
      const maxCardWidth = Math.min(availableWidth * cardPercentage, 130);
      const cardWidth = Math.max(55, maxCardWidth);
      const cardHeight = cardWidth * aspectRatio;
      
      return {
        width: Math.round(cardWidth),
        height: Math.round(cardHeight)
      };
    };

    const baseCardSize = getCardSize();
    
    // Use card size directly from calculation
    const cardSize = baseCardSize;
    
    // Set card size globally so spread calculations can access it
    if (typeof window !== 'undefined') {
      (window as Window & { __CARD_SIZE__?: { width: number; height: number } }).__CARD_SIZE__ = cardSize;
    }

    return {
      // Bubble sizes - dynamic and layout-aware
      bubbleSize: bubbleSize,
      
      // Bubble spacing - always dynamic and proportional to bubble size
      bubbleSpacing: Math.max(16, Math.min(26, bubbleSize * 0.16)),

      // Card sizes - dynamic and layout-aware
      cardSize: cardSize,

      // Grid columns (use width for layout)
      gridColumns: getResponsiveValue(
        { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
        breakpoint
      ),

      // Container heights - more aggressive for limited space
      containerHeight: getResponsiveValue(
        { xs: 120, sm: 130, md: 140, lg: 150, xl: 160 },
        breakpoint
      ),

      // Font sizes (use width for readability)
      fontSize: getResponsiveValue(
        { xs: 14, sm: 15, md: 16, lg: 17, xl: 18 },
        breakpoint
      ),

      // Spacing - more aggressive for limited space
      spacing: getResponsiveValue(
        { xs: 6, sm: 7, md: 8, lg: 10, xl: 12 },
        breakpoint
      ),

      // Modal sizes
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

      // Input bar height
      inputBarHeight: getResponsiveValue(
        { xs: 44, sm: 46, md: 48, lg: 50, xl: 52 },
        breakpoint
      ),

      // Timer size
      timerSize: getResponsiveValue(
        { xs: 50, sm: 55, md: 60, lg: 65, xl: 70 },
        breakpoint
      ),

      // Progress bar height
      progressBarHeight: getResponsiveValue(
        { xs: 6, sm: 7, md: 8, lg: 9, xl: 10 },
        breakpoint
      ),

      // Header responsive values - consolidated from Header.styles.ts
      header: {
        // Title typography with viewport-based sizing
        titleFontSize: getResponsiveValue({
          xs: "clamp(25px, 3.5vh, 32px)",
          sm: "clamp(30px, 4vh, 38px)", 
          md: "clamp(35px, 4.5vh, 44px)",
          lg: "clamp(40px, 5vh, 50px)",
          xl: "clamp(45px, 5.5vh, 56px)"
        }, breakpoint),
        
        // Title max width for text overflow
        titleMaxWidth: getResponsiveValue({
          xs: "263px",
          sm: "315px", 
          md: "368px",
          lg: "420px",
          xl: "473px"
        }, breakpoint),
        
        // Header height values used in other calculations
        headerHeight: getResponsiveValue({
          xs: 120, sm: 140, md: 160, lg: 180, xl: 200
        }, breakpoint)
      },

      // Navigation responsive values - consolidated from Navigation.styles.ts  
      navigation: {
        // Dropdown button padding
        dropdownButtonPadding: getResponsiveValue({
          xs: "0.375rem",
          sm: "0.375rem", 
          md: "0.4375rem",
          lg: "0.5rem",
          xl: "0.625rem"
        }, breakpoint),
        
        // Icon sizes for navigation
        iconSize: getResponsiveValue({
          xs: "1.125rem", // 18px
          sm: "1.125rem", // 18px
          md: "1.25rem",  // 20px 
          lg: "1.375rem", // 22px
          xl: "1.5rem"    // 24px
        }, breakpoint)
      }
    };
  }, [width, height, breakpoint, isLandscapeMode, isMobileLayoutDetected]);

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
    isMobileLayout: isMobileLayoutDetected,
    layoutMode,
    
    // Responsive values
    responsiveValues,
    
    // Content fitting utilities
    willFit,
    availableContentHeight,

    // Mobile menu detection
    isMobileMenu: isMobileMenuDetected,
    
    // Helper functions for components
    getResponsiveValue: <T>(values: Record<Breakpoint, T>) => getResponsiveValue(values, breakpoint)
  };
};
