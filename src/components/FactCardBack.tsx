'use client';

import React from 'react';
import { Fact } from '../types';
import FactCardBackIcon from './FactCardBackIcon';
import { useFactCardBack } from '../hooks/useFactCardBack';

interface FactCardBackProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
  isFinalFive?: boolean;
  isRevealed?: boolean;
  inStack?: boolean;
}

/**
 * Component that displays the back side of a fact card
 * Used in the card stack and when cards are flipped
 */
export default function FactCardBack({ 
  fact, 
  size = 'large', 
  isFinalFive = false, 
  isRevealed = false,
  inStack = false
}: FactCardBackProps) {
  // Use the custom hook for styles and classes
  const { backgroundStyle, containerClasses } = useFactCardBack({
    isFinalFive,
    isRevealed,
    inStack
  });
  
  return (
    <div 
      className={containerClasses}
      style={backgroundStyle}
    >
      <FactCardBackIcon fact={fact} size={size} />
    </div>
  );
} 