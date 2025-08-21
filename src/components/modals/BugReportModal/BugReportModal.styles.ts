import { CSSProperties } from 'react';
import styles from './BugReportModal.module.css';

export const bugReportModalStyles = {
  // Static styles from CSS modules
  content: styles.content,
  stepContainer: styles.stepContainer,
  stepLabel: styles.stepLabel,
  dropdownContainer: styles.dropdownContainer,
  dropdownButton: styles.dropdownButton,
  dropdownList: styles.dropdownList,
  dropdownItem: styles.dropdownItem,
  fileUploadContainer: styles.fileUploadContainer,
  fileUploadContainerDragging: styles.fileUploadContainerDragging,
  fileUploadIcon: styles.fileUploadIcon,
  fileUploadText: styles.fileUploadText,
  fileUploadOptional: styles.fileUploadOptional,
  filePreviewContainer: styles.filePreviewContainer,
  filePreviewIcon: styles.filePreviewIcon,
  filePreviewText: styles.filePreviewText,
  filePreviewRemoveButton: styles.filePreviewRemoveButton,
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
  primaryButtonHover: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor}-dark)`
  }),
  progressBar: (primaryColor: string, progress: number): CSSProperties => ({
    width: `${progress}%`,
    backgroundColor: `var(--color-${primaryColor})`,
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease-in-out'
  })
} as const;
