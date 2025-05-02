// Client component wrapper to use hooks
'use client';

import React, { useEffect, useState } from 'react';
import { SupportPage } from '../../components/support';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { CategoryType } from '../../types';

export default function Support() {
  // Don't use useSupportPage here as it creates a circular dependency
  const [initialSection, setInitialSection] = useState('faq');
  const [category, setCategory] = useState<CategoryType | undefined>(undefined);
  
  // Read hash and local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Extract section from hash (e.g., #bug -> bug)
      const hash = window.location.hash.slice(1);
      
      // Only update if hash is one of the valid sections
      if (hash && ['faq', 'bug', 'feedback'].includes(hash)) {
        setInitialSection(hash);
      }
      
      // Try to get category from localStorage
      try {
        const savedCategory = localStorage.getItem('lastActiveCategory');
        if (savedCategory) {
          setCategory(JSON.parse(savedCategory) as CategoryType);
        }
      } catch (e) {
        console.warn('Failed to parse saved category');
      }
    }
  }, []);
  
  return (
    <ThemeProvider initialCategory={category}>
      <SupportPage initialSection={initialSection} />
    </ThemeProvider>
  );
} 