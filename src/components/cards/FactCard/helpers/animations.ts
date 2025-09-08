export const getFlipCardAnimationProps = (isFlipped: boolean, isDrawn: boolean, isClosing: boolean) => ({
  initial: { rotateY: 0 },
  animate: { rotateY: isFlipped && isDrawn && !isClosing ? 180 : 0 },
  style: { transformStyle: 'preserve-3d' as const }
});

export const factTypeClasses = 'text-base sm:text-lg font-semibold text-center mt-4 fact-type';