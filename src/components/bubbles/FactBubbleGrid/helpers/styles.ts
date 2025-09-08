import React from 'react';

export const getContainerStyle = (
  bubbleSize: number,
  gapSize: number,
  spacingValue: number,
  remainingFactsCount: number
): React.CSSProperties => {
  return {
    '--bubble-size': `${bubbleSize}px`,
    '--bubble-spacing': `${gapSize}px`,
    '--grid-margin-top': `${spacingValue}px`,
    '--remaining-count': remainingFactsCount
  } as React.CSSProperties;
};

export const getGridTransformStyle = (gridScale: number): React.CSSProperties | undefined => {
  if (gridScale === 1) return undefined;
  
  return {
    transform: `scale(${gridScale})`,
    transformOrigin: 'center'
  };
};