import { CSSProperties } from 'react';
import { COLOR_MAPPING } from '../types';
import { LOADING_PLACEHOLDER } from '../hooks/components/loadingAnimation/useLoadingAnimation';

// Constants for placeholder text colors
const PLACEHOLDER_TEXT_COLORS = {
  dark: 'rgb(156, 163, 175)', // gray-400
  light: 'rgb(107, 114, 128)' // gray-500
};

export const loadingAnimationStyles = {
  container: "fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center",
  innerContainer: "flex flex-col items-center w-full h-full",
  
  // Logo area
  logoContainer: "flex-1 flex items-end justify-center pb-6",
  logoWrapper: "h-[180px] sm:h-[220px]",
  
  // Center line
  centerLine: "w-full relative my-1",
  animatedLine: (rgbColor: string): CSSProperties => ({
    height: "1px",
    backgroundColor: `rgba(${rgbColor}, 0.3)`
  }),
  
  // Category area
  categoryContainer: "flex-1 flex flex-col items-center justify-start pt-6",
  categoryWrapper: "relative overflow-hidden h-[80px] flex items-center justify-center px-8 w-full max-w-[400px]",
  categoryPlaceholder: "h-[44px]",
  
  // Category text styling
  getCategoryStyle: (
    isShowingFinalCategory: boolean,
    rgbColor: string,
    colorClass: string,
    darkMode: boolean,
    categoryText: string
  ): CSSProperties => {
    // Check if we're showing the placeholder
    if (categoryText.toUpperCase() === LOADING_PLACEHOLDER) {
      return {
        color: darkMode ? PLACEHOLDER_TEXT_COLORS.dark : PLACEHOLDER_TEXT_COLORS.light,
        fontSize: calculateFontSize(categoryText),
        lineHeight: 1,
        padding: "0 12px",
        whiteSpace: "nowrap"
      };
    }

    // Check if high contrast mode is active
    const isHighContrast = typeof document !== 'undefined' && 
      document.documentElement.classList.contains('high-contrast');
    
    // Get color for high contrast mode
    let textColor = `rgb(${rgbColor})`;
    if (isHighContrast && typeof window !== 'undefined') {
      const matches = colorClass.match(/([a-z]+)-(\d+)/);
      if (matches && matches[1] && matches[2]) {
        const colorFamily = matches[1];
        const colorShade = matches[2];
        
        // Map using the unified color mapping system
        const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
        
        // Get appropriate shade based on dark mode
        const hcShade = darkMode ? '300' : '900';
        
        // Get the color from CSS variable
        const varName = `--hc-${highContrastFamily}-${hcShade}`;
        const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        
        if (computed) {
          textColor = `rgb(${computed})`;
        }
      }
    }
    
    // Get a different shadow color for high contrast mode
    const shadowColor = isHighContrast
      ? getShadowColor(colorClass) // Uses our updated function that handles high contrast
      : (darkMode ? `0 0 8px rgba(${rgbColor}, 0.5)` : 'none');
    
    return {
      color: textColor,
      fontSize: calculateFontSize(categoryText),
      lineHeight: 1,
      padding: "0 12px",
      whiteSpace: "nowrap",
      textShadow: isShowingFinalCategory 
        ? `0 0 15px ${getShadowColor(colorClass)}`
        : (typeof shadowColor === 'string' ? shadowColor : 'none')
    };
  },
  
  // Loading indicator
  loadingIndicatorContainer: "mt-8 flex flex-col items-center",
  loadingSpinner: (rgbColor: string): CSSProperties => ({
    width: "2.5rem",
    height: "2.5rem",
    borderWidth: "4px",
    borderRadius: "9999px",
    borderColor: `rgb(${rgbColor})`,
    borderTopColor: 'transparent',
    marginBottom: "0.75rem"
  }),
  loadingText: "text-gray-600 dark:text-gray-300",
  
  // Skip button
  skipButton: "absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-black dark:text-white text-xl sm:text-2xl md:text-3xl hover:opacity-70 transition-opacity px-2 py-1",
  
  // Animations
  logoAnimation: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
  
  categoryAnimation: {
    initial: { y: 80, opacity: 0 },
    animate: (isShowingFinalCategory: boolean) => ({ 
      y: 0, 
      opacity: 1,
      scale: isShowingFinalCategory ? 1.08 : 1 
    }),
    exit: { y: -80, opacity: 0 },
    transition: (isShowingFinalCategory: boolean) => ({ 
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
    })
  },
  
  lineAnimation: {
    initial: { width: 0 },
    animate: { width: "100vw" },
    transition: { 
      duration: 1.2, 
      ease: "easeOut", 
      delay: 0.2 
    }
  },
  
  loadingAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.5, 
      delay: 0.5 
    }
  },
  
  skipButtonAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.5, 
      delay: 0.8 
    }
  }
} as const;

// Helper function to calculate appropriate font size based on text length
export const calculateFontSize = (text: string) => {
  if (!text) return "clamp(28px, 5vw, 44px)";
  
  if (text.length > 15) {
    return "clamp(22px, 4vw, 34px)"; // Smaller font for very long text
  } else if (text.length > 10) {
    return "clamp(24px, 4.5vw, 38px)"; // Medium font for moderately long text
  } else {
    return "clamp(28px, 5vw, 44px)"; // Default font size for short text
  }
};

// Helper function to get shadow color for a category with high contrast support
export const getShadowColor = (color: string): string => {
  // Check if high contrast mode is active
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('high-contrast')) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const matches = color.match(/([a-z]+)-(\d+)/);
    
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const colorShade = matches[2];
      
      // Map using the unified color mapping system
      const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
      
      // Determine which shade to use based on dark mode
      const hcShade = isDarkMode ? '300' : '900';
      
      // Get the RGB value from CSS variable
      const varName = `--hc-${highContrastFamily}-${hcShade}`;
      const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      
      if (computed) {
        return `rgba(${computed}, 0.3)`;
      }
    }
  }
  
  // Regular color map as fallback
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