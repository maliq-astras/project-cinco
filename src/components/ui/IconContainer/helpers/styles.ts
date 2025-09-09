import styles from '../IconContainer.module.css';

/**
 * Extracted styles for icon components
 */
export const iconContainerStyles = {
  // Static styles from CSS modules
  container: styles.container,
  darkBackground: styles.darkBackground,
  cardBackContainer: styles.cardBackContainer,
  
  // Size classes from CSS modules
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

/**
 * Style helper functions
 */
export function getIconContainerBgStyle(isRevealed: boolean, colorVar: string) {
  return isRevealed ? undefined : { backgroundColor: `var(--color-${colorVar})` };
}

/**
 * Style settings for icon images
 */
export const iconImageStyles = {
  standard: {
    transition: 'opacity 0.3s ease',
  },
  revealed: {
    lightMode: { opacity: 1 },
    darkMode: { opacity: 1.15, transform: 'scale(1.05)' }
  },
  hidden: {
    opacity: 0.7
  }
};