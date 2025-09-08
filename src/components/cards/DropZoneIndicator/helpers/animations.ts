export const getDropZoneAnimationProps = (isVisible: boolean) => ({
  initial: { opacity: 0, scale: 0.98, y: 5 },
  animate: { 
    opacity: isVisible ? 1 : 0,
    scale: isVisible ? 1 : 0.98,
    y: isVisible ? 0 : 5
  },
  transition: { 
    duration: 0.2,
    ease: "easeOut" as const
  }
});