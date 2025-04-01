'use client';

import React, { useMemo } from 'react';
import { getFactIcon, useIconFilter } from '../helpers/iconHelpers';
import { useTheme } from '../context/ThemeContext';
import { useIconSize, useIconStyles } from '../hooks/components/iconContainer';
import { iconContainerStyles } from '../styles/iconStyles';

interface IconContainerProps {
  factType: string;
  isRevealed?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  iconSize?: number;
  children?: React.ReactNode;
  category?: string;
}

/**
 * A reusable circular icon container component
 * Used for consistent icon display across the application
 */
export default function IconContainer({
  factType,
  isRevealed = false,
  size = 'medium',
  className = '',
  iconSize,
  children,
  category = 'countries'
}: IconContainerProps) {
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
  
  return (
    <div 
      className={`${containerSizeClass} ${iconContainerStyles.container} ${bgClass} ${className}`}
      style={containerStyle}
    >
      {children || (
        <img 
          src={`/icons/${icon.iconName}.svg`}
          alt={factType}
          width={icon.size}
          height={icon.size}
          style={iconStyle}
        />
      )}
    </div>
  );
}