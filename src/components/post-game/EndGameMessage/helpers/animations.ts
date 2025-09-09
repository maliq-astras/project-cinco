export const endGameMessageAnimations = {
  messageWrapper: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  },
  
  messageContent: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, delay: 0.3 }
  },
  
  streakDisplay: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  },
  
  messageText: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 1.0 }
  },
  
  tomorrowMessage: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, delay: 2.0 }
  },
  
  confetti: (angle: number) => ({
    initial: { 
      x: 0, 
      y: 0,
      scale: 0,
      opacity: 1
    },
    animate: { 
      x: [0, Math.cos(angle) * 80],
      y: [0, Math.sin(angle) * 80],
      scale: [0, 1, 0.5],
      opacity: [1, 1, 0]
    },
    transition: {
      duration: 2,
      ease: "easeOut"
    }
  })
} as const;