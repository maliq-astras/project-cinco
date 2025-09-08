import React, { CSSProperties } from 'react';
import CompactHeader from '../CompactHeader';
import Header from '../Header';
import Navigation from '../Navigation';

interface HeaderSelectionProps {
  breakpoint: string;
  headerEntranceComplete: boolean;
}

/**
 * getHeaderComponent - Helper function for responsive header selection
 * 
 * Returns the appropriate header component based on breakpoint.
 * Follows the codebase pattern of using helper functions for
 * conditional logic rather than wrapper components.
 * 
 * Logic:
 * - CompactHeader: xs, sm, md breakpoints (limited space scenarios)
 * - Header + Navigation: lg, xl breakpoints (sufficient vertical space)
 */
export const getHeaderComponent = ({ 
  breakpoint, 
  headerEntranceComplete 
}: HeaderSelectionProps): React.ReactElement => {
  // Use CompactHeader for smaller breakpoints (xs, sm, md)
  const useCompactHeader = 
    breakpoint === 'xs' || 
    breakpoint === 'sm' || 
    breakpoint === 'md';

  if (useCompactHeader) {
    return <CompactHeader headerEntranceComplete={headerEntranceComplete} />;
  }

  // Use Header + Navigation for larger breakpoints (lg, xl)
  return (
    <>
      <Navigation headerEntranceComplete={headerEntranceComplete} />
      <Header headerEntranceComplete={headerEntranceComplete} />
    </>
  );
};

// MainContainer-specific layout utilities
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