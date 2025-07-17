import { CSSProperties } from 'react';

export const logoStyles = {
  image: (width?: number | string, height?: number | string): CSSProperties => ({
    width: width || 'auto',
    height: height || 'auto',
    display: 'block',
    objectFit: 'contain'
  })
} as const; 