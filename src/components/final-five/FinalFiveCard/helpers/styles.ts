import React from 'react';

export const getWrapperStyle = (): React.CSSProperties => ({ 
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d"
});

export const getFrontCardStyle = (frontBg: string): React.CSSProperties => ({ 
  backgroundColor: frontBg,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
});

export const getContainerStyle = (
  minHeight: string, 
  maxWidth: string, 
  canClick: boolean
): React.CSSProperties => ({ 
  minHeight,
  maxWidth,
  margin: "0 auto",
  pointerEvents: canClick ? "auto" : "none"
});