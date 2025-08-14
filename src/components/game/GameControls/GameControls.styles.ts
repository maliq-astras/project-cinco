export const gameControlsStyles = {
  container: "w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center",
  wrapper: "w-full max-w-lg mx-auto",
  controlsArea: "w-full border-t border-gray-200 px-2 pt-3 pb-2 sm:px-0 sm:py-3 sm:border-0 sm:flex sm:flex-col sm:items-center z-10",
  factsArea: "flex w-full max-w-md sm:max-w-lg lg:max-w-xl gap-2 mx-auto",
  
  // Animations
  wrapperAnimation: {
    initial: { opacity: 1 },
    animate: (isVictoryAnimationActive: boolean) => ({ 
      opacity: isVictoryAnimationActive ? 0 : 1 
    }),
    transition: { duration: 0.5 }
  }
} as const; 