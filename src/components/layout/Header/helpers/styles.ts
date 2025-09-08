// Remove the ResponsiveValues import since it's not exported
import styles from '../Header.module.css';

/**
 * Generate dynamic title styling based on responsive values and primary color
 */
export const getTitleStyle = (responsiveValues: any, primaryColor: string): React.CSSProperties => ({
  fontSize: responsiveValues.header.titleFontSize,
  lineHeight: 1,
  color: `var(--color-${primaryColor})`,
  maxWidth: responsiveValues.header.titleMaxWidth,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

/**
 * Get responsive CSS classes based on breakpoint
 */
export const getResponsiveClasses = (breakpoint: string) => {
  const capitalizedBreakpoint = breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1);
  
  return {
    container: `${styles.container} ${styles[`container${capitalizedBreakpoint}`] || styles.containerMd}`,
    content: `${styles.content} ${styles[`content${capitalizedBreakpoint}`] || styles.contentMd}`,
    logoContainer: `${styles[`logoContainer${capitalizedBreakpoint}`] || styles.logoContainerMd}`,
    title: `${styles.title} ${styles[`title${capitalizedBreakpoint}`] || styles.titleMd}`
  };
};