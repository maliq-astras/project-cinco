export const calculateBubbleSizes = () => {
  // Bubble sizes: [large, medium, small, medium, large]
  return [48, 40, 32, 40, 48];
};

export const calculateSelectedCount = (selectedItems: string[]) => {
  return selectedItems.length;
};

export const isItemSelected = (item: string, selectedItems: string[]) => {
  return selectedItems.includes(item);
};

export const canSelectMoreItems = (selectedItems: string[], maxItems: number = 3) => {
  return selectedItems.length < maxItems;
};

// Mobile height calculations using responsive data
export const calculateMobileHeight = (width: number, height: number, heightBreakpoint: 'short' | 'medium' | 'tall') => {
  // Super narrow phones (under 375px) need more height due to layout constraints
  if (width < 375) {
    return '98dvh';
  }

  // Regular width phones use height-based calculation
  switch (heightBreakpoint) {
    case 'short': // 0-599px
      return '98dvh';
    case 'medium': // 600-799px
      return '98dvh';
    case 'tall': // 800+px
      return '75dvh';
    default:
      return '80dvh';
  }
};

export const calculateContentHeight = (isMobile: boolean, modalHeight: string) => {
  if (!isMobile) {
    return '470px'; // Desktop stays the same
  }
  
  // Calculate content height as percentage of modal height
  // Account for header (~60px) + nav buttons (~60px) + progress bar (~30px) + padding (~20px) = ~170px
  // So content should be: calc(modalHeight - 170px)
  return `calc(${modalHeight} - 100px)`;
};