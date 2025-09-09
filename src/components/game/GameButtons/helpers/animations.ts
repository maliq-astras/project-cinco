/**
 * Get button animation props for interactive buttons
 */
export const getButtonAnimationProps = () => ({
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
  initial: { scale: 0.95 }
});

/**
 * Get disabled button animation props
 */
export const getDisabledButtonAnimationProps = () => ({
  initial: { scale: 0.95 }
});

/**
 * Get tooltip animation props with fade in effect
 */
export const getTooltipAnimationProps = () => ({
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 }
});

/**
 * Get hover animation props for buttons
 */
export const getButtonHoverProps = (isDisabled: boolean) => 
  isDisabled ? {} : { scale: 1.05 };

/**
 * Get tap animation props for buttons  
 */
export const getButtonTapProps = (isDisabled: boolean) =>
  isDisabled ? {} : { scale: 0.95 };