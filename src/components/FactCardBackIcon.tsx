'use client';

import React from 'react';
import { Fact } from '../types';
import { factCardBackIconStyles } from '../styles/iconStyles';
import { useFactCardBackIcon } from '../hooks/useFactCardBackIcon';

interface FactCardBackIconProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
  isRevealed?: boolean;
}

/**
 * Specialized icon component for fact card backs
 * Displays white icon on the colored card back
 */
export default function FactCardBackIcon({ 
  fact, 
  size = 'large',
  isRevealed = false
}: FactCardBackIconProps) {
  // Use custom hook for logic and styles
  const { icon, iconStyle, containerStyle } = useFactCardBackIcon({
    fact,
    size,
    isRevealed
  });
  
  return (
    <div 
      className={factCardBackIconStyles.container}
      style={containerStyle}
    >
      <img 
        src={`/icons/${icon.iconName}.svg`}
        alt={fact.factType}
        width={icon.size}
        height={icon.size}
        style={iconStyle}
      />
    </div>
  );
} 