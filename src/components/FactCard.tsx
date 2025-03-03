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
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white rounded-xl p-6 w-[320px] h-[480px] mx-4 relative shadow-xl">
        {/* Card Corners - Top Left */}
        <div className="absolute top-3 left-3 text-center">
          <div className="font-swanky text-3xl leading-none">5</div>
        </div>
        
        {/* Card Corners - Bottom Right */}
        <div className="absolute bottom-3 right-3 text-center rotate-180">
          <div className="font-swanky text-3xl leading-none">5</div>
        </div>
        
        {/* Card Content */}
        <div className="flex flex-col items-center h-full justify-center">
          {/* Icon Circle */}
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100 mb-6">
            {getFactIcon(fact.factType, true)}
          </div>
          
          {/* Fact Type */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            {fact.factType}
          </h3>
          
          {/* Decorative Line */}
          <div className="w-16 h-0.5 bg-blue-100 mb-6"></div>
          
          {/* Fact Content */}
          <div className="max-h-[200px] overflow-y-auto px-4">
            <p className="text-gray-600 leading-relaxed text-center">
              {fact.content}
            </p>
          </div>
        </div>
        
        {/* Card Border */}
        <div className="absolute inset-4 border border-gray-200 rounded-lg pointer-events-none"></div>
      </div>
    </div>
  );
} 