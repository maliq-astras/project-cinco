'use client';

import React from 'react';
import { useIconContainer } from './useIconContainer';
import { iconContainerStyles } from './IconContainer.styles';

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
  const {
    containerSizeClass,
    containerStyle,
    bgClass,
    iconStyle,
    icon,
    factType: iconFactType
  } = useIconContainer({
    factType,
    isRevealed,
    size,
    iconSize,
    category
  });
  
  return (
    <div 
      className={`${containerSizeClass} ${iconContainerStyles.container} ${bgClass} ${className}`}
      style={containerStyle}
    >
      {children || (
        <img 
          src={`/icons/${icon.iconName}.svg`}
          alt={iconFactType}
          width={icon.size}
          height={icon.size}
          style={iconStyle}
        />
      )}
    </div>
  );
} 