'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import Logo from './Logo';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

// Sample categories to cycle through
const SAMPLE_CATEGORIES = [
  'COUNTRIES',
  'MOVIES',
  'ANIMALS',
  'BOOKS',
  'ATHLETES',
  'MUSIC',
  'HISTORICAL FIGURES',
  'TV SHOWS',
  'FAMOUS BRANDS'
];

// Fisher-Yates shuffle algorithm to randomize array
const shuffleArray = (array: string[]): string[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface LoadingAnimationProps {
  finalCategory: string;
  onComplete: () => void;
  isChallengeFetched: boolean;
}

export default function LoadingAnimation({ 
  finalCategory, 
  onComplete, 
  isChallengeFetched 
}: LoadingAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Set mounted to true after client-side hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize the categories only after mounting (client-side only)
  useEffect(() => {
    if (mounted) {
      const filteredCategories = SAMPLE_CATEGORIES.filter(
        category => category.toUpperCase() !== finalCategory.toUpperCase()
      );
      const shuffled = shuffleArray(filteredCategories);
      setCategories([...shuffled, finalCategory.toUpperCase()]);
    }
  }, [mounted, finalCategory]);

  // Handle the animation, but only after mounting
  useEffect(() => {
    if (!mounted || categories.length === 0) return;
    
    const categorySpeed = 100; // Faster speed for more slot-like feel
    const finalCategoryHoldTime = 2500; // Hold the final category for 2.5 seconds
    let timeoutId: NodeJS.Timeout;
    
    // Function to cycle through categories
    const animate = () => {
      if (currentIndex >= categories.length - 1) {
        // We've reached the final category
        setCurrentIndex(categories.length - 1);
        setIsAnimationComplete(true);
        
        // Hold on the final category, then complete if challenge is fetched
        if (isChallengeFetched) {
          timeoutId = setTimeout(onComplete, finalCategoryHoldTime);
        }
        return;
      }
      
      // Move to next category
      setCurrentIndex(prev => prev + 1);
      
      // Speed up as we approach the end, then slow down for the last few
      const progress = currentIndex / categories.length;
      let nextDelay = categorySpeed;
      
      if (progress < 0.3) {
        // Start somewhat slow
        nextDelay = categorySpeed * 3;
      } else if (progress < 0.6) {
        // Speed up in the middle
        nextDelay = categorySpeed * 2;
      } else if (progress < 0.85) {
        // Full speed near the end
        nextDelay = categorySpeed;
      } else {
        // Slow down for the last few
        nextDelay = categorySpeed * 4;
      }
      
      timeoutId = setTimeout(animate, nextDelay);
    };
    
    // Start animation after a brief delay
    timeoutId = setTimeout(animate, 800);
    
    return () => clearTimeout(timeoutId);
  }, [categories, currentIndex, isChallengeFetched, onComplete, mounted]);

  // Watch for when challenge is fetched after animation completes
  useEffect(() => {
    if (!mounted) return;
    if (isAnimationComplete && isChallengeFetched) {
      // Add a delay here too to ensure we hold on the final category
      const timeoutId = setTimeout(onComplete, 2500);
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimationComplete, isChallengeFetched, onComplete, mounted]);
  
  // Helper function to calculate appropriate font size based on text length
  const calculateFontSize = (text: string) => {
    if (!text) return "clamp(28px, 5vw, 44px)";
    
    if (text.length > 15) {
      return "clamp(22px, 4vw, 34px)"; // Smaller font for very long text
    } else if (text.length > 10) {
      return "clamp(24px, 4.5vw, 38px)"; // Medium font for moderately long text
    } else {
      return "clamp(28px, 5vw, 44px)"; // Default font size for short text
    }
  };

  // Get the current category to display
  const currentCategory = categories.length > 0 ? categories[currentIndex] : "";
  
  // Determine if we're showing the final category
  const isShowingFinalCategory = currentIndex === categories.length - 1;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Logo - keep it in black (default) */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="h-[220px]"
        >
          <Logo height="100%" />
        </motion.div>

        {/* Category Slot Animation with line above */}
        <div className="relative w-full flex flex-col items-center">
          {/* Line container with overflow hidden */}
          <div className="absolute top-[-12px] w-screen overflow-hidden">
            {/* Line above category - appears when showing final category */}
            {mounted && isShowingFinalCategory && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100vw" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="h-1 bg-blue-600/30 mx-auto"
              />
            )}
          </div>

          {/* Category container */}
          <div className="relative overflow-hidden h-[80px] flex items-center justify-center px-8 w-full max-w-[400px]">
            {mounted && categories.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentCategory}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    scale: isShowingFinalCategory ? 1.08 : 1 
                  }}
                  exit={{ y: -80, opacity: 0 }}
                  transition={{ 
                    type: isShowingFinalCategory ? "spring" : "tween",
                    stiffness: 80,
                    damping: 12,
                    mass: 1.2,
                    duration: isShowingFinalCategory ? 0.75 : 0.15,
                    ease: isShowingFinalCategory ? [0.34, 1.56, 0.64, 1] : "easeInOut",
                    opacity: { 
                      duration: isShowingFinalCategory ? 0.65 : 0.1
                    },
                    scale: {
                      duration: 0.5,
                      ease: [0.34, 1.56, 0.64, 1]
                    }
                  }}
                  className={`text-blue-600 m-0 ${righteous.className} ${isShowingFinalCategory ? 'font-bold' : ''}`}
                  style={{
                    fontSize: calculateFontSize(currentCategory),
                    lineHeight: 1,
                    padding: "0 12px",
                    whiteSpace: "nowrap",
                    textShadow: isShowingFinalCategory ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  {currentCategory}
                </motion.h1>
              </AnimatePresence>
            ) : (
              <div className="h-[44px]"></div>
            )}
          </div>
        </div>
        
        {/* Loading indicator */}
        {mounted && isAnimationComplete && !isChallengeFetched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-col items-center"
          >
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Please wait, loading challenge...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 