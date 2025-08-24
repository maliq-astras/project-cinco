import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeColors, COLOR_MAPPING } from '@/types';
import { 
  SAMPLE_CATEGORIES, 
  categoryNameToType, 
  shuffleArray
} from '@/utils/loadingAnimationUtils';
import { categoryColorMap } from '@/types';
import { useThemeDOM } from '@/hooks/theme';

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
  const { darkMode, highContrastMode, getAdjustedColorClass } = useTheme();
  const { isBrowser, getCSSProperty } = useThemeDOM();
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
    // First get the base color class
    const colorClass = darkMode ? 
      getAdjustedColorClass(currentColor.primary) : 
      currentColor.primary;
    
    // Get RGB values from ThemeContext's helper
    let rgb;
    
    // Access directly from document.documentElement for current real-time values
    if (highContrastMode && isBrowser) {
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
        const computed = getCSSProperty(varName);
        
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
    if (isBrowser) {
      // Try to get the color from CSS variables first
      const varName = `--color-${colorClass}-rgb`;
      const computed = getCSSProperty(varName);
      if (computed) return computed;
      
      // Fallback to color map instead of creating temporary elements
      const colorMap: Record<string, string> = {
        // Blues (Countries)
        'blue-600': '37, 99, 235',
        'blue-500': '59, 130, 246',
        'blue-700': '29, 78, 216',
        'blue-400': '96, 165, 250',
        
        // Emerald (Animals)
        'emerald-600': '5, 150, 105',
        'emerald-500': '16, 185, 129',
        'emerald-700': '4, 120, 87',
        'emerald-400': '52, 211, 153',
        
        // Violet (Movies)
        'violet-600': '124, 58, 237',
        'violet-500': '139, 92, 246',
        'violet-700': '109, 40, 217',
        'violet-400': '167, 139, 250',
        
        // Orange (Books)
        'orange-600': '234, 88, 12',
        'orange-500': '249, 115, 22',
        'orange-700': '194, 65, 12',
        'orange-400': '251, 146, 60',
        
        // Fuchsia (Musical Artists)
        'fuchsia-600': '192, 38, 211',
        'fuchsia-500': '217, 70, 239',
        'fuchsia-700': '162, 28, 175',
        'fuchsia-400': '232, 121, 249',
        
        // Red (Athletes)
        'red-600': '220, 38, 38',
        'red-500': '239, 68, 68',
        'red-700': '185, 28, 28',
        'red-400': '248, 113, 113',
        
        // Amber (Historical Figures)
        'amber-500': '245, 158, 11',
        'amber-400': '251, 191, 36',
        'amber-600': '217, 119, 6',
        'amber-300': '252, 211, 77',
        
        // Teal (Famous Brands)
        'teal-500': '20, 184, 166',
        'teal-400': '45, 212, 191',
        'teal-600': '13, 148, 136',
        'teal-300': '94, 234, 212',
        
        // Indigo (TV Shows)
        'indigo-500': '99, 102, 241',
        'indigo-400': '129, 140, 248',
        'indigo-600': '79, 70, 229',
        'indigo-300': '165, 180, 252',
        
        // Grays (Placeholder)
        'gray-500': '107, 114, 128',
        'gray-400': '156, 163, 175',
        'gray-600': '75, 85, 99',
        'gray-100': '243, 244, 246',
        'gray-900': '17, 24, 39'
      };
      
      return colorMap[colorClass] || "59, 130, 246"; // Default blue-500
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