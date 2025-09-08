import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import { useHeader } from './useHeader';
import styles from './Header.module.css';
import { getCategoryName } from '@/helpers/i18nHelpers';
import { useResponsive } from '@/hooks/responsive';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface HeaderProps {
  headerEntranceComplete?: boolean;
}

const Header: React.FC<HeaderProps> = React.memo(({ headerEntranceComplete = false }) => {
  const { t } = useTranslation();
  const { colors, challenge, logoRef, categoryTitleRef } = useHeader();
  const { responsiveValues, breakpoint } = useResponsive();
  
  // Helper function for dynamic title styling
  const getTitleStyle = (primaryColor: string) => ({
    fontSize: responsiveValues.header.titleFontSize,
    lineHeight: 1,
    color: `var(--color-${primaryColor})`,
    maxWidth: responsiveValues.header.titleMaxWidth,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } as React.CSSProperties);

  // Get responsive CSS classes based on breakpoint
  const getResponsiveClasses = () => {
    return {
      container: `${styles.container} ${styles[`container${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}`] || styles.containerMd}`,
      content: `${styles.content} ${styles[`content${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}`] || styles.contentMd}`,
      logoContainer: `${styles[`logoContainer${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}`] || styles.logoContainerMd}`,
      title: `${styles.title} ${styles[`title${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}`] || styles.titleMd}`
    };
  };

  const headerClasses = getResponsiveClasses();

  return (
    <div className={headerClasses.container}>
      <header className={styles.header}>
        <div className={headerClasses.content}>
          <motion.div 
            ref={logoRef}
            id="header-area" 
            className={headerClasses.logoContainer}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={headerEntranceComplete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Logo height="100%"/>
          </motion.div>
          
          {challenge?.category && (
            <motion.h1 
              ref={categoryTitleRef}
              id="category-title"
              className={`${headerClasses.title} ${righteous.className} header-title`}
              style={getTitleStyle(colors.primary)}
              initial={{ opacity: 0, y: -15 }}
              animate={headerEntranceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {getCategoryName(challenge.category, t)}
            </motion.h1>
          )}
        </div>
      </header>
    </div>
  );
});

Header.displayName = 'Header';

export default Header; 