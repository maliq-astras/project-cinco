export const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const modalVariants = {
  hidden: {
    scale: 0.85,
    opacity: 0,
    x: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "backOut",
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  shake: {
    scale: 1,
    opacity: 1,
    x: [-8, 8, -8, 8, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeIn"
    }
  }
};

export const xMarkVariants = {
  hidden: {
    scale: 0,
    rotate: -180,
    opacity: 0
  },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "backOut",
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
};

export const textVariants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.8,
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const pulseVariants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      delay: 0.3
    }
  }
};