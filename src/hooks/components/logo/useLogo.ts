import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface UseLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const useLogo = ({ 
  width, 
  height, 
  className = "" 
}: UseLogoProps) => {
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only run on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use default logo during server-side rendering, then switch to correct one after mounting
  const logoSrc = !mounted ? "/icons/logo.svg" : (darkMode ? "/icons/logo-dark.svg" : "/icons/logo.svg");
  
  return {
    logoSrc,
    width,
    height,
    className
  };
}; 