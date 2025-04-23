import { CSSProperties } from 'react';

export const endGameMessageStyles = {
  container: "w-full flex justify-center items-center relative",
  messageWrapper: "relative px-4",
  messageContent: "text-xl sm:text-2xl font-display text-center flex flex-col items-center gap-4",
  timeDisplay: "flex items-center gap-3 text-base",
  shareIcon: "h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity",
  tomorrowMessage: "text-base font-medium mt-4",
  confettiPiece: "absolute left-1/2 top-1/2",
  
  // Animations
  messageWrapperAnimation: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  },
  messageContentAnimation: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, delay: 0.3 }
  },
  tomorrowMessageAnimation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  confettiAnimation: (angle: number) => ({
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
  }),
  
  // Text styles
  answerText: (primaryColor: string): CSSProperties => ({
    fontWeight: 'bold',
    color: `var(--color-${primaryColor})`
  }),
  
  // Confetti styles
  confettiPieceStyle: (size: number, color: string): CSSProperties => ({
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%'
  }),
  
  // Time display styles
  timeDisplayText: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  })
} as const; 