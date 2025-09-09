import { CSSProperties } from 'react';
import { calculateFontSize } from './calculations';
import { getShadowColor, PLACEHOLDER_TEXT_COLORS } from './colors';
import styles from '../LoadingAnimation.module.css';

const LOADING_PLACEHOLDER = "PLEASE WAIT...";

export const loadingAnimationStyles = {
  container: styles.container,
  innerContainer: styles.innerContainer,
  logoContainer: styles.logoContainer,
  logoWrapper: styles.logoWrapper,
  centerLine: styles.centerLine,
  categoryContainer: styles.categoryContainer,
  categoryWrapper: styles.categoryWrapper,
  categoryPlaceholder: styles.categoryPlaceholder,
  loadingIndicatorContainer: styles.loadingIndicatorContainer,
  loadingText: styles.loadingText,
  skipButton: styles.skipButton
} as const;

export const getAnimatedLineStyle = (rgbColor: string): CSSProperties => ({
  height: "1px",
  backgroundColor: `rgba(${rgbColor}, 0.3)`
});

export const getCategoryStyle = (
  isShowingFinalCategory: boolean,
  rgbColor: string,
  colorClass: string,
  darkMode: boolean,
  categoryText: string,
  isHighContrast: boolean = false,
  getCSSProperty?: (varName: string) => string
): CSSProperties => {
  if (categoryText.toUpperCase() === LOADING_PLACEHOLDER) {
    return {
      color: darkMode ? PLACEHOLDER_TEXT_COLORS.dark : PLACEHOLDER_TEXT_COLORS.light,
      fontSize: calculateFontSize(categoryText),
      lineHeight: 1,
      padding: "0 12px",
      whiteSpace: "nowrap"
    };
  }

  let textColor = `rgb(${rgbColor})`;
  if (isHighContrast && getCSSProperty) {
    const matches = colorClass.match(/([a-z]+)-(\d+)/);
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const hcShade = darkMode ? '300' : '900';
      const varName = `--hc-${colorFamily}-${hcShade}`;
      const computed = getCSSProperty(varName);
      
      if (computed) {
        textColor = `rgb(${computed})`;
      }
    }
  }
  
  const shadowColor = isHighContrast
    ? getShadowColor(colorClass, isHighContrast, darkMode, getCSSProperty)
    : (darkMode ? `0 0 8px rgba(${rgbColor}, 0.5)` : 'none');
  
  return {
    color: textColor,
    fontSize: calculateFontSize(categoryText),
    lineHeight: 1,
    padding: "0 12px",
    whiteSpace: "nowrap",
    textShadow: isShowingFinalCategory 
      ? `0 0 15px ${getShadowColor(colorClass, isHighContrast, darkMode, getCSSProperty)}`
      : (typeof shadowColor === 'string' ? shadowColor : 'none')
  };
};

export const getLoadingSpinnerStyle = (rgbColor: string): CSSProperties => ({
  width: "2.5rem",
  height: "2.5rem",
  borderWidth: "4px",
  borderRadius: "9999px",
  borderColor: `rgb(${rgbColor})`,
  borderTopColor: 'transparent',
  marginBottom: "0.75rem",
  animation: "spin 1s linear infinite"
});