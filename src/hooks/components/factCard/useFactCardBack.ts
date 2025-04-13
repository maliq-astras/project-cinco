import { useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { factCardBackStyles, getCardBackgroundStyle } from '../../../styles/factCardBackStyles';

interface UseFactCardBackProps {
  isFinalFive: boolean;
  isRevealed: boolean;
  inStack: boolean;
}

/**
 * Hook for managing FactCardBack styles and classes
 */
export function useFactCardBack({ 
  isFinalFive, 
  isRevealed, 
  inStack 
}: UseFactCardBackProps) {
  const { colors } = useTheme();
  
  // Get background style
  const backgroundStyle = useMemo(() => 
    getCardBackgroundStyle(isFinalFive, colors.primary),
    [isFinalFive, colors.primary]
  );
  
  // Build class string with conditional classes
  const containerClasses = useMemo(() => {
    const baseClass = factCardBackStyles.container;
    const finalFiveClass = isFinalFive ? factCardBackStyles.finalFive : '';
    const revealedClass = isRevealed ? factCardBackStyles.revealed : '';
    const stackClass = inStack ? factCardBackStyles.inStack : '';
    
    return `${baseClass} ${finalFiveClass} ${revealedClass} ${stackClass}`.trim();
  }, [isFinalFive, isRevealed, inStack]);
  
  return {
    backgroundStyle,
    containerClasses
  };
} 