import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import { useHeader } from './useHeader';
import { headerStyles } from './Header.styles';
import { getCategoryName } from '@/helpers/i18nHelpers';
import { useMainContainer } from '../../game/MainContainer';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface HeaderProps {
  headerEntranceComplete?: boolean;
}

const Header: React.FC<HeaderProps> = ({ headerEntranceComplete = false }) => {
  const { t } = useTranslation();
  const { colors, challenge } = useHeader();
  const { isCompactHeader } = useMainContainer();

  return (
    <div className={isCompactHeader ? headerStyles.compactContainer : headerStyles.container}>
      <header className={headerStyles.header}>
        <div className={isCompactHeader ? headerStyles.compactContent : headerStyles.content}>
          <motion.div 
            id="header-area" 
            className={isCompactHeader ? headerStyles.compactLogoContainer : headerStyles.logoContainer}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={headerEntranceComplete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Logo height="100%"/>
          </motion.div>
          
          {challenge?.category && (
            <motion.h1 
              id="category-title"
              className={`${isCompactHeader ? headerStyles.compactTitle : headerStyles.title} ${righteous.className}`}
              style={isCompactHeader ? headerStyles.compactTitleText(colors) : headerStyles.titleText(colors)}
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