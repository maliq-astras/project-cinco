'use client';

import React from 'react';

interface FinalFiveOptionsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export default function FinalFiveOptions({ options, onSelect }: FinalFiveOptionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      {options.map((option, index) => (
        <button
          key={index}
          className="p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors text-left font-medium shadow-sm hover:shadow"
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
} 