'use client';

import React from 'react';
import { 
  Globe, 
  Flag, 
  Buildings, 
  Briefcase, 
  Users, 
  Bank, 
  MapTrifold, 
  Question 
} from 'phosphor-react';

interface FactBubbleProps {
  factType: string;
  isRevealed: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function FactBubble({ 
  factType, 
  isRevealed, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: FactBubbleProps) {
  return (
    <button
      className={`w-20 h-20 rounded-full border-4 
        ${isRevealed 
          ? 'border-blue-500 bg-blue-50 shadow-inner' 
          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 shadow-md hover:shadow-lg'} 
        flex items-center justify-center transition-all transform hover:scale-110`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={isRevealed}
      aria-label={factType}
    >
      {getFactIcon(factType, isRevealed)}
    </button>
  );
}

export function getFactIcon(factType: string, isRevealed: boolean = false): React.ReactNode {
  const size = 32;
  const color = isRevealed ? "#3b82f6" : "#6b7280";
  const weight = isRevealed ? "fill" : "regular";
  
  switch(factType) {
    case 'Official Language(s)':
      return <Globe size={size} color={color} weight={weight} />;
    case 'Flag Colors & Features':
      return <Flag size={size} color={color} weight={weight} />;
    case 'Notable City':
      return <Buildings size={size} color={color} weight={weight} />;
    case 'Largest Industry':
      return <Briefcase size={size} color={color} weight={weight} />;
    case 'Population & Demographic Info':
      return <Users size={size} color={color} weight={weight} />;
    case 'Origin/Founding':
      return <Bank size={size} color={color} weight={weight} />;
    case 'Geographic Features & Border Info':
      return <MapTrifold size={size} color={color} weight={weight} />;
    default:
      return <Question size={size} color={color} weight={weight} />;
  }
} 