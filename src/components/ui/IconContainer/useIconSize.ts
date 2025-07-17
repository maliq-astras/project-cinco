import { useMemo } from 'react';

interface UseIconSizeProps {
  size: 'small' | 'medium' | 'large';
  isRevealed?: boolean;
  customIconSize?: number;
}

/**
 * Hook for calculating appropriate icon sizes based on container size
 */
export function useIconSize({ 
  size, 
  isRevealed = false,
  customIconSize
}: UseIconSizeProps) {
  // Calculate size class for the container
  const containerSizeClass = useMemo(() => {
    return {
      'small': 'w-[40%] max-w-[80px]',
      'medium': 'w-[28%] max-w-[100px]',
      'large': 'w-[35%] max-w-[120px]'
    }[size];
  }, [size]);
  
  // Calculate icon size based on container size
  // Make icons slightly bigger when revealed (for cards)
  const calculatedIconSize = useMemo(() => {
    if (customIconSize) return customIconSize;
    
    return {
      'small': isRevealed ? 40 : 32,
      'medium': isRevealed ? 52 : 44,
      'large': isRevealed ? 64 : 56
    }[size];
  }, [size, isRevealed, customIconSize]);
  
  return {
    containerSizeClass,
    calculatedIconSize
  };
} 