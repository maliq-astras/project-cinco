'use client';

import React from 'react';
import { useLogo } from './useLogo';
import { logoStyles } from './Logo.styles';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
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
      className={`${logoStyles.logo} ${logoClassName}`}
      style={logoStyles.image(logoWidth, logoHeight)}
      draggable="false"
    />
  );
};

export default Logo; 