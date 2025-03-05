'use client';

import React from 'react';
import { getFactIcon } from './FactBubble';
import { Fact } from '../types';

interface IconContainerProps {
  factType: string;
  isRevealed?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  iconSize?: number;
  children?: React.ReactNode;
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
  children
}: IconContainerProps) {
  // Determine container size class
  const sizeClass = {
    'small': 'w-[40%] max-w-[80px]',
    'medium': 'w-[25%] max-w-[100px]',
    'large': 'w-[35%] max-w-[120px]'
  }[size];
  
  // Determine icon size based on container size
  // Make icons slightly bigger when revealed (for cards)
  const calculatedIconSize = iconSize || {
    'small': isRevealed ? 32 : 28,
    'medium': isRevealed ? 44 : 36,
    'large': isRevealed ? 56 : 48
  }[size];
  
  // Only add background for unrevealed icons
  const bgClass = isRevealed ? '' : 'bg-blue-50';
  
  return (
    <div className={`${sizeClass} aspect-square rounded-full flex items-center justify-center ${bgClass} ${className}`}>
      {children || getFactIcon(factType, isRevealed, calculatedIconSize)}
    </div>
  );
}

/**
 * Specialized version for fact card backs
 */
export function FactCardBackIcon({ fact, size = 'large' }: { fact: Fact<any>, size?: 'small' | 'large' }) {
  return (
    <IconContainer
      factType={fact.factType}
      isRevealed={true}
      size={size}
      className="bg-white"
    />
  );
} 