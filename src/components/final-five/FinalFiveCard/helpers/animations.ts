export const getFinalFiveCardAnimations = (shouldFadeOut: boolean) => ({
  animate: { 
    opacity: shouldFadeOut ? 0 : 1,
    scale: shouldFadeOut ? 0.8 : 1
  },
  transition: { duration: 0.5 }
});

export const getFlipAnimationProps = (isFlipped: boolean) => ({
  initial: { rotateY: 0 },
  animate: { rotateY: isFlipped ? 180 : 0 },
  transition: {
    type: "spring" as const, 
    stiffness: 200,
    damping: 25,
    duration: 0.8
  }
});

export const getXOverlayAnimations = () => ({
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 0.9, scale: 1 },
  transition: { duration: 0.3, delay: 0.2 }
});