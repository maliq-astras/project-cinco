import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Quicksand, Iceberg, Righteous } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/*
          Theme initialization script - runs before React hydration to prevent FOUC
          This is necessary boilerplate code for Next.js theme management
          The suppressHydrationWarning is required because this script modifies the DOM
        */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Initialize theme from localStorage before hydration
                var darkMode = localStorage.getItem('darkMode');
                var highContrastMode = localStorage.getItem('highContrastMode');

                // Apply dark mode if enabled
                if (darkMode === 'true') {
                  document.documentElement.classList.add('dark');
                  // Set initial background and text colors to prevent FOUC
                  document.documentElement.style.setProperty('background-color', '#000', 'important');
                  document.documentElement.style.setProperty('color', '#fff', 'important');
                }

                // Apply high contrast mode if enabled
                if (highContrastMode === 'true') {
                  document.documentElement.classList.add('high-contrast');
                }
              } catch (e) {
                // Handle potential localStorage errors silently
                console.warn('Theme initialization failed:', e);
              }
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${quicksand.variable} ${iceberg.variable} ${righteous.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
