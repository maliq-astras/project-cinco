'use client';

import React from 'react';
import { Fact, CategoryType } from '@/types';
import { useFactCardBack } from './hooks';
import styles from './FactCardBack.module.css';

interface FactCardBackProps {
  fact: Fact<CategoryType>;
  size?: 'small' | 'large';
  isRevealed?: boolean;
  inStack?: boolean;
}

const FactCardBack = React.memo<FactCardBackProps>(({ 
  fact, 
  size = 'large', 
  isRevealed = false,
  inStack = false
}) => {
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
});

FactCardBack.displayName = 'FactCardBack';

export default FactCardBack; 