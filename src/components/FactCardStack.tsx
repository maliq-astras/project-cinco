'use client';

import React from 'react';
import { Fact } from '../types';
import { getFactIcon } from './FactBubble';

interface FactCardStackProps {
  revealedFacts: number[];
  facts: Fact<any>[];
  onCardClick: (factIndex: number) => void;
}

export default function FactCardStack({ 
  revealedFacts, 
  facts, 
  onCardClick 
}: FactCardStackProps) {
  if (revealedFacts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Revealed facts will appear here
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[200px] relative">
      <div className="flex">
        {revealedFacts.map((factIndex, i) => (
          <button
            key={factIndex}
            onClick={() => onCardClick(factIndex)}
            className="revealed-fact-card p-4 border border-gray-200 rounded-lg 
              bg-white hover:bg-blue-50 transition-all duration-200
              shadow-sm hover:shadow-md text-left
              hover:-translate-y-4 cursor-pointer w-[140px] h-[200px]"
            style={{
              marginLeft: i === 0 ? '0' : '-40px',
              zIndex: i,
              transformOrigin: 'bottom center',
            }}
          >
            {/* Top Left Corner */}
            <div className="absolute top-1 left-2">
              <div className="font-swanky text-xl leading-none">5</div>
            </div>
            
            {/* Bottom Right Corner */}
            <div className="absolute bottom-1 right-2 rotate-180">
              <div className="font-swanky text-xl leading-none">5</div>
            </div>
            
            {/* Card Content */}
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl mb-2">
                {getFactIcon(facts[factIndex].factType, true)}
              </div>
              <div className="text-xs font-medium text-gray-600 text-center">
                {facts[factIndex].factType}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 