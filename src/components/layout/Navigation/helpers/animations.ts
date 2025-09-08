import { ANIMATIONS } from '@/constants/animations';

/**
 * Get hard mode badge animation props based on entrance completion state
 */
export const getHardModeBadgeAnimationProps = (headerEntranceComplete: boolean) => ({
  initial: ANIMATIONS.NAVIGATION.initial,
  animate: headerEntranceComplete ? ANIMATIONS.NAVIGATION.animate : ANIMATIONS.NAVIGATION.initial,
  transition: { ...ANIMATIONS.NAVIGATION.transition, delay: 0.1 }
});

/**
 * Get dropdown button icon animation props based on entrance completion state
 */
export const getDropdownIconAnimationProps = (headerEntranceComplete: boolean) => ({
  initial: { rotate: -90 },
  animate: headerEntranceComplete ? { rotate: 0 } : { rotate: -90 },
  transition: { ...ANIMATIONS.NAVIGATION.transition, delay: 0.15, duration: 0.3 }
});

/**
 * Get settings button animation props based on entrance completion state
 */
export const getSettingsButtonAnimationProps = (headerEntranceComplete: boolean) => ({
  initial: ANIMATIONS.NAVIGATION.initial,
  animate: headerEntranceComplete ? ANIMATIONS.NAVIGATION.animate : ANIMATIONS.NAVIGATION.initial,
  transition: { ...ANIMATIONS.NAVIGATION.transition, delay: 0.2 }
});

/**
 * Get settings icon animation props based on entrance completion state
 */
export const getSettingsIconAnimationProps = (headerEntranceComplete: boolean) => ({
  initial: { rotate: -90 },
  animate: headerEntranceComplete ? { rotate: 0 } : { rotate: -90 },
  transition: { ...ANIMATIONS.NAVIGATION.transition, delay: 0.25, duration: 0.3 }
});