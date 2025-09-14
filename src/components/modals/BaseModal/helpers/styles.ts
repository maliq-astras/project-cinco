import { CSSProperties } from 'react';
import styles from '../BaseModal.module.css';

export const baseModalStyles = {
  mobileContainer: styles.mobileContainer,
  mobileDragIndicator: styles.mobileDragIndicator,
  desktopContainer: styles.desktopContainer,
  desktopPanelClass: styles.desktopPanelClass,
  contentContainer: styles.contentContainer,
  header: styles.header,
  titleClass: styles.titleClass,
  closeButtonClass: styles.closeButtonClass
} as const;

export const getMobilePanelStyle = (primaryColor: string, mobileHeight: string = '75vh'): CSSProperties => ({
  borderTop: `4px solid var(--color-${primaryColor})`,
  borderLeft: `1px solid var(--color-${primaryColor})`,
  borderRight: `1px solid var(--color-${primaryColor})`,
  height: mobileHeight,
  maxHeight: mobileHeight
});

export const getMobilePanelClass = () => 
  styles.mobilePanelClass;

export const getDesktopPanelStyle = (primaryColor: string, customMaxHeight?: string): CSSProperties => {
  // If custom max height is provided, use it
  if (customMaxHeight) {
    return {
      border: `2px solid var(--color-${primaryColor})`,
      maxHeight: customMaxHeight
    };
  }
  
  // Default behavior for FeedbackModal and other modals
  const isSmallHeight = typeof window !== 'undefined' && window.innerHeight < 715;
  return {
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight: isSmallHeight ? '95vh' : '90vh'
  };
};