export const getContainerAnimations = () => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
});

export const getMessageAnimations = () => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.2 }
});

export const getButtonAnimations = () => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.5 }
});

export const getLoadingAnimations = () => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.5 }
});

export const getButtonHoverProps = (isTransitioning: boolean) => ({
  whileHover: !isTransitioning ? { scale: 1.05 } : {},
  whileTap: !isTransitioning ? { scale: 0.95 } : {}
});