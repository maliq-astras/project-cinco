import React from 'react';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import { useHeader } from './useHeader';
import { headerStyles } from './Header.styles';
import { getCategoryName } from '@/helpers/i18nHelpers';
import { useMainContainer } from '../../game/MainContainer';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { colors, challenge } = useHeader();
  const { isCompactHeader } = useMainContainer();

  return (
    <div className={isCompactHeader ? headerStyles.compactContainer : headerStyles.container}>
      <header className={headerStyles.header}>
        <div className={isCompactHeader ? headerStyles.compactContent : headerStyles.content}>
          <div id="header-area" className={isCompactHeader ? headerStyles.compactLogoContainer : headerStyles.logoContainer}>
            <Logo height="100%"/>
          </div>
          
          {challenge?.category && (
            <h1 
              id="category-title"
              className={`${isCompactHeader ? headerStyles.compactTitle : headerStyles.title} ${righteous.className}`}
              style={isCompactHeader ? headerStyles.compactTitleText(colors) : headerStyles.titleText(colors)}
            >
              {getCategoryName(challenge.category, t)}
            </h1>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header; 