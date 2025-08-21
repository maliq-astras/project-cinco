import { CSSProperties } from 'react';
import styles from './SettingsPanel.module.css';

export const settingsPanelStyles = {
  // Static styles from CSS modules
  mobileContainer: styles.mobileContainer,
  mobilePanelClass: styles.mobilePanelClass,
  mobileDragIndicator: styles.mobileDragIndicator,
  desktopContainer: styles.desktopContainer,
  desktopPanelClass: styles.desktopPanelClass,
  contentContainer: styles.contentContainer,
  header: styles.header,
  titleClass: styles.titleClass,
  closeButtonClass: styles.closeButtonClass,
  settingsContainer: styles.settingsContainer,
  settingRow: styles.settingRow,
  settingTextContainer: styles.settingTextContainer,
  settingTitle: styles.settingTitle,
  settingDescription: styles.settingDescription,
  settingErrorText: styles.settingErrorText,
  toggleSwitchClass: styles.toggleSwitchClass,
  languageSelectContainer: styles.languageSelectContainer,
  languageSelectClass: styles.languageSelectClass,
  languageSelectArrow: styles.languageSelectArrow,
  languageOptionClass: styles.languageOptionClass,
  languageOptionDisabled: styles.languageOptionDisabled,
  footer: styles.footer,
  footerText: styles.footerText,
  
  // Dynamic styles for theme integration and state
  mobilePanel: (primaryColor: string): CSSProperties => ({
    borderTop: `4px solid var(--color-${primaryColor})`,
    borderLeft: `1px solid var(--color-${primaryColor})`,
    borderRight: `1px solid var(--color-${primaryColor})`,
    maxHeight: '95vh'
  }),
  desktopPanel: (primaryColor: string): CSSProperties => ({
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight: '90vh'
  }),
  title: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  closeButton: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  toggleSwitch: (isOn: boolean, primaryColor: string, disabled: boolean): CSSProperties => ({
    backgroundColor: isOn ? `var(--color-${primaryColor})` : '#9ca3af',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    minWidth: '2.75rem', // 44px - ensure it doesn't shrink
    width: '2.75rem', // 44px - force exact width
    height: '1.5rem', // 24px - force exact height
    borderRadius: '9999px' // ensure fully rounded
  }),
  toggleDot: (isOn: boolean): string => isOn ? "inline-block h-4 w-4 rounded-full bg-white transition-transform transform translate-x-5" : "inline-block h-4 w-4 rounded-full bg-white transition-transform transform translate-x-0.5",
  languageSelect: (darkMode: boolean, primaryColor: string): CSSProperties => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`,
    backgroundColor: darkMode ? 'transparent' : 'white',
  }),
  languageOption: (isSelected: boolean, primaryColor: string): CSSProperties => ({
    backgroundColor: isSelected ? `var(--color-${primaryColor})` : 'transparent',
    color: isSelected ? 'white' : 'inherit',
  }),
  
  // Animations
  overlayAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  mobilePanelAnimation: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
}; 