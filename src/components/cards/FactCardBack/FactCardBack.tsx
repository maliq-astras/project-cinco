'use client';

import React from 'react';
import { Fact } from '@/types';
import { useFactCardBack } from './useFactCardBack';
import styles from './FactCardBack.module.css';

interface FactCardBackProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
  isRevealed?: boolean;
  inStack?: boolean;
}

export default function FactCardBack({ 
  fact, 
  size = 'large', 
  isRevealed = false,
  inStack = false
}: FactCardBackProps) {
  const { containerClasses, backgroundStyle, icon, iconStyle } = useFactCardBack({
    fact,
    size,
    isRevealed,
    inStack
  });
  
  return (
    <div className={containerClasses} style={backgroundStyle}>
      <div className={styles.iconContainer}>
        <img 
          src={`/icons/${icon.iconName}.svg`}
          alt={fact.factType}
          width={icon.size}
          height={icon.size}
          style={iconStyle}
          draggable="false"
        />
      </div>
    </div>
  );
} 