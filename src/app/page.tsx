'use client';

import React from 'react';
import MainContainer from '../components/MainContainer';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import '../i18n/config'; // Import i18n configuration

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <LanguageProvider>
        <ThemeProvider>
          <MainContainer />
        </ThemeProvider>
      </LanguageProvider>
    </main>
  );
}