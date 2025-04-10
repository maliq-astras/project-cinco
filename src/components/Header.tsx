import React from 'react';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { useHeader } from '../hooks/components/header';
import { headerStyles } from '../styles/headerStyles';
import { getCategoryName } from '../helpers/i18nHelpers';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { colors, challenge } = useHeader();

  return (
    <div className={headerStyles.container}>
      <header className={headerStyles.header}>
        <div className={headerStyles.content}>
          <div id="header-area" className={headerStyles.logoContainer}>
            <Logo height="100%"/>
          </div>
          
          {challenge?.category && (
            <h1 
              id="category-title"
              className={`${headerStyles.title} ${righteous.className}`}
              style={headerStyles.titleText(colors)}
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