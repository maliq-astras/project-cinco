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
}

export default function LoadingAnimation({ finalCategory, onComplete }: LoadingAnimationProps) {
  // Filter out final category and randomize remaining categories on mount
  const [categories] = useState(() => {
    const filteredCategories = SAMPLE_CATEGORIES.filter(
      category => category.toUpperCase() !== finalCategory.toUpperCase()
    );
    return shuffleArray(filteredCategories);
  });
  
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isShowingFinal, setIsShowingFinal] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const steadySpeed = 550; // Consistent speed throughout
    let iterations = 0;
    const maxIterations = 8; // Reduced for ~5s total duration
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      if (!isAnimating) return;

      // If we're at the end, show the final category
      if (iterations >= maxIterations) {
        setCurrentCategory(finalCategory.toUpperCase());
        setIsShowingFinal(true);
        setIsAnimating(false);
        
        // Hold the final category
        timeoutId = setTimeout(onComplete, 1500);
        return;
      }

      // Cycle through randomized categories at steady pace
      currentIndex = (currentIndex + 1) % categories.length;
      setCurrentCategory(categories[currentIndex]);
      iterations++;

      timeoutId = setTimeout(animate, steadySpeed);
    };

    // Start the animation after logo appears
    timeoutId = setTimeout(animate, 800);

    return () => {
      setIsAnimating(false);
      clearTimeout(timeoutId);
    };
  }, [categories, finalCategory, onComplete]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="h-[170px]"
        >
          <Logo height="100%" className="text-blue-600" />
        </motion.div>

        {/* Category Slot Animation */}
        <div className="overflow-hidden h-[60px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentCategory}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 125,
                damping: 20,
                mass: 1,
                duration: isShowingFinal ? 0.6 : 0.45,
                opacity: { 
                  duration: isShowingFinal ? 0.5 : 0.35,
                  ease: "easeInOut"
                }
              }}
              className={`text-blue-600 m-0 ${righteous.className}`}
              style={{
                fontSize: "clamp(28px, 5vw, 46px)",
                lineHeight: 1
              }}
            >
              {currentCategory}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 