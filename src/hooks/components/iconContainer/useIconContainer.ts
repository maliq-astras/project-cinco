import { useMemo } from 'react';
import { getFactIcon, useIconFilter } from '../../../helpers/iconHelpers';
import { useTheme } from '../../../context/ThemeContext';
import { useIconSize } from './useIconSize';
import { useIconStyles } from './useIconStyles';

interface UseIconContainerProps {
  factType: string;
  isRevealed?: boolean;
  size?: 'small' | 'medium' | 'large';
  iconSize?: number;
  category?: string;
}

export const useIconContainer = ({
  factType,
  isRevealed = false,
  size = 'medium',
  iconSize,
  category = 'countries'
}: UseIconContainerProps) => {
  // Get theme context
  const { darkMode } = useTheme();
  
  // Get icon filter function
  const getFilter = useIconFilter();
  
  // Normalize category
  const normalizedCategory = useMemo(() => 
    category.toLowerCase(), 
    [category]
  );
  
  // Get size classes and calculated icon size
  const { 
    containerSizeClass, 
    calculatedIconSize 
  } = useIconSize({ 
    size, 
    isRevealed, 
    customIconSize: iconSize 
  });
  
  // Get the icon filter based on category
  const iconFilter = useMemo(() => 
    getFilter(normalizedCategory), 
    [getFilter, normalizedCategory]
  );
  
  // Get icon styles
  const { 
    containerStyle, 
    bgClass, 
    iconStyle 
  } = useIconStyles({
    isRevealed,
    category: normalizedCategory,
    iconFilter
  });
  
  // Get icon information
  const icon = useMemo(() => 
    getFactIcon(factType, isRevealed, calculatedIconSize, normalizedCategory),
    [factType, isRevealed, calculatedIconSize, normalizedCategory]
  );

  return {
    containerSizeClass,
    containerStyle,
    bgClass,
    iconStyle,
    icon,
    factType
  };
}; 