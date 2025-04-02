import { CSSProperties } from 'react';

export const gameTutorialStyles = {
  container: "fixed inset-0 z-50 cursor-pointer",
  overlay: "absolute inset-0",
  overlayMask: (spotlightStyles: { left: string; top: string; width: string; height: string }): CSSProperties => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='mask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Crect x='${parseFloat(spotlightStyles.left)}' y='${parseFloat(spotlightStyles.top)}' width='${parseFloat(spotlightStyles.width)}' height='${parseFloat(spotlightStyles.height)}' rx='8' fill='black'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' mask='url(%23mask)' fill='black'/%3E%3C/svg%3E")`,
    maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='mask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Crect x='${parseFloat(spotlightStyles.left)}' y='${parseFloat(spotlightStyles.top)}' width='${parseFloat(spotlightStyles.width)}' height='${parseFloat(spotlightStyles.height)}' rx='8' fill='black'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' mask='url(%23mask)' fill='black'/%3E%3C/svg%3E")`,
  }),
  spotlight: (spotlightStyles: { top: string; left: string; width: string; height: string }): CSSProperties => ({
    top: parseFloat(spotlightStyles.top) - 2 + 'px',
    left: parseFloat(spotlightStyles.left) - 2 + 'px',
    width: parseFloat(spotlightStyles.width) + 4 + 'px',
    height: parseFloat(spotlightStyles.height) + 4 + 'px',
    borderRadius: '10px',
    pointerEvents: 'none' as const,
    border: '2px solid white',
    boxShadow: '0 0 15px 3px rgba(255, 255, 255, 0.7)',
    backgroundColor: 'transparent',
  }),
  spotlightWrapper: "absolute transition-all duration-300 ease-in-out z-20",
  textBox: "fixed bg-white rounded-lg shadow-xl p-6 sm:p-4 border-2 z-30",
  textBoxTitle: "text-xl sm:text-lg font-semibold mb-3 sm:mb-2",
  textBoxDescription: "text-gray-600 text-base sm:text-sm leading-relaxed",
  progressContainer: "fixed left-0 right-0 flex flex-col items-center pointer-events-none z-30",
  progressDots: "flex space-x-2 mb-3",
  progressDot: "w-1.5 h-1.5 rounded-full transition-colors",
  progressText: "text-white text-sm font-medium opacity-75",

  // Animations
  textBoxAnimation: {
    initial: { opacity: 0, scale: 0.9 },
    animate: (textBoxStyles: { left: string; top: string; width: string }) => ({ 
      opacity: 1,
      scale: 1,
      x: parseFloat(textBoxStyles.left),
      y: parseFloat(textBoxStyles.top),
      width: parseFloat(textBoxStyles.width)
    }),
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      layout: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  progressAnimation: {
    initial: { opacity: 0 },
    animate: (spotlightStyles: { top: string }, textBoxStyles: { top: string }) => ({ 
      opacity: 1,
      y: Math.max(
        16,
        Math.min(
          window.innerHeight - 100,
          Math.min(
            parseFloat(spotlightStyles.top) - 60,
            parseFloat(textBoxStyles.top) - 60
          )
        )
      )
    }),
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      layout: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }
} as const; 