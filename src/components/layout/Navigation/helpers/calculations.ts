import styles from '../Navigation.module.css';

/**
 * Get responsive CSS classes based on breakpoint
 */
export const getResponsiveNavClasses = (breakpoint: string) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const bp = capitalize(breakpoint);
  
  return {
    container: `${styles.container} ${styles[`container${bp}`] || styles.containerMd}`,
    innerContainer: `${styles.innerContainer} ${styles[`innerContainer${bp}`] || styles.innerContainerMd}`,
    navBar: `${styles.navBar} ${styles[`navBar${bp}`] || styles.navBarMd}`,
    nav: `${styles[`nav${bp}`] || styles.navMd}`,
    navIconClass: `${styles[`navIconClass${bp}`] || styles.navIconClassMd}`,
    iconSize: styles[`iconSize${bp}`] || styles.iconSizeMd
  };
};