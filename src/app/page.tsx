'use client';

import React from 'react';
import MainContainer from '../components/MainContainer';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { QueryClientProvider } from '../context/QueryClientProvider';
import '../i18n/config'; // Import i18n configuration

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
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