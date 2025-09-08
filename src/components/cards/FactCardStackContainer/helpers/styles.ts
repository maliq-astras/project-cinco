import React from 'react';

export const getResponsiveContainerStyle = (spacing: number): React.CSSProperties => ({
  padding: `${spacing}px`,
  marginBottom: `${spacing}px`
});