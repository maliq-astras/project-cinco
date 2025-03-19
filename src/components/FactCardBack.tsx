'use client';

import React from 'react';
import { Fact } from '../types';
import { FactCardBackIcon } from './IconContainer';
import { useTheme } from '../context/ThemeContext';

interface FactCardBackProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
}

export default function FactCardBack({ fact, size = 'large' }: FactCardBackProps) {
  const { colors } = useTheme();
  
  return (
    <div className={`bg-${colors.primary} rounded-lg flex items-center justify-center w-full h-full`}>
      <FactCardBackIcon fact={fact} size={size} />
    </div>
  );
} 