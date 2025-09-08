'use client';

import React from 'react';
import { useLogo } from './hooks';
import styles from './Logo.module.css';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo = React.memo<LogoProps>(({ 
  className = "",
  width,
  height
}) => {
  const { logoSrc, width: logoWidth, height: logoHeight, className: logoClassName } = useLogo({
    width,
    height,
    className
  });
  
  return (
    <img 
      src={logoSrc}
      alt="Fact 5"
      className={`${styles.logo} ${logoClassName}`}
      style={{
        width: logoWidth || 'auto',
        height: logoHeight || 'auto'
      }}
      draggable="false"
    />
  );
});

Logo.displayName = 'Logo';

export default Logo; 