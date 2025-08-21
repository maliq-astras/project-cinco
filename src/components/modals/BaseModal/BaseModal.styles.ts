import { CSSProperties } from 'react';
import styles from './BaseModal.module.css';

export const baseModalStyles = {
  // Static styles from CSS modules
  mobileContainer: styles.mobileContainer,
  mobileDragIndicator: styles.mobileDragIndicator,
  desktopContainer: styles.desktopContainer,
  desktopPanelClass: styles.desktopPanelClass,
  contentContainer: styles.contentContainer,
  header: styles.header,
  titleClass: styles.titleClass,
  closeButtonClass: styles.closeButtonClass,
  
  // Dynamic styles for theme integration and sizing
  mobilePanel: (primaryColor: string): CSSProperties => ({
    borderTop: `4px solid var(--color-${primaryColor})`,
    borderLeft: `1px solid var(--color-${primaryColor})`,
    borderRight: `1px solid var(--color-${primaryColor})`,
    maxHeight: '95vh'
  }),
  mobilePanelClass: (height: string) => `${styles.mobilePanelClass} h-[${height}]`,
  
  desktopPanel: (primaryColor: string): CSSProperties => ({
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight: '90vh'
  }),
  
  // Animations
  overlayAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  mobilePanelAnimation: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'tween', duration: 0.3 }
  }
} as const;
