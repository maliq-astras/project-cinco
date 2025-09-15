import { useMemo, type CSSProperties } from 'react';
import { ResponsiveValues } from '@/types/responsive';

interface UseFactCardStackContainerStylesProps {
  height: number;
  isLandscape: boolean;
  responsiveValues: ResponsiveValues;
  isDesktopLayout: boolean;
}

/**
 * Hook for computing FactCardStackContainer styles
 * @param props Dependencies for style calculations
 * @returns Computed styles
 */
export function useFactCardStackContainerStyles({
  height,
  isLandscape,
  responsiveValues,
  isDesktopLayout
}: UseFactCardStackContainerStylesProps) {

  const containerStyles = useMemo<CSSProperties>(() => {
    const calculateOptimalHeight = () => {
      const reservedSpace = isLandscape ? 450 : 400;
      const availableSpace = Math.max(0, height - reservedSpace);
      const heightPercentage = isLandscape ? 0.3 : 0.35;
      const calculatedHeight = Math.max(availableSpace * heightPercentage, 150);
      const minHeight = 120;
      const maxHeight = isLandscape ? 200 : 250;
      return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
    };

    const optimalHeight = calculateOptimalHeight();

    if (isDesktopLayout) {
      return {
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      };
    }
    
    return {
      height: `${optimalHeight}px`,
      minHeight: `${optimalHeight}px`,
      marginTop: `${responsiveValues.spacing * 5}px`
    };
  }, [height, isLandscape, responsiveValues, isDesktopLayout]);

  return {
    containerStyles
  };
}