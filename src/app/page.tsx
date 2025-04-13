'use client';

import React from 'react';
import MainContainer from '../components/MainContainer';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { QueryClientProvider } from '../contexts/QueryClientProvider';
import '../i18n/config'; // Import i18n configuration

export default function Home() {
  return (
    <main className="h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <QueryClientProvider>
        <LanguageProvider>
          <ThemeProvider>
            <MainContainer />
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </main>
  );
}