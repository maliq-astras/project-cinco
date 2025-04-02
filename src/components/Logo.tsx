'use client';

import React from 'react';
import { useLogo } from '../hooks/components/logo';
import { logoStyles } from '../styles/logoStyles';

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
      className={logoClassName}
      style={logoStyles.image(logoWidth, logoHeight)}
    />
  );
};

export default Logo; 