'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

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
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only run on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use default logo during server-side rendering, then switch to correct one after mounting
  const logoSrc = !mounted ? "/icons/logo.svg" : (darkMode ? "/icons/logo-dark.svg" : "/icons/logo.svg");
  
  return (
    <img 
      src={logoSrc}
      alt="Fact 5"
      className={className}
      style={{
        width: width || 'auto',
        height: height || 'auto',
        display: 'block',
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo; 