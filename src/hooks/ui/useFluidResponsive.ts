/**
 * Hook for fluid responsive design
 * Provides smooth, scalable values that adapt to any screen size
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  getFluidBubbleSize, 
  getFluidGapSize, 
  getFluidCardSize, 
  getFluidHeaderSize,
  getFluidGridConfig,
  shouldUseCompactLayout,
  getResponsiveBreakpoint,
  generateResponsiveCSS
} from '@/helpers/responsiveHelpers';
import { useThemeDOM } from '@/hooks/useThemeDOM';

export function useFluidResponsive() {
  const { setCSSProperty } = useThemeDOM();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  // Update dimensions on resize with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 16); // ~60fps
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Calculate all responsive values
  const responsiveValues = useMemo(() => {
    const { width, height } = dimensions;
    
    const bubbleSize = getFluidBubbleSize(width, height);
    const gapSize = getFluidGapSize(width, height);
    const cardSize = getFluidCardSize(width, height);
    const headerSize = getFluidHeaderSize(width, height);
    const gridConfig = getFluidGridConfig(width, height, bubbleSize, gapSize);
    const isCompact = shouldUseCompactLayout(width, height);
    const breakpoint = getResponsiveBreakpoint(width);
    const cssVars = generateResponsiveCSS(width, height);

    return {
      // Dimensions
      width,
      height,
      aspectRatio: width / height,
      
      // Layout decisions
      isCompact,
      breakpoint,
      
      // Element sizes
      bubbleSize,
      gapSize,
      cardSize,
      headerSize,
      gridConfig,
      
      // CSS custom properties
      cssVars,
      
      // Helper functions
      applyResponsiveStyles: (element: HTMLElement) => {
        Object.entries(cssVars).forEach(([property, value]) => {
          element.style.setProperty(property, value);
        });
      }
    };
  }, [dimensions]);

  // Apply CSS custom properties to document root
  useEffect(() => {
    Object.entries(responsiveValues.cssVars).forEach(([property, value]) => {
      setCSSProperty(property, value);
    });
  }, [responsiveValues.cssVars, setCSSProperty]);

  return responsiveValues;
}
