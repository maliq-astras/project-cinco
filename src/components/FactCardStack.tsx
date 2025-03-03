'use client';

import React, { useState, useEffect } from 'react';
import { Fact } from '../types';
import { getFactIcon } from './FactBubble';

interface FactCardStackProps {
  revealedFacts: number[];
  facts: Fact<any>[];
  onCardClick: (index: number) => void;
}

export default function FactCardStack({ revealedFacts, facts, onCardClick }: FactCardStackProps) {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });

  // Reset the initial render state when new facts are revealed
  useEffect(() => {
    setIsInitialRender(true);
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, revealedFacts.length * 100 + 500); // Wait for all cards to be dealt
    
    return () => clearTimeout(timer);
  }, [revealedFacts.length]);

  // Handle mouse movement over the card area to create a subtle tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setHandPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHandPosition({ x: 0, y: 0 }); // Reset to neutral position
  };

  if (revealedFacts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No facts revealed yet. Select a fact bubble below to reveal a clue!
      </div>
    );
  }

  // Calculate the fan angle based on the number of cards
  const fanAngle = Math.min(4, 12 / revealedFacts.length);
  const centerIndex = Math.floor(revealedFacts.length / 2);
  
  // Calculate the spread width based on the number of cards
  // For 5 cards, we want a wider spread than for 2 cards
  const spreadFactor = Math.max(40, 30 + (revealedFacts.length * 15));
  
  return (
    <div 
      className="flex justify-center items-end min-h-[250px] relative py-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative flex items-end justify-center transition-transform duration-300 ease-out" 
        style={{ 
          perspective: '1000px',
          transform: `rotateX(${handPosition.y * -3}deg) rotateY(${handPosition.x * 5}deg)`,
          width: '100%',
          height: '220px'
        }}
      >
        {revealedFacts.map((factIndex, i) => {
          // Calculate rotation and position for fan effect
          const isHovered = hoveredCardIndex === i;
          const isAdjacent = hoveredCardIndex !== null && 
                            (i === hoveredCardIndex - 1 || i === hoveredCardIndex + 1);
          
          // Base rotation for fan effect
          const baseRotation = (i - centerIndex) * fanAngle;
          
          // Base position - spread cards out in a fan
          const baseTranslateX = (i - centerIndex) * spreadFactor;
          
          // Adjust rotation and position when a card is hovered
          let rotation = baseRotation;
          let translateX = baseTranslateX;
          let translateY = 0;
          let scale = 1;
          let zIndex = revealedFacts.length - Math.abs(i - centerIndex); // Center cards on top
          let shadowClass = "shadow-sm";
          
          if (hoveredCardIndex !== null) {
            if (isHovered) {
              // Lift the hovered card up and forward
              translateY = -30;
              scale = 1.1;
              zIndex = 100; // Ensure it's on top
              rotation = 0; // Straighten the card
              shadowClass = "shadow-xl"; // Stronger shadow for lifted card
            } else if (isAdjacent) {
              // Adjacent cards move slightly away
              translateX = i < hoveredCardIndex ? translateX - 15 : translateX + 15;
              zIndex = 50 + i; // Higher than non-adjacent but lower than hovered
              shadowClass = "shadow-md"; // Medium shadow for adjacent cards
            } else {
              // Non-adjacent cards move slightly away
              translateX = i < hoveredCardIndex ? translateX - 10 : translateX + 10;
              translateY = -5; // Slight lift to create depth
            }
          }
          
          return (
            <div
              key={factIndex}
              onClick={() => onCardClick(factIndex)}
              onMouseEnter={() => setHoveredCardIndex(i)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              className={`absolute p-4 border border-gray-200 rounded-md 
                bg-white cursor-pointer w-[140px] h-[200px] card-hover-glow
                transition-all duration-300 ease-out ${shadowClass}
                ${isInitialRender ? 'card-in-hand' : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) 
                           rotate(${rotation}deg) scale(${scale})`,
                transformOrigin: 'bottom center',
                zIndex: zIndex,
                '--card-index': i,
                '--card-rotation': `${baseRotation}deg`,
                '--card-position': `${baseTranslateX}px`,
                '--card-offset': i - centerIndex,
                left: 'calc(50% - 70px)', // Center the card (half of card width)
                bottom: '0px',
              } as React.CSSProperties}
            >
              {/* Card Content */}
              <div className="w-full h-full flex flex-col items-center justify-center p-3 z-10">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  {getFactIcon(facts[factIndex].factType, true)}
                </div>
                <h4 className="text-xs font-medium text-center text-blue-800">
                  {facts[factIndex].factType}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 