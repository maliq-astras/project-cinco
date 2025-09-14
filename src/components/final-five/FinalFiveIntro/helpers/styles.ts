import React from 'react';

export const getButtonStyle = (primaryColor: string, isTransitioning: boolean): React.CSSProperties => ({
  backgroundColor: `var(--color-${primaryColor})`,
  opacity: isTransitioning ? 0.7 : 1,
  pointerEvents: isTransitioning ? 'none' : 'auto'
});

