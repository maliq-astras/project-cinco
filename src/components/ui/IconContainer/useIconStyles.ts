import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { iconImageStyles, getIconContainerBgStyle } from './IconContainer.styles';

interface UseIconStylesProps {
  isRevealed: boolean;
  category: string;
  iconFilter: string;
}

/**
 * Hook for managing icon styles based on theme and state
 */
export function useIconStyles({
  isRevealed,
  category,
  iconFilter
}: UseIconStylesProps) {
  const { colors, darkMode } = useTheme();
  
  // Background style for the container
  const containerStyle = useMemo(() => {
    return getIconContainerBgStyle(isRevealed, colors.light);
  }, [isRevealed, colors.light]);
  
  // Only add background for unrevealed icons
  const bgClass = useMemo(() => {
    return isRevealed ? '' : 'dark:bg-gray-700';
  }, [isRevealed]);
  
  // Style for the icon image
  const iconStyle = useMemo(() => {
    // Base style with transition
    const baseStyle: React.CSSProperties = { 
      ...iconImageStyles.standard,
      filter: iconFilter 
    };
    
    // Add opacity based on revealed state
    if (isRevealed) {
      // Add dark mode specific styles if needed
      if (darkMode) {
        Object.assign(baseStyle, iconImageStyles.revealed.darkMode);
      } else {
        Object.assign(baseStyle, iconImageStyles.revealed.lightMode);
      }
    } else {
      Object.assign(baseStyle, iconImageStyles.hidden);
    }
    
    return baseStyle;
  }, [isRevealed, iconFilter, darkMode]);
  
  return {
    containerStyle,
    bgClass,
    iconStyle
  };
} 