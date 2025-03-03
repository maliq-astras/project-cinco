'use client';

import React, { useCallback, useEffect } from 'react';
import { Fact } from '../types';
import { getFactIcon } from './FactBubble';

interface FactCardProps {
  fact: Fact<any>;
  onClose: () => void;
}

export default function FactCard({ fact, onClose }: FactCardProps) {
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay bg-black bg-opacity-50">
      <div className="relative w-[320px] h-[480px] bg-white rounded-md shadow-xl p-6 flex flex-col items-center justify-center overflow-hidden card-border-glow">
        {/* Card Content */}
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6 z-10">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            {getFactIcon(fact.factType, true)}
          </div>
          
          <h3 className="text-lg font-semibold text-blue-800 text-center">
            {fact.factType}
          </h3>
          
          <div className="w-16 h-0.5 bg-gray-200"></div>
          
          <div className="max-h-[240px] overflow-y-auto px-2 text-center">
            <p className="text-gray-700">{fact.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 