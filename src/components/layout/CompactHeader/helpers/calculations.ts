import { useResponsive } from '@/hooks/responsive';

export const useCompactSizes = () => {
  const { getResponsiveValue } = useResponsive();

  return {
    iconSize: getResponsiveValue({
      xs: "1.9rem", 
      sm: "1.95rem",
      md: "2rem",
      lg: "2.15rem",
      xl: "2.25rem",
    }),
    titleFontSize: getResponsiveValue({
      xs: "1.60rem",
      sm: "2.25rem", 
      md: "2.25rem",
      lg: "2.5rem",
      xl: "2.75rem",
    }),
    titleMaxWidth: getResponsiveValue({
      xs: "220px", 
      sm: "240px",
      md: "260px",
      lg: "280px",
      xl: "300px",
    })
  };
};