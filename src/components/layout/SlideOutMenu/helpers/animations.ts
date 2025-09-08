export const getBackdropAnimationProps = () => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
});

export const getSlideMenuAnimationProps = () => ({
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: {
    type: 'spring',
    damping: 25,
    stiffness: 200,
  }
});

export const getCloseButtonAnimationProps = () => ({
  whileHover: { scale: 1.2 },
  whileTap: { scale: 0.9 }
});

export const getMenuItemAnimationProps = (index: number) => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: index * 0.1 }
});