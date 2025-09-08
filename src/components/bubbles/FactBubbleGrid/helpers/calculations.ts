export const getGridHeight = (
  isSingleRow: boolean,
  bubbleSize: number,
  gapSize: number
): number => {
  return isSingleRow ? bubbleSize : (2 * bubbleSize) + gapSize;
};

export const calculateGridScale = (
  willGridFit: boolean,
  availableContentHeight: number,
  gridHeight: number
): number => {
  return willGridFit ? 1 : Math.min(0.9, availableContentHeight / gridHeight);
};

export const isSingleRowLayout = (
  remainingFactsCount: number,
  layoutMode: string
): boolean => {
  return remainingFactsCount <= 4 && remainingFactsCount > 0 && layoutMode === 'desktop';
};