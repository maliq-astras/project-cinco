export const streakDisplayAnimations = {
  dayIndicator: (shouldAnimate: boolean, index: number, animatedDays: boolean[], finalBackgroundColor: string) => ({
    initial: { scale: 0, backgroundColor: 'transparent' },
    animate: {
      scale: animatedDays[index] ? 1 : 0.8,
      opacity: animatedDays[index] ? 1 : 0.5,
      backgroundColor: animatedDays[index] ? finalBackgroundColor : 'transparent'
    },
    transition: {
      duration: 0.3,
      delay: shouldAnimate ? index * 0.1 : 0
    }
  }),

  completedSymbol: (shouldAnimate: boolean, index: number, currentDay: number) => ({
    initial: { scale: 0, rotate: -90, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: { 
      duration: 0.4,
      delay: shouldAnimate ? 
        (index === currentDay ? 0.4 + index * 0.1 : index * 0.1) : 0,
      type: "spring" as const,
      stiffness: 200
    }
  }),

  failedSymbol: (shouldAnimate: boolean, index: number, currentDay: number) => ({
    initial: { scale: 0, rotate: -90, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: { 
      duration: 0.4,
      delay: shouldAnimate ? 
        (index === currentDay ? 0.4 + index * 0.1 : index * 0.1) : 0,
      type: "spring" as const,
      stiffness: 200
    }
  }),

  missedSymbol: (shouldAnimate: boolean, index: number, currentDay: number) => ({
    initial: { scale: 0, rotate: -90, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: { 
      duration: 0.4,
      delay: shouldAnimate ? 
        (index === currentDay ? 0.4 + index * 0.1 : index * 0.1) : 0,
      type: "spring" as const,
      stiffness: 200
    }
  })
} as const;