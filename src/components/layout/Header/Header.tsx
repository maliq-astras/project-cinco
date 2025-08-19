import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import { useHeader } from './useHeader';
import { headerStyles } from './Header.styles';
import { getCategoryName } from '@/helpers/i18nHelpers';
import { useMainContainer } from '../MainContainer';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface HeaderProps {
  headerEntranceComplete?: boolean;
}

const Header: React.FC<HeaderProps> = ({ headerEntranceComplete = false }) => {
  const { t } = useTranslation();
  const { colors, challenge, logoRef, categoryTitleRef } = useHeader();
  const { isCompactHeader, headerSizeMode } = useMainContainer();

  // Get header size classes based on headerSizeMode
  const getHeaderSizeClasses = () => {
    switch (headerSizeMode) {
      case 'xs':
        return {
          container: headerStyles.containerXs,
          content: headerStyles.contentXs,
          logoContainer: headerStyles.logoContainerXs,
          title: headerStyles.titleXs,
          titleText: headerStyles.titleTextXs(colors)
        };
      case 'sm':
        return {
          container: headerStyles.containerSm,
          content: headerStyles.contentSm,
          logoContainer: headerStyles.logoContainerSm,
          title: headerStyles.titleSm,
          titleText: headerStyles.titleTextSm(colors)
        };
      case 'md':
        return {
          container: headerStyles.containerMd,
          content: headerStyles.contentMd,
          logoContainer: headerStyles.logoContainerMd,
          title: headerStyles.titleMd,
          titleText: headerStyles.titleTextMd(colors)
        };
      case 'lg':
        return {
          container: headerStyles.containerLg,
          content: headerStyles.contentLg,
          logoContainer: headerStyles.logoContainerLg,
          title: headerStyles.titleLg,
          titleText: headerStyles.titleTextLg(colors)
        };
      case 'xl':
        return {
          container: headerStyles.containerXl,
          content: headerStyles.contentXl,
          logoContainer: headerStyles.logoContainerXl,
          title: headerStyles.titleXl,
          titleText: headerStyles.titleTextXl(colors)
        };
      default:
        return {
          container: headerStyles.containerMd,
          content: headerStyles.contentMd,
          logoContainer: headerStyles.logoContainerMd,
          title: headerStyles.titleMd,
          titleText: headerStyles.titleTextMd(colors)
        };
    }
  };

  const headerClasses = getHeaderSizeClasses();

  return (
    <div className={headerClasses.container}>
      <header className={headerStyles.header}>
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
              style={headerClasses.titleText}
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
};

export default Header; 