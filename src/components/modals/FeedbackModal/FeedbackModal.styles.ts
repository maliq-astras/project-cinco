import { CSSProperties } from 'react';
import styles from './FeedbackModal.module.css';

export const feedbackModalStyles = {
  // Static styles from CSS modules
  content: styles.content,
  stepContainer: styles.stepContainer,
  stepLabel: styles.stepLabel,
  starContainer: styles.starContainer,
  starButton: styles.starButton,
  starFilled: styles.starFilled,
  starEmpty: styles.starEmpty,
  dropdownContainer: styles.dropdownContainer,
  dropdownButton: styles.dropdownButton,
  dropdownList: styles.dropdownList,
  dropdownItem: styles.dropdownItem,
  buttonContainer: styles.buttonContainer,
  button: styles.button,
  secondaryButton: styles.secondaryButton,
  progressContainer: styles.progressContainer,
  successContainer: styles.successContainer,
  successIcon: styles.successIcon,
  successTitle: styles.successTitle,
  successMessage: styles.successMessage,
  
  // Dynamic styles for theme integration
  primaryButton: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`,
    color: 'white'
  }),
  progressBar: (primaryColor: string, progress: number): CSSProperties => ({
    width: `${progress}%`,
    backgroundColor: `var(--color-${primaryColor})`,
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease-in-out'
  })
} as const;
