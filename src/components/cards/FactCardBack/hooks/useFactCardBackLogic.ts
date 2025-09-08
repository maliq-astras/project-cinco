import { useMemo } from 'react';
import { Fact, CategoryType } from '@/types';
import { getFactIcon } from '@/helpers/iconHelpers';
import styles from '../FactCardBack.module.css';
import { getBackgroundStyle, getIconStyle, getCategoryFromFact } from '../helpers';

interface UseFactCardBackLogicProps {
  fact: Fact<CategoryType>;
  size: 'small' | 'large';
  isRevealed: boolean;
  inStack: boolean;
  colors: { primary: string };
  getResponsiveValue: (values: Record<string, number>) => number;
}

export function useFactCardBackLogic({ 
  fact,
  size,
  isRevealed, 
  inStack,
  colors,
  getResponsiveValue
}: UseFactCardBackLogicProps) {
  
  const containerClasses = useMemo(() => {
    const classes = [styles.container, styles.factCard];
    if (inStack) classes.push(styles.inStack);
    return classes.join(' ');
  }, [inStack]);
  
  const backgroundStyle = useMemo(() => 
    getBackgroundStyle(colors.primary), 
  [colors.primary]);
  
  const category = useMemo(() => 
    getCategoryFromFact(fact), 
  [fact.category]);
  
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
  
  const iconStyle = useMemo(() => getIconStyle(), []);
  
  return {
    containerClasses,
    backgroundStyle,
    icon,
    iconStyle
  };
} 