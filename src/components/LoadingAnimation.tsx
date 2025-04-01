'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { CategoryType, categoryColorMap, ThemeColors } from '../types';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

// Helper function to convert tailwind color class to RGB values
const getColorRGB = (colorClass: string): string => {
  // This is a simplified mapping of tailwind colors to RGB values
  const colorMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': '37, 99, 235',
    'blue-500': '59, 130, 246',
    'blue-400': '96, 165, 250',
    'blue-700': '29, 78, 216',
    
    // Emerald (Animals)
    'emerald-600': '5, 150, 105',
    'emerald-500': '16, 185, 129',
    'emerald-400': '52, 211, 153',
    'emerald-700': '4, 120, 87',
    
    // Violet (Movies)
    'violet-600': '124, 58, 237',
    'violet-500': '139, 92, 246',
    'violet-400': '167, 139, 250',
    'violet-700': '109, 40, 217',
    
    // Orange (Books)
    'orange-600': '234, 88, 12',
    'orange-500': '249, 115, 22',
    'orange-400': '251, 146, 60',
    'orange-700': '194, 65, 12',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': '192, 38, 211',
    'fuchsia-500': '217, 70, 239',
    'fuchsia-400': '232, 121, 249',
    'fuchsia-700': '162, 28, 175',
    
    // Red (Athletes)
    'red-600': '220, 38, 38',
    'red-500': '239, 68, 68',
    'red-400': '248, 113, 113',
    'red-700': '185, 28, 28',
    
    // Amber (Historical Figures)
    'amber-600': '217, 119, 6',
    'amber-500': '245, 158, 11',
    'amber-400': '251, 191, 36',
    'amber-300': '252, 211, 77',
    
    // Teal (Famous Brands)
    'teal-600': '13, 148, 136',
    'teal-500': '20, 184, 166',
    'teal-400': '45, 212, 191',
    'teal-300': '94, 234, 212',
    
    // Indigo (TV Shows)
    'indigo-600': '79, 70, 229',
    'indigo-500': '99, 102, 241',
    'indigo-400': '129, 140, 248',
    'indigo-300': '165, 180, 252'
  };
  
  // If the color isn't directly in the map, try to derive it
  if (!colorMap[colorClass]) {
    const [colorName, shade] = colorClass.split('-');
    // Try different shades if the exact one isn't available
    const alternativeShades = ['600', '500', '400', '700'];
    for (const altShade of alternativeShades) {
      const alternative = `${colorName}-${altShade}`;
      if (colorMap[alternative]) {
        return colorMap[alternative];
      }
    }
  }
  
  return colorMap[colorClass] || '59, 130, 246'; // Default to blue-500
};

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

// Map category names to CategoryType enum values
const categoryNameToType: Record<string, CategoryType> = {
  'COUNTRIES': CategoryType.COUNTRIES,
  'MOVIES': CategoryType.MOVIES,
  'ANIMALS': CategoryType.ANIMALS,
  'BOOKS': CategoryType.BOOKS,
  'ATHLETES': CategoryType.ATHLETES,
  'MUSIC': CategoryType.MUSICAL_ARTISTS,
  'MUSICAL ARTISTS': CategoryType.MUSICAL_ARTISTS,
  'HISTORICAL FIGURES': CategoryType.HISTORICAL_FIGURES,
  'TV SHOWS': CategoryType.TV_SHOWS,
  'FAMOUS BRANDS': CategoryType.FAMOUS_BRANDS
};

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

// Helper function to get shadow color for a category
const getShadowColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    // Blues (Countries)
    'blue-600': 'rgba(37, 99, 235, 0.3)',
    'blue-500': 'rgba(59, 130, 246, 0.3)',
    'blue-400': 'rgba(96, 165, 250, 0.3)',
    
    // Emerald (Animals)
    'emerald-600': 'rgba(5, 150, 105, 0.3)',
    'emerald-500': 'rgba(16, 185, 129, 0.3)',
    'emerald-400': 'rgba(52, 211, 153, 0.3)',
    
    // Violet (Movies)
    'violet-600': 'rgba(124, 58, 237, 0.3)',
    'violet-500': 'rgba(139, 92, 246, 0.3)',
    'violet-400': 'rgba(167, 139, 250, 0.3)',
    
    // Orange (Books)
    'orange-600': 'rgba(234, 88, 12, 0.3)',
    'orange-500': 'rgba(249, 115, 22, 0.3)',
    'orange-400': 'rgba(251, 146, 60, 0.3)',
    
    // Fuchsia (Musical Artists)
    'fuchsia-600': 'rgba(192, 38, 211, 0.3)',
    'fuchsia-500': 'rgba(217, 70, 239, 0.3)',
    'fuchsia-400': 'rgba(232, 121, 249, 0.3)',
    
    // Red (Athletes)
    'red-600': 'rgba(220, 38, 38, 0.3)',
    'red-500': 'rgba(239, 68, 68, 0.3)',
    'red-400': 'rgba(248, 113, 113, 0.3)',
    
    // Amber (Historical Figures)
    'amber-600': 'rgba(217, 119, 6, 0.3)',
    'amber-500': 'rgba(245, 158, 11, 0.3)',
    'amber-400': 'rgba(251, 191, 36, 0.3)',
    
    // Teal (Famous Brands)
    'teal-600': 'rgba(13, 148, 136, 0.3)',
    'teal-500': 'rgba(20, 184, 166, 0.3)',
    'teal-400': 'rgba(45, 212, 191, 0.3)',
    
    // Indigo (TV Shows)
    'indigo-600': 'rgba(79, 70, 229, 0.3)',
    'indigo-500': 'rgba(99, 102, 241, 0.3)',
    'indigo-400': 'rgba(129, 140, 248, 0.3)'
  };
  
  // If the color isn't in the map, try to derive it from the base color
  if (!colorMap[color]) {
    const [colorName, shade] = color.split('-');
    // Try different shades if the exact one isn't available
    const alternativeShades = ['500', '600', '400'];
    for (const altShade of alternativeShades) {
      const alternative = `${colorName}-${altShade}`;
      if (colorMap[alternative]) {
        return colorMap[alternative];
      }
    }
  }
  
  return colorMap[color] || 'rgba(100, 100, 100, 0.2)';
};

export default function LoadingAnimation({ 
  finalCategory, 
  onComplete, 
  isChallengeFetched 
}: LoadingAnimationProps) {
  const { darkMode, getAdjustedColorClass, colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [currentColor, setCurrentColor] = useState<ThemeColors>(categoryColorMap[CategoryType.COUNTRIES]);
  
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

  // Update current color when index changes
  useEffect(() => {
    if (categories.length > 0 && currentIndex < categories.length) {
      const categoryName = categories[currentIndex];
      const categoryType = categoryNameToType[categoryName] || CategoryType.COUNTRIES;
      setCurrentColor(categoryColorMap[categoryType]);
    }
  }, [categories, currentIndex]);

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

  // Get the theme-adjusted primary color with adjustments for dark mode
  const getThemeAdjustedPrimaryColor = () => {
    const colorClass = darkMode ? 
      getAdjustedColorClass(currentColor.primary) : 
      currentColor.primary;
      
    // Ensure we have the RGB values for this color ready
    const rgb = getColorRGB(colorClass);
    
    // If we have RGB values, use them directly instead of relying on CSS variables
    return {
      colorClass,
      rgb,
      cssVar: `var(--color-${colorClass})`
    };
  };

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
    <div className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full h-full">
        {/* Top half - Logo */}
        <div className="flex-1 flex items-end justify-center pb-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="h-[180px] sm:h-[220px]"
          >
            <Logo height="100%" />
          </motion.div>
        </div>
        
        {/* Center line */}
        <div className="w-full relative my-1">
          {/* Line in the middle - appears when showing final category */}
          {mounted && isShowingFinalCategory && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100vw" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="h-1 mx-auto"
              style={{ 
                backgroundColor: `rgba(${getThemeAdjustedPrimaryColor().rgb}, 0.3)` 
              }}
            />
          )}
        </div>
        
        {/* Bottom half - Category slot animation */}
        <div className="flex-1 flex flex-col items-center justify-start pt-6">
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
                  className={`m-0 ${righteous.className} ${isShowingFinalCategory ? 'font-bold' : ''}`}
                  style={{
                    color: `rgb(${getThemeAdjustedPrimaryColor().rgb})`,
                    fontSize: calculateFontSize(currentCategory),
                    lineHeight: 1,
                    padding: "0 12px",
                    whiteSpace: "nowrap",
                    textShadow: isShowingFinalCategory 
                      ? `0 0 15px ${getShadowColor(getThemeAdjustedPrimaryColor().colorClass)}`
                      : (darkMode ? `0 0 8px rgba(${getThemeAdjustedPrimaryColor().rgb}, 0.5)` : 'none')
                  }}
                >
                  {currentCategory}
                </motion.h1>
              </AnimatePresence>
            ) : (
              <div className="h-[44px]"></div>
            )}
          </div>
          
          {/* Loading indicator */}
          {mounted && isAnimationComplete && !isChallengeFetched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-col items-center"
            >
              <div 
                className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3" 
                style={{ 
                  borderColor: `rgb(${getThemeAdjustedPrimaryColor().rgb})`, 
                  borderTopColor: 'transparent' 
                }}
              ></div>
              <p className="text-gray-600 dark:text-gray-300">Please wait, loading challenge...</p>
            </motion.div>
          )}
        </div>

        {/* Skip button - only shown when challenge is fetched */}
        {isChallengeFetched && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={onComplete}
            className={`absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-black dark:text-white ${righteous.className} text-xl sm:text-2xl md:text-3xl hover:opacity-70 transition-opacity px-2 py-1`}
          >
            SKIP &gt;&gt;
          </motion.button>
        )}
      </div>
    </div>
  );
} 