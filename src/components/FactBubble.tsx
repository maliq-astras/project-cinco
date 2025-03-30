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
  id?: string;
}

export default function FactBubble({ 
  factType, 
  isRevealed, 
  'data-fact-index': factIndex,
  className = '',
  style = {},
  category = 'countries',
  id
}: FactBubbleProps) {
  const revealFact = useGameStore(state => state.revealFact);
  const setHoveredFact = useGameStore(state => state.setHoveredFact);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const windowWidth = useGameStore(state => state.windowWidth);
  
  const [isPopping, setIsPopping] = useState(false);
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const DOUBLE_CLICK_TIMEOUT = 300; // Time window for double click in ms
  const TOUCH_CONTEXT_TIMEOUT = 500; // Time to show context before clearing on mobile
  const POP_ANIMATION_DURATION = 500; // Animation duration in ms
  const CARD_ANIMATION_DELAY = 900; // Delay before card animation starts (includes animation duration plus extra wait)
  const { colors } = useTheme();
  const getFilter = useIconFilter();
  
  // Detect if we're on a touch device (mobile)
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // Check for touch capability when component mounts
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Check if this bubble is clickable based on game rules
  const isClickable = () => {
    // Always allow re-viewing already revealed facts
    if (isRevealed) return true;
    
    // New facts can only be revealed if canRevealNewClue is true
    return canRevealNewClue;
  };

  // Handle click/tap with double-click/tap detection
  const handleInteraction = () => {
    if (isRevealed || isPopping) return;
    if (!isClickable()) return; // Don't proceed if not clickable
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // First click/tap - start timer
      clickTimerRef.current = setTimeout(() => {
        // If we didn't detect a second tap, and we're on a touch device,
        // then we'll count this as a single tap that should just show context
        if (isTouchDevice) {
          clickCountRef.current = 0;
          // Single tap action for mobile: show context
        } else {
          // On desktop, single click doesn't do anything by itself
          clickCountRef.current = 0;
        }
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

  // Handle touch start - show context on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isClickable() || isPopping) return;
    
    // Prevent zooming on multi-touch
    if (e.touches.length > 1) {
      e.preventDefault();
    }
    
    // For mobile: set hovered fact to show context on single tap
    setHoveredFact(factIndex);
    setIsTouched(true);
    
    // Clear any existing touch timer
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (!isClickable() || isPopping) return;
    
    // Call the interaction handler for double-tap detection
    handleInteraction();
    
    // For mobile: keep context visible for a short time after touching
    touchTimerRef.current = setTimeout(() => {
      if (clickCountRef.current === 0) {
        // Only clear the hover state if we're not in a double-tap sequence
        setHoveredFact(null);
        setIsTouched(false);
      }
    }, TOUCH_CONTEXT_TIMEOUT);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
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
      // Don't animate borderColor to prevent the warning
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

  // Get tooltip text based on state
  const getTooltipText = () => {
    if (isRevealed) return "Click to view this fact again";
    if (!hasSeenClue) {
      return isTouchDevice 
        ? "Tap to preview, double-tap to reveal" 
        : "Double-click to reveal your first fact";
    }
    if (!canRevealNewClue) return "Make a guess before revealing a new fact";
    return isTouchDevice 
      ? `Tap to preview, double-tap to reveal ${factType}` 
      : `Double-click to reveal ${factType} fact`;
  };

  return (
    <div 
      className={`relative ${className}`}
      style={style}
      onMouseEnter={() => !isTouchDevice && isClickable() && setHoveredFact(factIndex)}
      onMouseLeave={() => !isTouchDevice && setHoveredFact(null)}
    >
      <div className="relative w-full aspect-square">
        <AnimatePresence>
          {!isRevealed && !isPopping && (
            <motion.button
              ref={buttonRef}
              className={`absolute inset-0 w-full h-full rounded-full 
                ${isTouched ? `border-${colors.primary}` : `border-${colors.light}`} border-4 
                ${isClickable() ? `hover:border-${colors.primary} cursor-pointer` : 'cursor-not-allowed opacity-60'}
                flex items-center justify-center`}
              onClick={isTouchDevice ? undefined : handleInteraction}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              variants={bubbleVariants}
              initial="initial"
              exit="exit"
              whileHover={isClickable() && !isTouchDevice ? "hover" : "initial"}
              whileTap={isClickable() ? "tap" : "initial"}
              aria-label={getTooltipText()}
              data-fact-index={factIndex}
              // Add touch-action CSS property to prevent browser handling of all touch actions
              style={{ touchAction: 'none' }}
            >
              {/* Use the updated icon object format */}
              {(() => {
                // Calculate icon size based on available space
                // Adjust multipliers to make icons smaller
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
                      opacity: isClickable() ? 0.7 : 0.4,
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