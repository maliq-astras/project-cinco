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

/**
 * Hook for managing FactCardBack styles, classes, and icon logic
 */
export function useFactCardBack({ 
  fact,
  size,
  isRevealed, 
  inStack 
}: UseFactCardBackProps) {
  const { colors } = useTheme();
  const { breakpoint } = useResponsive();
  
  // Build class string with conditional classes
  const containerClasses = useMemo(() => {
    const baseClass = styles.container;
    const cardTypeClass = styles.factCard; 
    const revealedClass = isRevealed ? styles.revealed : '';
    const stackClass = inStack ? styles.inStack : '';
    
    return `${baseClass} ${cardTypeClass} ${revealedClass} ${stackClass}`.trim();
  }, [isRevealed, inStack]);
  
  // Get theme-specific background style for fact cards
  const backgroundStyle = useMemo(() => {
    return {
      '--fact-card-color': `var(--color-${colors.primary})`
    } as React.CSSProperties;
  }, [colors.primary]);
  
  // Icon logic
  const category = useMemo(() => {
    return fact.category ? 
      (typeof fact.category === 'string' ? fact.category : fact.category.toString()) : 
      'countries';
  }, [fact.category]);
  
  const customIconSize = useMemo(() => {
    // Responsive icon sizes based on breakpoint and card size
    if (size === 'small') {
      // Small cards (in stack) - responsive sizing
      switch (breakpoint) {
        case 'xs': return 52;
        case 'sm': return 54;
        case 'md': return 56;
        case 'lg': return 58;
        case 'xl': return 60;
        default: return 56;
      }
    } else {
      // Large cards (opened) - responsive sizing
      switch (breakpoint) {
        case 'xs': return 80;
        case 'sm': return 84;
        case 'md': return 88;
        case 'lg': return 92;
        case 'xl': return 96;
        default: return 88;
      }
    }
  }, [size, breakpoint]);
  
  const icon = useMemo(() => {
    return getFactIcon(fact.factType, isRevealed, customIconSize, category.toLowerCase());
  }, [fact.factType, isRevealed, customIconSize, category]);
  
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