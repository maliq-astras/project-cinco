import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface UseLogoLogicParams {
  mounted: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const useLogoLogic = ({ 
  mounted, 
  width, 
  height, 
  className = "" 
}: UseLogoLogicParams) => {
  const { darkMode } = useTheme();
  
  const logoSrc = useMemo(() => {
    return !mounted ? "/icons/logo.svg" : (darkMode ? "/icons/logo-dark.svg" : "/icons/logo.svg");
  }, [mounted, darkMode]);
  
  return {
    logoSrc,
    width,
    height,
    className
  };
};