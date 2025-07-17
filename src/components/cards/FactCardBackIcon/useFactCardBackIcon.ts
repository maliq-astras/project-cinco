import { useMemo } from 'react';
import { Fact } from '@/types';
import { getFactIcon } from '@/helpers/iconHelpers';

interface UseFactCardBackIconProps {
  fact: Fact<any>;
  size: 'small' | 'large';
  isRevealed: boolean;
}

/**
 * Hook for managing FactCardBackIcon logic and styles
 */
export function useFactCardBackIcon({ 
  fact, 
  size, 
  isRevealed 
}: UseFactCardBackIconProps) {
  // Get category from fact or default to 'countries'
  const category = useMemo(() => {
    return fact.category ? 
      (typeof fact.category === 'string' ? fact.category : fact.category.toString()) : 
      'countries';
  }, [fact.category]);
  
  // Calculate icon size based on container size - make icons bigger
  const customIconSize = useMemo(() => {
    return size === 'small' 
      ? 48 // Increased from 40 for small size
      : 76; // Increased from 64 for large size
  }, [size]);
  
  // Get the icon information
  const icon = useMemo(() => {
    return getFactIcon(fact.factType, isRevealed, customIconSize, category.toLowerCase());
  }, [fact.factType, isRevealed, customIconSize, category]);
  
  // Memoize styles for the icon
  const iconStyle = useMemo(() => ({
    filter: "brightness(0) invert(1)",
    WebkitFilter: "brightness(0) invert(1)", // For Safari support
    opacity: 1,
    maxWidth: "100%",
    background: 'transparent' // Ensure transparent background
  }), []);
  
  // Container style
  const containerStyle = useMemo(() => ({
    background: 'transparent'
  }), []);
  
  return {
    icon,
    iconStyle,
    containerStyle
  };
} 