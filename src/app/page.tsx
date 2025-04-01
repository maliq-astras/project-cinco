'use client';

import React from 'react';
import MainContainer from '../components/MainContainer';
import { ThemeProvider } from '../context/ThemeContext';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <ThemeProvider>
        <MainContainer />
      </ThemeProvider>
    </main>
  );
}