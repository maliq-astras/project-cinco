export const loadingAnimations = {
  logo: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
  
  category: {
    initial: { y: 80, opacity: 0 },
    animate: (isShowingFinalCategory: boolean) => ({ 
      y: 0, 
      opacity: 1,
      scale: isShowingFinalCategory ? 1.08 : 1 
    }),
    exit: { y: -80, opacity: 0 },
    transition: (isShowingFinalCategory: boolean) => ({ 
      type: isShowingFinalCategory ? "spring" : "tween",
      stiffness: 80,
      damping: 12,
      mass: 1.2,
      duration: isShowingFinalCategory ? 0.75 : 0.15,
      ease: isShowingFinalCategory ? [0.34, 1.56, 0.64, 1] : "easeInOut",
      opacity: { 
        duration: isShowingFinalCategory ? 0.65 : 0.1
      },
      scale: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
      }
    })
  },
  
  line: {
    initial: { width: 0 },
    animate: { width: "100vw" },
    transition: { 
      duration: 1.2, 
      ease: "easeOut", 
      delay: 0.2 
    }
  },
  
  loading: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.5, 
      delay: 0.5 
    }
  },
  
  skipButton: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.5, 
      delay: 0.8 
    }
  }
} as const;