/**
 * Hybrid styles for Header component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from Header.module.css
 * - Dynamic styles remain as functions for theme integration
 */

import styles from './Header.module.css';

export const headerStyles = {
  // Static styles from CSS modules
  container: styles.container,
  header: styles.header,
  content: styles.content,
  title: styles.title,
  
  // Container size variants
  containerXs: styles.containerXs,
  containerSm: styles.containerSm,
  containerMd: styles.containerMd,
  containerLg: styles.containerLg,
  containerXl: styles.containerXl,
  
  // Content size variants
  contentXs: styles.contentXs,
  contentSm: styles.contentSm,
  contentMd: styles.contentMd,
  contentLg: styles.contentLg,
  contentXl: styles.contentXl,
  
  // Logo container size variants
  logoContainerXs: styles.logoContainerXs,
  logoContainerSm: styles.logoContainerSm,
  logoContainerMd: styles.logoContainerMd,
  logoContainerLg: styles.logoContainerLg,
  logoContainerXl: styles.logoContainerXl,
  
  // Title size variants
  titleXs: styles.titleXs,
  titleSm: styles.titleSm,
  titleMd: styles.titleMd,
  titleLg: styles.titleLg,
  titleXl: styles.titleXl,
  
  // Title text styles - synchronized XS → XL with VERTICAL breakpoints (INCREASED +5%)
  titleTextXs: (colors: { primary: string }) => ({
    fontSize: "clamp(25px, 3.5vh, 32px)", // Increased from 21px/3.15vh/27px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "263px", // Increased from 250px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextSm: (colors: { primary: string }) => ({
    fontSize: "clamp(30px, 4vh, 38px)", // Increased from 25px/3.68vh/32px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "315px", // Increased from 300px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextMd: (colors: { primary: string }) => ({
    fontSize: "clamp(35px, 4.5vh, 44px)", // Increased from 29px/4.2vh/38px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "368px", // Increased from 350px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextLg: (colors: { primary: string }) => ({
    fontSize: "clamp(40px, 5vh, 50px)", // Increased from 34px/4.73vh/44px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "420px", // Increased from 400px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextXl: (colors: { primary: string }) => ({
    fontSize: "clamp(45px, 5.5vh, 56px)", // Increased from 38px/5.25vh/50px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "473px", // Increased from 450px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  
  // Legacy support for backward compatibility
  compactContainer: styles.compactContainer,
  compactContent: styles.compactContent,
  compactLogoContainer: styles.compactLogoContainer,
  compactTitle: styles.compactTitle,
  compactTitleText: (colors: { primary: string }) => ({
    fontSize: "clamp(24px, 4vw, 32px)",
    lineHeight: 1,
    color: `var(--color-${colors.primary})`
  })
} as const; 