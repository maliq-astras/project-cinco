'use client';

import React from 'react';
import { getFactIcon, useIconFilter } from '../helpers/iconHelpers';
import { Fact, CategoryType } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const { colors, darkMode } = useTheme();
  const getFilter = useIconFilter();
  
  // Determine container size class
  const sizeClass = {
    'small': 'w-[40%] max-w-[80px]',
    'medium': 'w-[28%] max-w-[100px]',
    'large': 'w-[35%] max-w-[120px]'
  }[size];
  
  // Determine icon size based on container size
  // Make icons slightly bigger when revealed (for cards)
  const calculatedIconSize = iconSize || {
    'small': isRevealed ? 40 : 32,
    'medium': isRevealed ? 52 : 44,
    'large': isRevealed ? 64 : 56
  }[size];
  
  // Only add background for unrevealed icons
  const bgClass = isRevealed ? '' : 'dark:bg-gray-700';
  
  // Ensure category is normalized
  const normalizedCategory = category.toLowerCase();
  
  return (
    <div 
      className={`${sizeClass} aspect-square rounded-full flex items-center justify-center ${bgClass} ${className}`}
      style={{
        backgroundColor: isRevealed ? undefined : `var(--color-${colors.light})`,
        boxShadow: undefined
      }}
    >
      {children || (() => {
        const icon = getFactIcon(factType, isRevealed, calculatedIconSize, normalizedCategory);
        return (
          <img 
            src={`/icons/${icon.iconName}.svg`}
            alt={factType}
            width={icon.size}
            height={icon.size}
            style={{
              filter: getFilter(icon.category),
              opacity: icon.isRevealed ? (darkMode ? 1.15 : 1) : 0.7,
              transition: 'opacity 0.3s ease',
              transform: darkMode && icon.isRevealed ? 'scale(1.05)' : undefined
            }}
          />
        );
      })()}
    </div>
  );
}

/**
 * Specialized version for fact card backs
 */
interface FactCardBackIconProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
  isRevealed?: boolean;
}

export function FactCardBackIcon({ 
  fact, 
  size = 'large',
  isRevealed = false
}: FactCardBackIconProps) {
  const { colors, darkMode } = useTheme();
  
  // Get category from fact or default to 'countries'
  const category = fact.category ? 
    (typeof fact.category === 'string' ? fact.category : fact.category.toString()) : 
    'countries';
  
  // Calculate icon size based on container size - make icons bigger
  const customIconSize = size === 'small' 
    ? 48 // Increased from 40 for small size
    : 76; // Increased from 64 for large size
  
  // Get the icon information
  const icon = getFactIcon(fact.factType, isRevealed, customIconSize, category.toLowerCase());
  
  return (
    <div 
      className={`flex items-center justify-center`}
      style={{ background: 'transparent' }}
    >
      <img 
        src={`/icons/${icon.iconName}.svg`}
        alt={fact.factType}
        width={icon.size}
        height={icon.size}
        style={{
          filter: "brightness(0) invert(1)",
          WebkitFilter: "brightness(0) invert(1)", // For Safari support
          opacity: 1,
          maxWidth: "100%",
          background: 'transparent' // Ensure transparent background
        }}
      />
    </div>
  );
}