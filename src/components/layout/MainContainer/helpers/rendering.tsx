import React, { CSSProperties } from 'react';
import CompactHeader from '@/components/layout/CompactHeader';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';

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

// Moved getResponsiveLayoutClass and getSmartScalingStyle to calculations.ts