'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getFactIcon, useIconFilter } from '../helpers/iconHelpers';
import { useTheme } from '../context/ThemeContext';

interface FactBubbleProps {
  factType: string;
  isRevealed: boolean;
  'data-fact-index': number;
  className?: string;
  style?: React.CSSProperties;
  category?: string;
}

export default function FactBubble({ 
  factType, 
  isRevealed, 
  'data-fact-index': factIndex,
  className = '',
  style = {},
  category = 'countries'
}: FactBubbleProps) {
  const revealFact = useGameStore(state => state.revealFact);
  const setHoveredFact = useGameStore(state => state.setHoveredFact);
  
  const [isPopping, setIsPopping] = useState(false);
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const DOUBLE_CLICK_TIMEOUT = 300; // Time window for double click in ms
  const POP_ANIMATION_DURATION = 500; // Animation duration in ms
  const CARD_ANIMATION_DELAY = 900; // Delay before card animation starts (includes animation duration plus extra wait)
  const { colors } = useTheme();
  const getFilter = useIconFilter();

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
      boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.4)",
      borderColor: "rgb(var(--primary-rgb))",
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
      style={style}
      onMouseEnter={() => setHoveredFact(factIndex)}
      onMouseLeave={() => setHoveredFact(null)}
    >
      <div className="relative w-full aspect-square">
        <AnimatePresence>
          {!isRevealed && !isPopping && (
            <motion.button
              ref={buttonRef}
              className={`absolute inset-0 w-full h-full rounded-full 
                border-${colors.light} border-4
                flex items-center justify-center`}
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
              {/* Use the updated icon object format */}
              {(() => {
                // Calculate icon size based on available space
                // Adjust multipliers to make icons smaller
                const windowWidth = window.innerWidth;
                const sizeMultiplier = windowWidth < 480 ? 0.5 : windowWidth < 768 ? 0.55 : 0.6;
                const containerSize = style.width ? parseInt(style.width.toString()) : windowWidth < 640 ? 65 : 80;
                const iconSize = Math.max(28, Math.round(containerSize * sizeMultiplier));
                
                const icon = getFactIcon(factType, false, iconSize, category);
                return (
                  <img 
                    src={`/icons/${icon.iconName}.svg`}
                    alt={factType}
                    width={icon.size}
                    height={icon.size}
                    style={{
                      filter: getFilter(icon.category),
                      opacity: icon.isRevealed ? 1 : 0.7,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                );
              })()}
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
                  className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-${colors.primary}`}
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