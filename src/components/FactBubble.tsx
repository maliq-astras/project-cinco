'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface FactBubbleProps {
  factType: string;
  isRevealed: boolean;
  'data-fact-index': number; // Changed to be required
  className?: string;
}

export default function FactBubble({ 
  factType, 
  isRevealed, 
  'data-fact-index': factIndex,
  className = ''
}: FactBubbleProps) {
  const revealFact = useGameStore(state => state.revealFact);
  const setHoveredFact = useGameStore(state => state.setHoveredFact);
  
  const [isPopping, setIsPopping] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const DOUBLE_CLICK_TIMEOUT = 300; // Time window for double click in ms
  const POP_ANIMATION_DURATION = 500; // Animation duration in ms
  const CARD_ANIMATION_DELAY = 900; // Delay before card animation starts (includes animation duration plus extra wait)

  // Handle click/tap with double-click/tap detection
  const handleInteraction = () => {
    if (isRevealed || isPopping) return;
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // First click/tap - start timer
      clickTimerRef.current = setTimeout(() => {
        // Reset if no second click/tap within timeout
        clickCountRef.current = 0;
      }, DOUBLE_CLICK_TIMEOUT);
    } else if (clickCountRef.current === 2) {
      // Double click/tap detected
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      
      // Start pop animation
      setIsPopping(true);
      
      // Trigger reveal after animation completes plus additional delay
      setTimeout(() => {
        revealFact(factIndex); // Use revealFact from store
        clickCountRef.current = 0;
      }, CARD_ANIMATION_DELAY);
    }
  };

  // Set up touch event listeners with proper options to prevent default behavior
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Function to prevent default behavior for touch events
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add event listeners with passive: false to allow preventDefault
    button.addEventListener('touchstart', preventZoom, { passive: false });
    button.addEventListener('touchend', () => handleInteraction(), { passive: true });

    // Clean up event listeners
    return () => {
      button.removeEventListener('touchstart', preventZoom);
      button.removeEventListener('touchend', () => handleInteraction());
    };
  }, [isRevealed, isPopping]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Bubble pop variants for more dramatic animation
  const bubbleVariants = {
    initial: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)"
    },
    exit: { 
      scale: [1, 1.3, 0.8, 1.2, 0], 
      opacity: [1, 1, 0.8, 0.5, 0],
      rotate: [0, -5, 5, -3, 0],
      filter: ["blur(0px)", "blur(0px)", "blur(2px)", "blur(8px)", "blur(12px)"],
      transition: { 
        duration: POP_ANIMATION_DURATION / 1000,
        times: [0, 0.2, 0.4, 0.6, 1],
        ease: "easeInOut"
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
      borderColor: "#3b82f6",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Particle effect for more dramatic pop
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      x: Math.cos(angle) * 50,
      y: Math.sin(angle) * 50,
      opacity: 0,
      scale: 0,
      rotate: Math.random() * 360
    };
  });

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setHoveredFact(factIndex)}
      onMouseLeave={() => setHoveredFact(null)}
    >
      <div className="relative w-full aspect-square">
        <AnimatePresence>
          {!isRevealed && !isPopping && (
            <motion.button
              ref={buttonRef}
              className="absolute inset-0 w-full h-full rounded-full 
                border-gray-300 border-4
                flex items-center justify-center"
              onClick={handleInteraction}
              variants={bubbleVariants}
              initial="initial"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              aria-label={`Double-tap to reveal ${factType} fact`}
              data-fact-index={factIndex}
              // Add touch-action CSS property to prevent browser handling of all touch actions
              style={{ touchAction: 'none' }}
            >
              {/* Always use gradient icons, but still pass isRevealed for opacity control */}
              {getFactIcon(factType, false, 32)}
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Particle effects that appear during pop animation */}
        <AnimatePresence>
          {isPopping && !isRevealed && (
            <>
              {particles.map((particle, index) => (
                <motion.div
                  key={`particle-${index}`}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-500"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ 
                    x: particle.x, 
                    y: particle.y, 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: particle.rotate
                  }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.3, 1],
                    ease: "easeOut" 
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function getFactIcon(factType: string, isRevealed: boolean = false, iconSize?: number): React.ReactNode {
  // Default size is 32, but can be overridden by the iconSize parameter
  const size = iconSize || 32;
  
  // Helper function to get the appropriate filter for each icon type
  const getIconFilter = (iconName: string) => {
    // Different blue gradient filters for different icons - always use gradients
    switch(iconName) {
      case 'languages':
        return 'brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(1800%) hue-rotate(230deg) brightness(95%) contrast(95%)';
      case 'flag':
        return 'brightness(0) saturate(100%) invert(40%) sepia(85%) saturate(1500%) hue-rotate(210deg) brightness(100%) contrast(95%)';
      case 'cityscape':
        return 'brightness(0) saturate(100%) invert(50%) sepia(90%) saturate(1200%) hue-rotate(200deg) brightness(100%) contrast(95%)';
      case 'economy':
        return 'brightness(0) saturate(100%) invert(45%) sepia(95%) saturate(1600%) hue-rotate(195deg) brightness(100%) contrast(95%)';
      case 'demographics':
        return 'brightness(0) saturate(100%) invert(35%) sepia(70%) saturate(2000%) hue-rotate(220deg) brightness(95%) contrast(100%)';
      case 'history':
        return 'brightness(0) saturate(100%) invert(30%) sepia(75%) saturate(1900%) hue-rotate(215deg) brightness(90%) contrast(95%)';
      case 'geography':
        return 'brightness(0) saturate(100%) invert(45%) sepia(85%) saturate(1400%) hue-rotate(190deg) brightness(100%) contrast(95%)';
      default: // wildcard
        return 'brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(1700%) hue-rotate(205deg) brightness(95%) contrast(95%)';
    }
  };
  
  // Helper function to render SVG icon with proper styling
  const renderSvgIcon = (iconName: string) => {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image 
          src={`/icons/${iconName}.svg`} 
          width={size} 
          height={size} 
          alt={factType}
          style={{ 
            filter: getIconFilter(iconName),
            opacity: isRevealed ? 1 : 0.7, // Still reduce opacity for unrevealed icons
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    );
  };
  
  switch(factType) {
    case 'Official Language(s)':
      return renderSvgIcon('languages');
    case 'Flag Colors & Features':
      return renderSvgIcon('flag');
    case 'Notable City':
      return renderSvgIcon('cityscape');
    case 'Largest Industry':
      return renderSvgIcon('economy');
    case 'Population & Demographic Info':
      return renderSvgIcon('demographics');
    case 'Origin/Founding':
      return renderSvgIcon('history');
    case 'Geographic Features & Border Info':
      return renderSvgIcon('geography');
    default:
      return renderSvgIcon('wildcard');
  }
} 