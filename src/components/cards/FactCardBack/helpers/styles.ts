import React from 'react';

export const getBackgroundStyle = (primaryColor: string): React.CSSProperties => ({
  '--fact-card-color': `var(--color-${primaryColor})`
} as React.CSSProperties);

export const getIconStyle = (): React.CSSProperties => ({
  filter: "brightness(0) invert(1)",
  WebkitFilter: "brightness(0) invert(1)",
  opacity: 1,
  maxWidth: "100%",
  background: 'transparent'
});