import { useState, useEffect } from 'react';
import { isMobileDevice, isScreenTooSmall } from '@/helpers/deviceDetection';

/**
 * useScreenSizeValidation - Hook for screen size detection and validation
 * 
 * Returns screen validation state and whether to show size warning.
 * Follows the codebase pattern of using hooks for state management
 * rather than wrapper components.
 */
export const useScreenSizeValidation = (isNarrow: boolean) => {
  // Track current screen dimensions for size checks
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 16); // 16ms ≈ 60fps
    };
    
    updateDimensions(); // Initial call
    window.addEventListener('resize', debouncedUpdateDimensions);
    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Determine actual device type and layout needs
  const isActualMobileDevice = isMobileDevice();
  const needsMobileLayout = isNarrow;
  
  // Check if screen is too small (only after dimensions are initialized)
  const screenTooSmall = screenDimensions.width > 0 && screenDimensions.height > 0 && 
    isScreenTooSmall(screenDimensions.width, screenDimensions.height, isActualMobileDevice, needsMobileLayout);
  
  return {
    isScreenTooSmall: screenTooSmall,
    isActualMobileDevice,
    screenDimensions
  };
};