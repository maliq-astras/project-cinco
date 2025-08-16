import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Fact } from '@/types';
import { getFactIcon } from '@/helpers/iconHelpers';
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
    return size === 'small' 
      ? 48
      : 76;
  }, [size]);
  
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