export const useGameButtons = () => {
  // Animation configurations
  const buttonAnimation = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    initial: { scale: 0.95 }
  };

  const disabledButtonAnimation = {
    initial: { scale: 0.95 }
  };

  const tooltipAnimation = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 }
  };

  return {
    buttonAnimation,
    disabledButtonAnimation,
    tooltipAnimation
  };
};
