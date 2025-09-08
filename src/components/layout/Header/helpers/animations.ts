import { ANIMATIONS } from '@/constants/animations';

/**
 * Get logo animation props based on entrance completion state
 */
export const getLogoAnimationProps = (headerEntranceComplete: boolean) => ({
  initial: ANIMATIONS.LOGO.initial,
  animate: headerEntranceComplete ? 
    ANIMATIONS.LOGO.animate : 
    ANIMATIONS.LOGO.initial,
  transition: ANIMATIONS.LOGO.transition
});

/**
 * Get title animation props based on entrance completion state
 */
export const getTitleAnimationProps = (headerEntranceComplete: boolean) => ({
  initial: ANIMATIONS.CATEGORY_TITLE.initial,
  animate: headerEntranceComplete ? 
    ANIMATIONS.CATEGORY_TITLE.animate : 
    ANIMATIONS.CATEGORY_TITLE.initial,
  transition: ANIMATIONS.CATEGORY_TITLE.transition
});