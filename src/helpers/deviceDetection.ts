/**
 * Device detection utilities
 * Helps distinguish between actual phones vs desktop/laptop browser windows
 */

/**
 * Hybrid approach to detect if user is on an actual mobile device (phone)
 * Combines touch capability, user agent, and screen size checks
 */
export const isMobile = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|iPhone|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
  const isPhoneSize = screen.width <= 430; // Covers up to iPhone Pro Max
  
  // Return true if it has mobile user agent + touch, OR if it's touch device with phone-sized screen
  return (hasTouch && isMobileUA) || (hasTouch && isPhoneSize);
};

/**
 * Check if current screen size is below minimum thresholds
 */
export const isScreenTooSmall = (width: number, height: number, isActualMobile: boolean): boolean => {
  if (isActualMobile) {
    // Mobile device: 650px height, 320px width minimum
    return height < 650 || width < 320;
  } else {
    // Desktop/laptop: 600px height minimum
    return height < 600;
  }
};

/**
 * Get appropriate message for screen size warning
 */
export const getScreenSizeMessage = (isActualMobile: boolean): string => {
  if (isActualMobile) {
    return "Please increase your screen size to play the game.";
  } else {
    return "Please increase your screen height to continue.";
  }
};