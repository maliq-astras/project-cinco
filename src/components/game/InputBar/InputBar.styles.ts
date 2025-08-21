/**
 * Hybrid styles for InputBar component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from InputBar.module.css
 * - Dynamic styles remain as functions for theme integration
 */

import styles from './InputBar.module.css';

export const inputBarStyles = {
  // Static styles from CSS modules
  container: styles.container,
  inputShell: styles.inputShell,
  inputPosition: styles.inputPosition,
  submitButton: styles.submitButton,
  progressContainer: styles.progressContainer,
  
  // Dynamic input classes
  input: (isDisabled: boolean) => `${styles.inputBase} ${isDisabled ? styles.inputDisabled : styles.inputEnabled} ${styles.hideScrollbar}`,
  
  // Dynamic theme styles
  inputWithTheme: (color: string) => ({
    "--theme-color": `var(--color-${color})`,
    transitionProperty: "height, transform",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "height, transform",
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    transform: "translateY(0)",
    overflowY: "hidden" as const
  })
} as const;
