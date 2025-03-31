'use client';

import React, { useEffect, useState, useRef } from 'react';
import { UserGuess } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

// Spark particle component
const Spark: React.FC<{
  delay: number;
  x: number | string;
  y: number | string;
  color: string;
  size?: number;
  xDelta?: number;
  yDelta?: number;
}> = ({ delay, x, y, color, size = 1, xDelta = 0, yDelta = 0 }) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ 
        backgroundColor: color,
        x, 
        y,
        height: `${size}px`,
        width: `${size}px`,
        filter: "blur(0.5px) brightness(1.5)",
        boxShadow: `0 0 ${size * 3}px ${color}`
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0], 
        scale: [0, 1.8, 0],
        x: typeof x === 'string' ? 
           [x, `calc(${x} + ${xDelta}px)`] : 
           [`${x}px`, `${x + xDelta}px`],
        y: typeof y === 'string' ? 
           [y, `calc(${y} + ${yDelta}px)`] : 
           [`${y}px`, `${y + yDelta}px`],
      }}
      transition={{ 
        duration: 1.0 + (Math.random() * 0.5), 
        delay,
        ease: [0.36, 0.07, 0.19, 0.97]
      }}
    />
  );
};

export default function GuessProgressBar() {
  // Access state from the store
  const guesses = useGameStore(state => state.gameState.guesses);
  const maxGuesses = 5; // Set a constant value or use one from config if available
  const { colors } = useTheme();
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  
  // Filter to only wrong guesses (excluding Final Five guesses)
  const wrongGuesses = guesses.filter(guess => !guess.isCorrect && !guess.isFinalFiveGuess);
  const wrongGuessCount = wrongGuesses.length;
  
  // State to track animation
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const prevWrongGuessCount = useRef(0);
  
  // Update animated count when wrong guesses change
  useEffect(() => {
    if (wrongGuessCount > animatedCount) {
      // Delay the animation slightly for effect
      const timer = setTimeout(() => {
        setAnimatedCount(wrongGuessCount);
        
        // If this is the last wrong guess (maxGuesses), trigger the sparks animation
        if (wrongGuessCount === maxGuesses) {
          setShowSparks(true);
          
          // Hide sparks after animation completes
          setTimeout(() => {
            setShowSparks(false);
          }, 1200);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessCount, animatedCount, maxGuesses]);
  
  // Trigger shake animation when wrong guesses increase
  useEffect(() => {
    if (wrongGuessCount > prevWrongGuessCount.current) {
      setIsShaking(true);
      
      // Show the toast notification
      const toast = document.getElementById('wrong-guess-toast');
      if (toast) {
        toast.classList.remove('hidden');
        
        setTimeout(() => {
          toast.classList.add('animate-fadeOut');
          setTimeout(() => {
            toast.classList.remove('animate-fadeIn', 'animate-fadeOut');
            toast.classList.add('hidden');
          }, 300);
        }, 2000);
      }
      
      // Shake all fact bubbles together for wrong guesses
      const factBubbles = document.querySelectorAll('[data-fact-index]');
      factBubbles.forEach(bubble => {
        // Remove any existing animations first to avoid conflicts
        bubble.classList.remove('animate-shake', 'animate-wiggle', 'animate-bounce', 'animate-pulse');
        // Use a non-infinite shake for wrong guesses
        (bubble as HTMLElement).style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        setTimeout(() => {
          (bubble as HTMLElement).style.animation = '';
        }, 500);
      });
      
      // Reset shake after animation completes
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
    
    prevWrongGuessCount.current = wrongGuessCount;
  }, [wrongGuessCount]);

  // Generate spark positions
  const generateSparks = () => {
    const sparks = [];
    const numSparks = 40; // More sparks
    const barWidth = 100; // percent
    const barHeight = 10; // height in pixels (approximate)
    
    // Colors based on theme
    const primaryColor = `var(--color-${colors.primary})`;
    const secondaryColor = `var(--color-${colors.secondary})`;
    const whiteColor = "rgba(255, 255, 255, 0.9)";
    
    for (let i = 0; i < numSparks; i++) {
      const x = Math.random() * barWidth; // random position along bar (%)
      const y = (Math.random() * barHeight) - (barHeight / 2); // random position vertically centered on bar
      const delay = Math.random() * 0.8; // longer staggered effect
      const distance = 30 + Math.random() * 60; // Particles travel farther
      const angle = Math.random() * Math.PI * 2; // 360 degree random angle
      const xDelta = Math.cos(angle) * distance;
      const yDelta = Math.sin(angle) * distance;
      
      // Mix in some white sparks for variety
      const sparkColor = Math.random() > 0.7 ? whiteColor : 
                         Math.random() > 0.5 ? primaryColor : secondaryColor;
      
      // Randomize size slightly
      const size = 1 + Math.random() * 1.5;
      
      sparks.push(
        <Spark 
          key={i} 
          delay={delay} 
          x={`${x}%`} 
          y={y} 
          color={sparkColor}
          size={size}
          xDelta={xDelta}
          yDelta={yDelta}
        />
      );
    }
    
    return sparks;
  };
  
  return (
    <div className="w-full">
      <div 
        className={`flex w-full h-4 sm:h-5 overflow-hidden rounded-full shadow-sm ${isShaking ? 'animate-shake' : ''} relative`}
      >
        {Array.from({ length: maxGuesses }).map((_, index) => (
          <div 
            key={index}
            className={`flex-1 relative ${index > 0 ? 'border-l-2 border-white' : ''} bg-gray-200 overflow-hidden`}
          >
            {index < animatedCount && (
              <AnimatePresence>
                <motion.div 
                  className="absolute inset-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 0.7,
                    ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
                    delay: index * 0.1 // Stagger the animations
                  }}
                >
                  {/* Premium gradient background - using direct color variable names */}
                  <div 
                    className="absolute inset-0" 
                    style={{ 
                      background: `linear-gradient(to right, var(--color-${colors.primary}), var(--color-${colors.secondary}))` 
                    }}
                  />
                  
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-10" />
                  
                  {/* Subtle bottom shadow for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-[1px] opacity-20" 
                    style={{ backgroundColor: `var(--color-${colors.dark})` }}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
        
        {/* Sparks animation when the bar is full */}
        <AnimatePresence>
          {showSparks && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {generateSparks()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final pulse glow effect when the bar is full */}
        <AnimatePresence>
          {showSparks && (
            <motion.div 
              className="absolute inset-0 rounded-full pointer-events-none" 
              style={{ 
                background: `linear-gradient(to right, var(--color-${colors.primary}), var(--color-${colors.secondary}))`,
                opacity: 0
              }}
              animate={{ 
                opacity: [0, 0.7, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1, 
                ease: "easeOut"
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 