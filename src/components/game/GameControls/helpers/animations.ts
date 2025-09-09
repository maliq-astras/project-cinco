/**
 * Get wrapper animation props based on victory state
 */
export const getWrapperAnimationProps = (isVictoryAnimationActive: boolean) => ({
  initial: { opacity: 1 },
  animate: { opacity: isVictoryAnimationActive ? 0 : 1 },
  transition: { duration: 0.5 }
});