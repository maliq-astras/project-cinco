/**
 * Calculate dynamic spacing for bubble context area based on bubble size
 */
export const calculateBubbleContextSpacing = (bubbleSize: number): number => {
  return bubbleSize * 0.5; // 50% of bubble size for appropriate spacing
};