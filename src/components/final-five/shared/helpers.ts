/**
 * Calculate responsive dimensions for Final Five cards
 * @param width Screen width
 * @param height Screen height  
 * @param isLandscape Whether device is in landscape orientation
 * @returns Object with minHeight and maxWidth properties
 */
export function getFinalFiveCardDimensions(width: number, height: number, isLandscape: boolean) {
  if (width <= 480) {
    return {
      minHeight: "80px",
      maxWidth: "140px"
    };
  } else if (width <= 768) {
    return {
      minHeight: "90px",
      maxWidth: "160px"
    };
  } else if (height <= 680) {
    return {
      minHeight: "70px",
      maxWidth: "130px"
    };
  } else {
    return {
      minHeight: "100px",
      maxWidth: "180px"
    };
  }
}

/**
 * Generate CSS classes for Final Five grid layout
 * @param width Screen width
 * @param height Screen height
 * @param isLandscape Whether device is in landscape orientation
 * @returns CSS class string for grid layout
 */
export function getFinalFiveGridClasses(width: number, height: number, isLandscape: boolean): string {
  if (width <= 480) {
    return "grid grid-cols-2 gap-3 mb-4 mx-auto max-w-[320px] px-2";
  } else if (width <= 768) {
    return "grid grid-cols-2 gap-4 mb-6 mx-auto max-w-[420px] px-2";
  } else if (height <= 680) {
    return "grid grid-cols-3 grid-rows-2 gap-3 mb-4 mx-auto max-w-[650px]";
  } else {
    return "grid grid-cols-3 grid-rows-2 gap-4 mb-6 mx-auto max-w-[600px]";
  }
}