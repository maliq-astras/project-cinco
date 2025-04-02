export const finalFiveIntroStyles = {
  container: "flex flex-col items-center justify-start gap-16 p-8",
  message: "text-xl sm:text-2xl text-left font-display leading-relaxed max-w-2xl",
  buttonContainer: "flex flex-col items-center relative",
  button: "px-8 py-4 rounded-full font-display text-white font-bold shadow-lg transition-transform hover:scale-105 text-lg",
  countdownContainer: "absolute top-full mt-6",
  countdownAnimation: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  containerAnimation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  messageAnimation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  },
  buttonAnimation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.4 }
  }
} as const; 