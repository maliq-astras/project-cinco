import React from 'react';
import { Righteous } from 'next/font/google';
import Logo from './Logo';
import { useHeader } from '../hooks/components/header';
import { headerStyles } from '../styles/headerStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const Header: React.FC = () => {
  const { colors, challenge } = useHeader();

  return (
    <div className={headerStyles.container}>
      <header id="header-area" className={headerStyles.header}>
        <div className={headerStyles.content}>
          <div className={headerStyles.logoContainer}>
            <Logo height="100%"/>
          </div>
          
          {challenge?.category && (
            <h1 
              id="category-title"
              className={`${headerStyles.title} ${righteous.className}`}
              style={headerStyles.titleText(colors)}
            >
              {challenge.category.toUpperCase()}
            </h1>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header; 