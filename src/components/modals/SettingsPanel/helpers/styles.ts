import { CSSProperties } from 'react';
import styles from '../SettingsPanel.module.css';

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
};

export const getMobilePanelStyle = (primaryColor: string): CSSProperties => ({
  borderTop: `4px solid var(--color-${primaryColor})`,
  borderLeft: `1px solid var(--color-${primaryColor})`,
  borderRight: `1px solid var(--color-${primaryColor})`,
  maxHeight: '95vh'
});

export const getDesktopPanelStyle = (primaryColor: string): CSSProperties => ({
  border: `2px solid var(--color-${primaryColor})`,
  maxHeight: '90vh'
});

export const getTitleStyle = (darkMode: boolean, primaryColor: string): CSSProperties => ({
  color: darkMode ? 'white' : `var(--color-${primaryColor})`
});

export const getCloseButtonStyle = (darkMode: boolean, primaryColor: string): CSSProperties => ({
  color: darkMode ? 'white' : `var(--color-${primaryColor})`
});

export const getToggleSwitchStyle = (isOn: boolean, primaryColor: string, disabled: boolean): CSSProperties => ({
  backgroundColor: isOn ? `var(--color-${primaryColor})` : '#9ca3af',
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
  minWidth: '2.75rem',
  width: '2.75rem',
  height: '1.5rem',
  borderRadius: '9999px'
});

export const getToggleDotClass = (isOn: boolean): string => 
  isOn 
    ? "inline-block h-4 w-4 rounded-full bg-white transition-transform transform translate-x-5" 
    : "inline-block h-4 w-4 rounded-full bg-white transition-transform transform translate-x-0.5";

export const getLanguageSelectStyle = (darkMode: boolean): CSSProperties => ({
  color: darkMode ? 'white' : 'black',
  backgroundColor: darkMode ? 'transparent' : 'white',
});

export const getLanguageOptionStyle = (isSelected: boolean, primaryColor: string): CSSProperties => ({
  backgroundColor: isSelected ? `var(--color-${primaryColor})` : 'transparent',
  color: isSelected ? 'white' : 'inherit',
});