import { useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

export const useHeader = () => {
  const { colors } = useTheme();
  const challenge = useGameStore(state => state.gameState.challenge);
  const logoRef = useRef<HTMLDivElement>(null);
  const categoryTitleRef = useRef<HTMLHeadingElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();
  
  // Use our new unified responsive system
  const { 
    breakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  } = useResponsive();

  // Register the header area element with the DOM refs system
  useEffect(() => {
    if (logoRef.current) {
      registerElement('header-area', logoRef.current);
    }
    
    return () => {
      unregisterElement('header-area');
    };
  }, [registerElement, unregisterElement]);

  // Register the category title element with the DOM refs system
  useEffect(() => {
    if (categoryTitleRef.current) {
      registerElement('category-title', categoryTitleRef.current);
    }
    
    return () => {
      unregisterElement('category-title');
    };
  }, [registerElement, unregisterElement]);

  return {
    colors,
    challenge,
    logoRef,
    categoryTitleRef,
    // Responsive values from our new system
    breakpoint,
    isLandscape,
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  };
}; 