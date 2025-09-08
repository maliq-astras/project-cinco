import { CSSProperties } from 'react';

/**
 * Calculate responsive layout class based on tablet landscape mode and layout mode
 */
export const getResponsiveLayoutClass = (
  isTabletLandscape: boolean,
  responsiveLayoutMode: string
): string => {
  if (!isTabletLandscape) return '';
  
  switch (responsiveLayoutMode) {
    case 'compact':
      return 'layout-compact';
    case 'spacious':
      return 'layout-spacious';
    default:
      return 'layout-normal';
  }
};

/**
 * Calculate smart scaling style for tablet landscape mode
 */
export const getSmartScalingStyle = (
  isTabletLandscape: boolean,
  scaleFactor: number
): CSSProperties => {
  if (!isTabletLandscape || scaleFactor >= 0.99) {
    return {}; // No scaling needed
  }
  
  return {
    transform: `scale(${scaleFactor})`,
    transformOrigin: 'center top',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    overflow: 'visible'
  };
};