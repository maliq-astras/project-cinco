/**
 * Helper functions for device detection and responsive sizing
 */

/**
 * Check if the device is a specific model based on its screen dimensions
 */
export const deviceDetection = {
  isGalaxyS9Plus: () => {
    return window.innerWidth >= 315 && window.innerWidth <= 330 && 
           window.innerHeight >= 640 && window.innerHeight <= 680;
  },
  
  isOtherGalaxyPhone: () => {
    return window.innerWidth >= 330 && window.innerWidth <= 390 && 
           window.innerHeight >= 650 && window.innerHeight <= 850;
  },
  
  isSurfacePro7: () => {
    return window.innerWidth >= 1350 && window.innerWidth <= 1380 && 
           window.innerHeight >= 900 && window.innerHeight <= 930;
  },
  
  isSurfaceDuo: () => {
    // Surface Duo in landscape mode is approximately 720 x 540
    return (window.innerWidth >= 525 && window.innerWidth <= 555 && 
           window.innerHeight >= 705 && window.innerHeight <= 735) ||
           // Alternative orientation
           (window.innerHeight >= 525 && window.innerHeight <= 555 && 
            window.innerWidth >= 705 && window.innerWidth <= 735);
  },
  
  isTabletLandscape: () => {
    return window.innerWidth > window.innerHeight && 
           window.innerWidth > 1000 && 
           window.innerWidth < 1600 && // More conservative - tablets only
           window.innerHeight < 1100 && // More conservative - tablets only
           window.innerHeight > 500; // Ensure it's not a phone
  },

  isLargeTabletLandscape: () => {
    // Specifically for iPad Pro and other large tablets that need tablet treatment
    return window.innerWidth > window.innerHeight && 
           window.innerWidth >= 1600 && 
           window.innerWidth < 2000 && 
           window.innerHeight >= 1000 && 
           window.innerHeight < 1200;
  },

  isTabletPortrait: () => {
    // Detect tablets in portrait mode (iPad Pro, iPad Air, etc.)
    return window.innerHeight > window.innerWidth && 
           window.innerHeight > 1000 && 
           window.innerHeight < 1600 && 
           window.innerWidth > 700 && 
           window.innerWidth < 1200;
  },

  isLargeTabletPortrait: () => {
    // Specifically for large tablets in portrait mode (iPad Pro, etc.)
    return window.innerHeight > window.innerWidth && 
           window.innerHeight >= 1300 && 
           window.innerHeight < 1600 && 
           window.innerWidth >= 1000 && 
           window.innerWidth < 1200;
  },

  isMobilePhone: () => {
    // True mobile phones should get mobile UI
    // Exclude tablets, Surface Duo, and other larger devices
    if (deviceDetection.isSurfaceDuo()) return false;
    
    // Check for typical phone dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    const maxDimension = Math.max(width, height);
    const minDimension = Math.min(width, height);
    
    // Phones typically have:
    // - Smaller width in portrait (< 500px)
    // - Max dimension < 1000px (excludes most tablets)
    // - Aspect ratio suggesting phone form factor
    return minDimension < 500 && maxDimension < 1000;
  },

  isNestHubMax: () => {
    // Nest Hub Max has a 1280x800 resolution
    return window.innerWidth >= 1270 && window.innerWidth <= 1290 && 
           window.innerHeight >= 790 && window.innerHeight <= 810;
  },

  isNestHub: () => {
    // Regular Nest Hub has a 1024x600 resolution
    return window.innerWidth >= 1014 && window.innerWidth <= 1034 && 
           window.innerHeight >= 590 && window.innerHeight <= 610;
  },

  isIpadAirLandscape: () => {
    // iPad Air landscape has approximately 1180x820 resolution
    return window.innerWidth >= 1170 && window.innerWidth <= 1190 && 
           window.innerHeight >= 810 && window.innerHeight <= 830;
  }
};

/**
 * Get bubble size based on screen height (XS-XL system)
 * Unified scaling system for consistent proportions
 */
export function getBubbleSize(windowHeight: number): number {
  // Special case for Nest Hub Max - needs smaller bubbles to fit
  if (deviceDetection.isNestHubMax()) {
    return 65; // Smaller bubbles for Nest Hub Max
  }
  
  // Special case for regular Nest Hub - needs larger bubbles
  if (deviceDetection.isNestHub()) {
    return 70; // Larger bubbles for regular Nest Hub
  }
  
  // Special case for iPad Air landscape - needs smaller bubbles to fit
  if (deviceDetection.isIpadAirLandscape()) {
    return 70; // Smaller bubbles for iPad Air landscape
  }
  
  // Use the same breakpoints as header sizing for consistency
  if (windowHeight < 600) {
    return 50; // XS - Very small screens
  } else if (windowHeight < 700) {
    return 60; // SM - Small screens
  } else if (windowHeight < 800) {
    return 75; // MD - Medium screens (increased from 70)
  } else if (windowHeight < 1000) {
    return 90; // LG - Large screens (increased from 80)
  } else {
    return 110; // XL - Extra large screens (increased from 90)
  }
}

/**
 * Get gap size between bubbles based on screen height (XS-XL system)
 * Unified scaling system for consistent proportions
 */
export function getGapSize(windowHeight: number): number {
  // Special case for Nest Hub Max - needs tighter gaps to fit
  if (deviceDetection.isNestHubMax()) {
    return 16; // Tighter gaps for Nest Hub Max
  }
  
  // Special case for regular Nest Hub - needs appropriate gaps
  if (deviceDetection.isNestHub()) {
    return 18; // Appropriate gaps for regular Nest Hub
  }
  
  // Special case for iPad Air landscape - needs tighter gaps to fit
  if (deviceDetection.isIpadAirLandscape()) {
    return 18; // Tighter gaps for iPad Air landscape
  }
  
  // Use the same breakpoints as header sizing for consistency
  if (windowHeight < 600) {
    return 12; // XS - Very small screens
  } else if (windowHeight < 700) {
    return 16; // SM - Small screens
  } else if (windowHeight < 800) {
    return 20; // MD - Medium screens
  } else if (windowHeight < 1000) {
    return 24; // LG - Large screens
  } else {
    return 28; // XL - Extra large screens (iPad Pro portrait, etc.)
  }
}

// Grid configuration moved to CSS modules - no longer needed in JavaScript

/**
 * Get responsive layout mode and smart scaling for no-scroll experience
 * 
 * This system ensures the game always fits on screen without scrolling:
 * 1. First tries responsive layout adjustments (spacing, gaps)
 * 2. Only applies smart scaling when absolutely necessary
 * 3. More aggressive scaling for very constrained heights (down to 0.65)
 * 4. Special handling for known devices (Surface Pro 7, Surface Duo)
 */
export function getResponsiveLayoutMode(width: number, height: number, isTablet: boolean): 'compact' | 'normal' | 'spacious' {
  // Simple breakpoint-based layout - no device detection needed
  // Just use the screen dimensions to determine appropriate layout
  
  if (height < 600) {
    return 'compact'; // Very small screens
  } else if (height < 700) {
    return 'compact'; // Small screens
  } else if (height < 1000) {
    return 'normal'; // Medium to large screens
  } else {
    return 'spacious'; // Extra large screens (iPad Pro portrait, etc.)
  }
}

/**
 * Get header size mode for synchronized XS → XL system
 * Ensures header and logo sizes are perfectly synchronized
 * Now considers both height AND aspect ratio for better fit
 */
export function getHeaderSizeMode(width: number, height: number, isTablet: boolean): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
  // Simple breakpoint-based sizing - no device detection needed
  // Just use the screen dimensions to determine appropriate header size
  
  if (height < 600) {
    return 'xs'; // Very small screens
  } else if (height < 700) {
    return 'sm'; // Small screens
  } else if (height < 800) {
    return 'md'; // Medium screens
  } else if (height < 1000) {
    return 'lg'; // Large screens
  } else {
    return 'xl'; // Extra large screens (iPad Pro portrait, etc.)
  }
}

/**
 * Get smart scaling factor for no-scroll experience
 * Only scales when absolutely necessary to fit content on screen
 */
export function getDeviceScaleFactor(width: number, height: number, isTablet: boolean): number {
  if (isTablet) {
    // Calculate aspect ratio and available space
    const aspectRatio = width / height;
    const totalPixels = width * height;
    
    // More intelligent scaling based on both dimensions and aspect ratio
    let minHeightNeeded = 850; // Base height needed
    
    // Adjust height needed based on aspect ratio
    if (aspectRatio > 1.8) {
      // Very wide aspect ratio (like iPad Air) - needs more height
      minHeightNeeded = 900;
    } else if (aspectRatio > 1.6) {
      // Wide aspect ratio - needs slightly more height
      minHeightNeeded = 875;
    } else if (aspectRatio < 1.3) {
      // Narrow aspect ratio - can work with less height
      minHeightNeeded = 800;
    }
    
    // Adjust for very small total pixel count
    if (totalPixels < 400000) {
      minHeightNeeded = 750; // Surface Duo and similar
    }
    
    const minScale = Math.min(1, height / minHeightNeeded);
    
    // More aggressive scaling for very constrained heights
    let safeScale = minScale;
    
    // For very constrained heights, allow more aggressive scaling
    if (height < 600 || totalPixels < 400000) {
      safeScale = Math.max(0.6, minScale); // More aggressive for very small screens
    } else if (height < 700 || (height < 800 && aspectRatio > 1.8)) {
      safeScale = Math.max(0.65, minScale); // iPad Air and similar
    } else if (height < 850) {
      safeScale = Math.max(0.75, minScale); // Standard minimum
    } else {
      safeScale = Math.max(0.8, minScale); // Less aggressive for larger screens
    }
    
    // Special cases for known devices
    if (deviceDetection.isSurfacePro7()) {
      return Math.max(0.8, safeScale);
    }
    
    if (deviceDetection.isSurfaceDuo()) {
      return Math.max(0.7, safeScale); // More aggressive for Surface Duo
    }
    
    return safeScale;
  } else {
    // For portrait mode - no scaling needed
    return 1;
  }
} 