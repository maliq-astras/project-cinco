import { CSSProperties } from 'react';

/**
 * Generate background style for context line based on primary color
 */
export const getContextLineBackground = (primaryColor: string): CSSProperties => ({
  backgroundColor: `var(--color-${primaryColor}30)`
});

/**
 * Generate inline styles for the drop zone overlay
 */
export const getDropZoneOverlayStyles = (): CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 15,
  backgroundColor: 'rgba(0,0,0,0.05)',
  borderRadius: '0.5rem'
});