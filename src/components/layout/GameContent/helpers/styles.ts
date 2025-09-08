/**
 * Generate inline styles for the drop zone overlay
 */
export const getDropZoneOverlayStyles = () => ({
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

/**
 * Generate inline styles for bubble context area positioning
 */
export const getBubbleContextAreaStyles = (bubbleContextSpacing: number) => ({
  bottom: `-${bubbleContextSpacing}px`
});