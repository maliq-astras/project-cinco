import styles from '../ContextArea.module.css';

export const getBubbleTextClassName = (darkMode: boolean, primaryColor: string): string => {
  return `${styles.bubblePrimary} ${darkMode ? 'text-white' : `text-${primaryColor}`}`;
};

export const getInstructionTextClassName = (
  darkMode: boolean, 
  primaryColor: string, 
  hasUserInput: boolean
): string => {
  return `${styles.instructionsPrimary} ${darkMode ? 'text-white' : `text-${primaryColor}`} ${hasUserInput ? styles.visuallyHidden : ''}`;
};