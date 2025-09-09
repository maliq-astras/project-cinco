/**
 * Get container animation props for autocomplete dropdown
 */
export const getContainerAnimationProps = () => ({
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" }
});

/**
 * Get suggestion item animation props with staggered delay
 */
export const getSuggestionAnimationProps = (index: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { delay: index * 0.02 }
});