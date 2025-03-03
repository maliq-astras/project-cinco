'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 5000; // 5 seconds
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms

  // Handle hold start
  const handleHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior for touch events to avoid scrolling
    if ('touches' in e) {
      e.preventDefault();
    }
    
    if (isRevealed) return;
    
    setIsHolding(true);
    setProgress(0);
    
    // Start progress interval
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (PROGRESS_INTERVAL / HOLD_DURATION) * 100;
        return Math.min(newProgress, 100);
      });
    }, PROGRESS_INTERVAL);
    
    // Set timer for the full hold duration
    holdTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsHolding(false);
      setProgress(0);
      onClick();
    }, HOLD_DURATION);
  };

  // Handle hold end
  const handleHoldEnd = () => {
    if (isRevealed) return;
    
    setIsHolding(false);
    
    // Clear timers
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Reset progress with animation
    const resetInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - 5; // Decrease faster than it increases
        if (newProgress <= 0) {
          clearInterval(resetInterval);
          return 0;
        }
        return newProgress;
      });
    }, 20);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Calculate the stroke-dasharray and stroke-dashoffset for the progress circle
  const circleRadius = 38; // Slightly smaller than the button radius
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - progress / 100);

  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        onMouseLeave();
        handleHoldEnd();
      }}
    >
      <button
        className={`w-20 h-20 rounded-full border-4 
          ${isRevealed 
            ? 'border-blue-500 bg-blue-50 shadow-inner' 
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 shadow-md hover:shadow-lg'} 
          flex items-center justify-center transition-all transform ${isHolding ? 'scale-105' : 'hover:scale-110'}`}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        disabled={isRevealed}
        aria-label={factType}
      >
        {getFactIcon(factType, isRevealed)}
      </button>
      
      {/* Progress Circle */}
      {!isRevealed && progress > 0 && (
        <svg 
          className="absolute top-0 left-0 w-20 h-20 -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            fill="none"
            stroke="rgba(59, 130, 246, 0.8)" // Blue with transparency
            strokeWidth="4"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-50 ease-linear"
          />
        </svg>
      )}
    </div>
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