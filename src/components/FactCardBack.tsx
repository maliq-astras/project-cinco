'use client';

import React from 'react';
import { Fact } from '../types';
import { FactCardBackIcon } from './IconContainer';
import { useTheme } from '../context/ThemeContext';

interface FactCardBackProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
  isFinalFive?: boolean;
  isRevealed?: boolean;
  inStack?: boolean;
}

export default function FactCardBack({ 
  fact, 
  size = 'large', 
  isFinalFive = false, 
  isRevealed = false,
  inStack = false
}: FactCardBackProps) {
  const { colors } = useTheme();
  
  return (
    <div 
      className={`w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 relative rounded-lg
        ${isFinalFive ? 'bg-gray-50 dark:bg-gray-800' : ''}
        ${isRevealed ? 'revealed-fact' : ''}
        ${inStack ? 'border border-white/40 dark:border-white/20' : ''}`}
      style={{
        background: !isFinalFive ? `var(--color-${colors.primary})` : undefined
      }}
    >
      <FactCardBackIcon fact={fact} size={size} />
    </div>
  );
} 