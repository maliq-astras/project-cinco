import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Fact } from '@/types';
import { getFactIcon } from '@/helpers/iconHelpers';
import { useResponsive } from '@/hooks/responsive';
import styles from './FactCardBack.module.css';

interface UseFactCardBackProps {
  fact: Fact<any>;
  size: 'small' | 'large';
  isRevealed: boolean;
  inStack: boolean;
}

export function useFactCardBack({ 
  fact,
  size,
  isRevealed, 
  inStack 
}: UseFactCardBackProps) {
  const { colors } = useTheme();
  const { breakpoint, getResponsiveValue } = useResponsive();
  
  const containerClasses = useMemo(() => {
    const classes = [styles.container, styles.factCard];
    if (inStack) classes.push(styles.inStack);
    return classes.join(' ');
  }, [inStack]);
  
  const backgroundStyle = useMemo(() => ({
    '--fact-card-color': `var(--color-${colors.primary})`
  } as React.CSSProperties), [colors.primary]);
  
  const category = useMemo(() => {
    if (!fact.category) return 'countries';
    return typeof fact.category === 'string' ? fact.category : fact.category.toString();
  }, [fact.category]);
  
  const customIconSize = useMemo(() => {
    // Use the getResponsiveValue helper from useResponsive to eliminate duplication
    if (size === 'small') {
      return getResponsiveValue({ xs: 52, sm: 54, md: 56, lg: 58, xl: 60 });
    } else {
      return getResponsiveValue({ xs: 80, sm: 84, md: 88, lg: 92, xl: 96 });
    }
  }, [size, getResponsiveValue]);
  
  const icon = useMemo(() => 
    getFactIcon(fact.factType, isRevealed, customIconSize, category.toLowerCase()),
  [fact.factType, isRevealed, customIconSize, category]);
  
  const iconStyle = useMemo(() => ({
    filter: "brightness(0) invert(1)",
    WebkitFilter: "brightness(0) invert(1)",
    opacity: 1,
    maxWidth: "100%",
    background: 'transparent'
  }), []);
  
  return {
    containerClasses,
    backgroundStyle,
    icon,
    iconStyle
  };
} 