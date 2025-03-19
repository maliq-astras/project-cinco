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
  const { colors } = useTheme();
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
  const bgClass = isRevealed ? '' : `bg-${colors.light}`;
  
  // Ensure category is normalized
  const normalizedCategory = category.toLowerCase();
  
  return (
    <div className={`${sizeClass} aspect-square rounded-full flex items-center justify-center ${bgClass} ${className}`}>
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
              opacity: icon.isRevealed ? 1 : 0.7,
              transition: 'opacity 0.3s ease'
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
export function FactCardBackIcon({ fact, size = 'large' }: { fact: Fact<any>, size?: 'small' | 'large' }) {
  // Get category from fact or default to 'countries'
  const category = fact.category ? 
    (typeof fact.category === 'string' ? fact.category : fact.category.toString()) : 
    'countries';
  
  // Get window width for responsive adjustments
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  // Calculate proportional icon size based on screen width and card size
  let calculatedSize = size;
  let customIconSize = undefined;
  let customClass = "bg-white";
  
  // For card backs on mobile, use smaller icons
  if (size === 'small') {
    // Much smaller icons for card stack on mobile
    customIconSize = windowWidth <= 360 ? 22 : windowWidth <= 480 ? 24 : 26;
    
    // Small container on mobile
    customClass = windowWidth <= 480 ? "bg-white w-[36%] max-w-[70px]" : "bg-white";
  } else if (size === 'large' && windowWidth <= 480) {
    // Also reduce large icons on mobile
    customIconSize = 38;
  }
    
  return (
    <IconContainer
      factType={fact.factType}
      isRevealed={true}
      size={calculatedSize}
      iconSize={customIconSize}
      className={customClass}
      category={category.toLowerCase()}
    />
  );
} 