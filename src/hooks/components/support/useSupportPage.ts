'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { CategoryType } from '@/types';

interface SectionConfig {
  id: string;
  label: string;
  shortLabel: string;
  prev: string;
  next: string;
}

export const useSupportPage = (initialSection: string) => {
  // Sections configuration with cyclical navigation links
  const sections: Record<string, SectionConfig> = {
    faq: { 
      id: 'faq', 
      label: 'Frequently Asked Questions', 
      shortLabel: 'F.A.Q.',
      prev: 'feedback', 
      next: 'bug' 
    },
    bug: { 
      id: 'bug', 
      label: 'Report a Bug', 
      shortLabel: 'Report Bug',
      prev: 'faq', 
      next: 'feedback' 
    },
    feedback: { 
      id: 'feedback', 
      label: 'Give Feedback', 
      shortLabel: 'Feedback',
      prev: 'bug', 
      next: 'faq' 
    }
  };
  
  const [activeSection, setActiveSection] = useState<string>(
    sections[initialSection] ? initialSection : 'faq'
  );
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const { colors } = useTheme();
  const [isBrowser, setIsBrowser] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>(CategoryType.COUNTRIES);
  
  // Get the current challenge from the game store
  const gameState = useGameStore(state => state.gameState);
  
  // Get category from game state or localStorage
  useEffect(() => {
    // First try to get category from game state
    if (gameState.challenge?.category) {
      setCurrentCategory(gameState.challenge.category);
      return;
    }
    
    // If not available, try to get from localStorage
    if (typeof window !== 'undefined') {
      const savedCategory = localStorage.getItem('lastActiveCategory');
      if (savedCategory) {
        try {
          const parsedCategory = JSON.parse(savedCategory) as CategoryType;
          setCurrentCategory(parsedCategory);
        } catch (e) {
          // If parsing fails, fallback to default
          console.warn('Failed to parse saved category');
        }
      }
    }
  }, [gameState.challenge?.category]);
  
  // Navigate to another section with animation direction
  const navigateToSection = (sectionId: string) => {
    if (!sections[sectionId]) return;
    
    // Determine animation direction based on cyclical order
    let direction: 'forward' | 'backward' = 'forward';
    
    // Special case for cycling from feedback to faq
    if (activeSection === 'feedback' && sectionId === 'faq') {
      direction = 'forward';
    }
    // Special case for cycling from faq to feedback
    else if (activeSection === 'faq' && sectionId === 'feedback') {
      direction = 'backward';
    }
    // Otherwise, determine by index
    else {
      const currentIndex = Object.keys(sections).indexOf(activeSection);
      const targetIndex = Object.keys(sections).indexOf(sectionId);
      direction = targetIndex > currentIndex ? 'forward' : 'backward';
    }
    
    setAnimationDirection(direction);
    setActiveSection(sectionId);
    
    // Update URL hash
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };
  
  // Create spinner style with CSS variables to ensure it works in dark mode
  const spinnerStyle = useMemo(() => {
    const colorName = colors?.primary?.split('-')[0] || 'emerald';
    
    return {
      "--spinner-color": `var(--color-${colorName}-500)`,
      borderColor: "var(--spinner-color) transparent transparent transparent"
    };
  }, [colors]);
  
  // Initialize browser state
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Handle initial section from URL hash
  useEffect(() => {
    if (!isBrowser) return;
    
    // Get hash from URL or use initialSection
    const hash = window.location.hash.slice(1);
    
    if (hash && sections[hash]) {
      setActiveSection(hash);
    } else if (initialSection && sections[initialSection]) {
      setActiveSection(initialSection);
      // Update URL hash to match initial section
      window.history.replaceState(null, '', `#${initialSection}`);
    }
  }, [isBrowser, initialSection]);
  
  // Check if theme variables are properly set
  useEffect(() => {
    if (!isBrowser) return;
    
    // Wait for theme colors to be properly applied
    const checkTheme = () => {
      if (colors && colors.primary) {
        // Add a small delay to ensure CSS variables are fully applied
        setTimeout(() => {
          setIsThemeReady(true);
        }, 100);
      }
    };
    
    checkTheme();
    
    // Also check if CSS variables exist in the document
    const checkCssVars = () => {
      if (typeof document !== 'undefined') {
        const primaryVar = getComputedStyle(document.documentElement)
          .getPropertyValue(`--color-${colors?.primary}`);
        
        if (primaryVar) {
          setIsThemeReady(true);
        }
      }
    };
    
    const themeTimer = setTimeout(checkCssVars, 50);
    
    // If theme isn't ready after 500ms, show it anyway
    const fallbackTimer = setTimeout(() => {
      setIsThemeReady(true);
    }, 500);
    
    return () => {
      clearTimeout(themeTimer);
      clearTimeout(fallbackTimer);
    };
  }, [isBrowser, colors]);
  
  return {
    activeSection,
    setActiveSection,
    navigateToSection,
    animationDirection,
    sections,
    colors,
    isThemeReady,
    spinnerStyle,
    currentCategory
  };
}; 