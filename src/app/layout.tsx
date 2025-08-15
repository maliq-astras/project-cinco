import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Bangers, Quicksand, Iceberg, Righteous } from 'next/font/google'
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

// Fun, playful font for the game title
const bangers = Bangers({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-game'
})

// Clean, friendly font for display text
const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-display'
})

// Iceberg font for the timer
const iceberg = Iceberg({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-iceberg'
})

// Righteous font for logo and category display
const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous'
})

export const metadata: Metadata = {
  title: "Fact 5 - Daily Trivia Challenge",
  description: "Test your knowledge with daily trivia challenges",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var darkMode = localStorage.getItem('darkMode');
                var highContrastMode = localStorage.getItem('highContrastMode');
                
                if (darkMode === 'true') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.backgroundColor = '#000';
                  document.documentElement.style.color = '#fff';
                }
                
                if (highContrastMode === 'true') {
                  document.documentElement.classList.add('high-contrast');
                }
              } catch (e) {
                // Handle potential localStorage errors
              }
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${bangers.variable} ${quicksand.variable} ${iceberg.variable} ${righteous.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
