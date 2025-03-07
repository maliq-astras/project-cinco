'use client';

import React from 'react';
import { Fact } from '../types';
import { FactCardBackIcon } from './IconContainer';

interface FactCardBackProps {
  fact: Fact<any>;
  size?: 'small' | 'large';
}

export default function FactCardBack({ fact, size = 'large' }: FactCardBackProps) {
  return (
    <div className="bg-blue-600 rounded-lg flex items-center justify-center w-full h-full">
      <FactCardBackIcon fact={fact} size={size} />
    </div>
  );
} 