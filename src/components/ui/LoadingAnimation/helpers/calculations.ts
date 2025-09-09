export const calculateFontSize = (text: string) => {
  if (!text) return "clamp(28px, 5vw, 44px)";
  
  if (text.length > 15) {
    return "clamp(22px, 4vw, 34px)";
  } else if (text.length > 10) {
    return "clamp(24px, 4.5vw, 38px)";
  } else {
    return "clamp(28px, 5vw, 44px)";
  }
};

export const calculateAnimationSpeed = (currentIndex: number, totalCategories: number) => {
  const categorySpeed = 100;
  const progress = currentIndex / totalCategories;
  
  if (progress < 0.3) {
    return categorySpeed * 3;
  } else if (progress < 0.6) {
    return categorySpeed * 2;
  } else if (progress < 0.85) {
    return categorySpeed;
  } else {
    return categorySpeed * 4;
  }
};

export const TIMING_CONSTANTS = {
  CATEGORY_SPEED: 100,
  FINAL_CATEGORY_HOLD_TIME: 2500,
  INITIAL_DELAY: 800,
  COMPLETION_DELAY: 2500
} as const;