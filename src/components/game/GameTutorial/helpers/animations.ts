/**
 * Get text box animation props
 */
export const getTextBoxAnimationProps = (textBoxStyles: { left: string; top: string; width: string }) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1,
    scale: 1,
    x: parseFloat(textBoxStyles.left),
    y: parseFloat(textBoxStyles.top),
    width: parseFloat(textBoxStyles.width)
  },
  transition: { 
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
    layout: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
});

/**
 * Get title animation props
 */
export const getTitleAnimationProps = () => ({
  layout: "position" as const,
  transition: { duration: 0.4 }
});

/**
 * Get description animation props
 */
export const getDescriptionAnimationProps = () => ({
  layout: "position" as const,
  transition: { duration: 0.4 }
});

/**
 * Get progress container animation props
 */
export const getProgressContainerAnimationProps = () => ({
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    y: 0
  },
  transition: { 
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1]
  }
});