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
  const calculatedIconSize = iconSize || {
    'small': 28,
    'medium': 36,
    'large': 48
  }[size];
  
  return (
    <div className={`${sizeClass} aspect-square rounded-full flex items-center justify-center ${className}`}>
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
      isRevealed={false}
      size={size}
      className="bg-white"
    />
  );
} 