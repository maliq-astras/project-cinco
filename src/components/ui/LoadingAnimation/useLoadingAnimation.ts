import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeColors, COLOR_MAPPING } from '@/types';
import { 
  SAMPLE_CATEGORIES, 
  categoryNameToType, 
  shuffleArray, 
  getColorRGB 
} from '@/utils/loadingAnimationUtils';
import { categoryColorMap } from '@/types';

// Constants
export const LOADING_PLACEHOLDER = "PLEASE WAIT...";
const PLACEHOLDER_COLORS: ThemeColors = {
  primary: 'gray-500',
  secondary: 'gray-400',
  accent: 'gray-600',
  light: 'gray-100',
  dark: 'gray-900'
};

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
  const { darkMode, getAdjustedColorClass, highContrastMode } = useTheme();
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
      setCurrentColor(
        categoryName === LOADING_PLACEHOLDER 
          ? PLACEHOLDER_COLORS 
          : categoryColorMap[categoryNameToType[categoryName] || categoryNameToType.COUNTRIES]
      );
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
    const { highContrastMode, getAdjustedColorClass, darkMode } = useTheme();
    
    // First get the base color class
    const colorClass = darkMode ? 
      getAdjustedColorClass(currentColor.primary) : 
      currentColor.primary;
    
    // Get the category type from the current category
    const categoryName = categories[currentIndex] || "COUNTRIES";
    const categoryType = categoryNameToType[categoryName] || categoryNameToType.COUNTRIES;
    
    // Get RGB values from ThemeContext's helper
    let rgb;
    
    // Access directly from document.documentElement for current real-time values
    if (highContrastMode && typeof window !== 'undefined') {
      // Extract the color family and shade
      const matches = colorClass.match(/([a-z]+)-(\d+)/);
      if (matches && matches[1] && matches[2]) {
        const colorFamily = matches[1];
        const colorShade = matches[2];
        
        // Map using the unified color mapping system
        const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
          
        // Determine which shade to use based on dark mode
        const hcShade = darkMode ? 
          (parseInt(colorShade) >= 600 ? '300' : 
           parseInt(colorShade) >= 500 ? '300' :
           parseInt(colorShade) >= 400 ? '400' : '300') : 
          (parseInt(colorShade) >= 700 ? '950' : 
           parseInt(colorShade) >= 600 ? '900' :
           parseInt(colorShade) >= 500 ? '800' : '900');
           
        // Get the RGB value from CSS variable
        const varName = `--hc-${highContrastFamily}-${hcShade}`;
        const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        
        if (computed) {
          rgb = computed;
        } else {
          // Fallback to theme context color conversion
          rgb = getColorFromDocument(colorClass);
        }
      } else {
        rgb = getColorFromDocument(colorClass);
      }
    } else {
      rgb = getColorFromDocument(colorClass);
    }
    
    // Return all needed color information
    return {
      colorClass,
      rgb,
      cssVar: `var(--color-${colorClass})`
    };
  };
  
  // Helper to get color from document styles
  const getColorFromDocument = (colorClass: string): string => {
    if (typeof window !== 'undefined') {
      // Try to get the color from CSS variables first
      const varName = `--color-${colorClass}-rgb`;
      const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (computed) return computed;
      
      // Fallback to getting the computed color directly
      const element = document.createElement('div');
      element.className = `text-${colorClass}`;
      document.body.appendChild(element);
      const color = getComputedStyle(element).color;
      document.body.removeChild(element);
      
      // Parse RGB values from computed color
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
      }
    }
    
    // Fallback for SSR or if all else fails
    return "59, 130, 246"; // Default blue-500
  };

  // Get the current category to display
  const currentCategory = categories.length > 0 ? categories[currentIndex] : "";
  
  // Determine if we're showing the final category
  const isShowingFinalCategory = currentIndex === categories.length - 1 && currentCategory !== "Please wait...";

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