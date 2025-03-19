'use client';

import React, { useEffect, useState, useRef } from 'react';
import { UserGuess } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

export default function GuessProgressBar() {
  // Access state from the store
  const guesses = useGameStore(state => state.gameState.guesses);
  const maxGuesses = 5; // Set a constant value or use one from config if available
  const { colors } = useTheme();
  
  // Filter to only wrong guesses
  const wrongGuesses = guesses.filter(guess => !guess.isCorrect);
  const wrongGuessCount = wrongGuesses.length;
  
  // State to track animation
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const prevWrongGuessCount = useRef(0);
  
  // Update animated count when wrong guesses change
  useEffect(() => {
    if (wrongGuessCount > animatedCount) {
      // Delay the animation slightly for effect
      const timer = setTimeout(() => {
        setAnimatedCount(wrongGuessCount);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessCount, animatedCount]);
  
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
  
  return (
    <div className="w-full">
      <div 
        className={`flex w-full h-4 sm:h-5 overflow-hidden rounded-full shadow-sm ${isShaking ? 'animate-shake' : ''}`}
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
      </div>
    </div>
  );
} 