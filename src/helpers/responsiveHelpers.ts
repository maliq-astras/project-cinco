/**
 * Professional Responsive System Helpers
 * Provides fluid, scalable sizing based on viewport dimensions
 */

/**
 * Calculate fluid bubble size based on viewport dimensions
 * Uses CSS clamp() logic in JavaScript for consistency
 */
export function getFluidBubbleSize(width: number, height: number): number {
  // Check for tablet landscape (wide aspect ratio with good height)
  const aspectRatio = width / height;
  const isTabletLandscape = aspectRatio > 1.3 && aspectRatio < 2.2 && width > 900 && height > 600;
  
  // Base size calculation: 4vw + 30px, clamped between 45px and 110px
  const vwBased = Math.max(45, Math.min(110, (width * 0.04) + 30));
  
  // Height-based adjustment for very tall/short screens
  let heightFactor = height < 600 ? 0.85 : height > 1000 ? 1.15 : 1;
  
  // Boost bubble size for tablet landscape
  if (isTabletLandscape) {
    heightFactor *= 1.25; // 25% larger bubbles on tablet landscape
  }
  
  return Math.round(vwBased * heightFactor);
}

/**
 * Calculate fluid gap size based on viewport dimensions
 */
export function getFluidGapSize(width: number, height: number): number {
  // Base size calculation: 1vw + 4px, clamped between 8px and 28px
  const vwBased = Math.max(8, Math.min(28, (width * 0.01) + 4));
  
  // Height-based adjustment
  const heightFactor = height < 600 ? 0.8 : height > 1000 ? 1.2 : 1;
  
  return Math.round(vwBased * heightFactor);
}

/**
 * Calculate fluid card dimensions
 */
export function getFluidCardSize(width: number, height: number): { width: number; height: number } {
  // Check for tablet landscape (wide aspect ratio with good height)
  const aspectRatio = width / height;
  const isTabletLandscape = aspectRatio > 1.3 && aspectRatio < 2.2 && width > 900 && height > 600;
  
  // Width: 8vw + 40px, clamped between 80px and 140px
  let cardWidth = Math.max(80, Math.min(140, (width * 0.08) + 40));
  
  // Height: 12vw + 60px, clamped between 120px and 200px
  let cardHeight = Math.max(120, Math.min(200, (width * 0.12) + 60));
  
  // Reduce card size on tablet landscape to make room for larger bubbles/header
  if (isTabletLandscape) {
    cardWidth *= 0.8; // 20% smaller cards on tablet landscape
    cardHeight *= 0.8;
  }
  
  // Height-based adjustments for extreme aspect ratios
  const heightAdjustment = aspectRatio > 2 ? 0.9 : aspectRatio < 1 ? 1.1 : 1;
  
  return {
    width: Math.round(cardWidth),
    height: Math.round(cardHeight * heightAdjustment)
  };
}

/**
 * Calculate fluid header size
 */
export function getFluidHeaderSize(width: number, height: number): { height: number; maxWidth: number } {
  // Check for tablet landscape (wide aspect ratio with good height)
  const aspectRatio = width / height;
  const isTabletLandscape = aspectRatio > 1.3 && aspectRatio < 2.2 && width > 900 && height > 600;
  
  // Header height: 8vh + 20px, clamped between 60px and 140px
  let headerHeight = Math.max(60, Math.min(140, (height * 0.08) + 20));
  
  // Logo max width: 25vw + 100px, clamped between 200px and 450px
  let logoMaxWidth = Math.max(200, Math.min(450, (width * 0.25) + 100));
  
  // Boost header and logo size on tablet landscape
  if (isTabletLandscape) {
    headerHeight *= 1.3; // 30% larger header on tablet landscape
    logoMaxWidth *= 1.2; // 20% larger logo on tablet landscape
  }
  
  return {
    height: Math.round(headerHeight),
    maxWidth: Math.round(logoMaxWidth)
  };
}

/**
 * Calculate fluid font size
 */
export function getFluidFontSize(
  minSize: number, 
  maxSize: number, 
  minViewport: number, 
  maxViewport: number, 
  currentViewport: number
): number {
  if (currentViewport <= minViewport) return minSize;
  if (currentViewport >= maxViewport) return maxSize;
  
  const ratio = (currentViewport - minViewport) / (maxViewport - minViewport);
  return Math.round(minSize + (maxSize - minSize) * ratio);
}

/**
 * Calculate fluid spacing based on viewport
 */
export function getFluidSpacing(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl', width: number): number {
  const spacingMap = {
    xs: { min: 4, max: 6, base: 0.25 },
    sm: { min: 8, max: 12, base: 0.5 },
    md: { min: 12, max: 18, base: 0.75 },
    lg: { min: 16, max: 24, base: 1 },
    xl: { min: 24, max: 36, base: 1.5 }
  };
  
  const config = spacingMap[size];
  const vwBased = (width * config.base * 0.01) + (config.min * 0.8);
  
  return Math.max(config.min, Math.min(config.max, Math.round(vwBased)));
}

/**
 * Determine grid configuration based on available space
 */
export function getFluidGridConfig(
  containerWidth: number, 
  containerHeight: number, 
  bubbleSize: number, 
  gapSize: number
): { cols: number; rows: number; totalSlots: number } {
  // Calculate how many bubbles can fit horizontally
  const availableWidth = containerWidth - 32; // Account for padding
  const maxCols = Math.floor((availableWidth + gapSize) / (bubbleSize + gapSize));
  
  // Calculate how many bubbles can fit vertically (reserve space for other UI)
  const availableHeight = containerHeight - 300; // Reserve space for header, controls, etc.
  const maxRows = Math.floor((availableHeight + gapSize) / (bubbleSize + gapSize));
  
  // Determine optimal configuration
  let cols = Math.min(4, Math.max(3, maxCols)); // Prefer 4 cols, minimum 3
  let rows = Math.min(3, Math.max(2, maxRows)); // Prefer 2-3 rows
  
  // Special cases for very small screens
  if (containerWidth < 400) {
    cols = 3;
    rows = 3;
  }
  
  // Special cases for very wide screens
  if (containerWidth > 1200 && containerHeight > 800) {
    cols = 4;
    rows = 2;
  }
  
  return {
    cols,
    rows,
    totalSlots: cols * rows
  };
}

/**
 * Check if current viewport needs compact layout
 */
export function shouldUseCompactLayout(width: number, height: number): boolean {
  const aspectRatio = width / height;
  
  // Use compact layout for:
  // - Very short screens (height < 600px)
  // - Very wide aspect ratios (> 2:1) with limited height
  // - Small total area
  return (
    height < 600 ||
    (aspectRatio > 2 && height < 800) ||
    (width * height < 400000)
  );
}

/**
 * Get responsive breakpoint name
 */
export function getResponsiveBreakpoint(width: number): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  if (width < 480) return 'xs';
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
}

/**
 * Calculate optimal container padding
 */
export function getFluidContainerPadding(width: number): number {
  // 2vw + 8px, clamped between 12px and 32px
  return Math.max(12, Math.min(32, (width * 0.02) + 8));
}

/**
 * Generate responsive CSS custom properties
 */
export function generateResponsiveCSS(width: number, height: number): Record<string, string> {
  const bubbleSize = getFluidBubbleSize(width, height);
  const gapSize = getFluidGapSize(width, height);
  const cardSize = getFluidCardSize(width, height);
  const headerSize = getFluidHeaderSize(width, height);
  
  return {
    '--bubble-size': `${bubbleSize}px`,
    '--bubble-gap': `${gapSize}px`,
    '--card-width': `${cardSize.width}px`,
    '--card-height': `${cardSize.height}px`,
    '--header-height': `${headerSize.height}px`,
    '--logo-max-width': `${headerSize.maxWidth}px`,
    '--container-padding': `${getFluidContainerPadding(width)}px`,
    '--space-sm': `${getFluidSpacing('sm', width)}px`,
    '--space-md': `${getFluidSpacing('md', width)}px`,
    '--space-lg': `${getFluidSpacing('lg', width)}px`
  };
}
