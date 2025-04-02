import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ThemeColors } from '../../../types';
import { 
  SAMPLE_CATEGORIES, 
  categoryNameToType, 
  shuffleArray, 
  getColorRGB 
} from '../../../utils/loadingAnimationUtils';
import { categoryColorMap } from '../../../types';

interface UseLoadingAnimationProps {
  finalCategory: string;
  onComplete: () => void;
  isChallengeFetched: boolean;
}

export const useLoadingAnimation = ({
  finalCategory,
  onComplete,
  isChallengeFetched
}: UseLoadingAnimationProps) => {
  const { darkMode, getAdjustedColorClass } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [currentColor, setCurrentColor] = useState<ThemeColors>(categoryColorMap[categoryNameToType.COUNTRIES]);
  
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
      const categoryType = categoryNameToType[categoryName] || categoryNameToType.COUNTRIES;
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

  // Watch for when challenge is fetched after animation completes
  useEffect(() => {
    if (!mounted) return;
    if (isAnimationComplete && isChallengeFetched) {
      // Add a delay here too to ensure we hold on the final category
      const timeoutId = setTimeout(onComplete, 2500);
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimationComplete, isChallengeFetched, onComplete, mounted]);

  // Get the theme-adjusted primary color with adjustments for dark mode
  const getThemeAdjustedPrimaryColor = () => {
    const colorClass = darkMode ? 
      getAdjustedColorClass(currentColor.primary) : 
      currentColor.primary;
      
    // Ensure we have the RGB values for this color ready
    const rgb = getColorRGB(colorClass);
    
    // Return all needed color information
    return {
      colorClass,
      rgb,
      cssVar: `var(--color-${colorClass})`
    };
  };

  // Get the current category to display
  const currentCategory = categories.length > 0 ? categories[currentIndex] : "";
  
  // Determine if we're showing the final category
  const isShowingFinalCategory = currentIndex === categories.length - 1;

  return {
    mounted,
    currentCategory,
    isShowingFinalCategory,
    isAnimationComplete,
    isChallengeFetched,
    getThemeAdjustedPrimaryColor,
    darkMode,
    onComplete
  };
}; 