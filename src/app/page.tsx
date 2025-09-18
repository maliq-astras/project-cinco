'use client';

import React, { useEffect } from 'react';
import MainContainer from '../components/layout/MainContainer';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { QueryClientProvider } from '../contexts/QueryClientProvider';
import { DOMRefsProvider } from '../providers/DOMRefsProvider';
import { initializeStore } from '../utils/storeInitializer';
import '../i18n/config'; // Import i18n configuration

export default function Home() {
  // Initialize store with persisted data on app load
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <main className="h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <QueryClientProvider>
        <LanguageProvider>
          <ThemeProvider>
            <DOMRefsProvider>
              <MainContainer />
            </DOMRefsProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </main>
  );
}