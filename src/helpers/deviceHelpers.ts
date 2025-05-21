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
           window.innerWidth < 1400 && 
           window.innerHeight < 950;
  }
};

/**
 * Get bubble size based on device type and screen dimensions
 */
export function getBubbleSize(windowWidth: number): number {
  if (deviceDetection.isGalaxyS9Plus()) {
    return 60; // Extra small bubbles specifically for Galaxy S9+
  }
  
  if (deviceDetection.isOtherGalaxyPhone()) {
    return 62; // Smaller bubbles for other Samsung Galaxy phones
  }
  
  if (deviceDetection.isSurfacePro7()) {
    return 75; // Smaller bubbles specifically for Surface Pro 7 in landscape
  }
  
  if (deviceDetection.isSurfaceDuo()) {
    return 68; // Smaller bubbles for Surface Duo
  }
  
  if (deviceDetection.isTabletLandscape()) {
    return 80; // Smaller bubbles for tablet landscape with similar proportions
  }
  
  if (windowWidth < 380) return 65; // Small mobile
  if (windowWidth < 480) return 70; // Medium mobile
  if (windowWidth < 640) return 75; // Large mobile
  if (windowWidth < 768) return 80; // Small tablets
  if (windowWidth < 1024) return 90; // Larger tablets
  if (windowWidth < 1280) return 100; // Small desktops
  return 110; // Large desktops
}

/**
 * Get gap size between bubbles based on device type and screen dimensions
 */
export function getGapSize(windowWidth: number): number {
  if (deviceDetection.isGalaxyS9Plus()) {
    return 12; // Much tighter gap for Galaxy S9+
  }
  
  if (deviceDetection.isSurfaceDuo()) {
    return 16; // Tighter gap for Surface Duo
  }
  
  if (deviceDetection.isSurfacePro7() || deviceDetection.isTabletLandscape()) {
    return 20; // Tighter gap for tablets and Surface Pro 7
  }
  
  if (windowWidth < 380) return 16;
  if (windowWidth < 640) return 20;
  if (windowWidth < 1024) return 24;
  return 32;
}

/**
 * Get bubble grid configuration based on device type
 */
export function getGridConfig(windowWidth: number) {
  // Special case for Galaxy S9+ and other very narrow devices
  if (deviceDetection.isGalaxyS9Plus() || windowWidth <= 330) {
    return {
      cols: 3, // Reduce to 3 columns for Galaxy S9+
      rows: 3, // Adjust rows to keep total slots to ~8-9
      totalSlots: 9
    };
  }
  
  // Default config
  return {
    cols: 4,
    rows: 2,
    totalSlots: 8
  };
}

/**
 * Get container height for bubble grid based on device type
 */
export function getContainerHeight(windowWidth: number, gridConfig: { rows: number, cols: number }) {
  if (deviceDetection.isGalaxyS9Plus()) {
    return 200; // Taller container for 3 rows of bubbles on Galaxy S9+
  }
  
  if (deviceDetection.isSurfaceDuo()) {
    return 155; // Custom height for Surface Duo
  }
  
  if (deviceDetection.isSurfacePro7()) {
    return 170; // Smaller height for Surface Pro 7
  }
  
  if (deviceDetection.isTabletLandscape()) {
    return 180; // Adjusted height for tablet landscape
  }
  
  if (windowWidth < 380) return 140; // Small mobile
  if (windowWidth < 480) return 150; // Medium mobile
  if (windowWidth < 640) return 160; // Large mobile
  
  // For larger screens, dynamically calculate based on bubble and gap
  return gridConfig.rows * getBubbleSize(windowWidth) + getGapSize(windowWidth) * (gridConfig.rows - 1);
}

/**
 * Get scaling factor for device-specific sizing
 */
export function getDeviceScaleFactor(width: number, height: number, isTablet: boolean): number {
  if (isTablet) {
    // For tablet landscape mode
    let scaleFactor = Math.min(0.7, height / 950);
    
    // For very constrained heights
    if (height < 550) {
      scaleFactor = Math.min(0.65, height / 1000);
    }
    
    // Special case for Surface Pro 7
    if (deviceDetection.isSurfacePro7()) {
      scaleFactor = 0.85; // Optimal scaling for Surface Pro 7
    }
    
    // Special case for Surface Duo
    if (deviceDetection.isSurfaceDuo()) {
      scaleFactor = 0.75; // Optimal scaling for Surface Duo
    }
    
    return scaleFactor;
  } else {
    // Default scale factor for portrait mode
    let defaultScale = 1;
    
    // Special case for Galaxy S9+
    if (deviceDetection.isGalaxyS9Plus()) {
      defaultScale = 0.95; // Slightly smaller scale for Galaxy S9+
    }
    
    // Special case for Surface Duo portrait
    if (deviceDetection.isSurfaceDuo()) {
      defaultScale = 0.9; // Slightly smaller scale for Surface Duo
    }
    
    return defaultScale;
  }
} 