import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Bangers, Quicksand, Iceberg } from 'next/font/google'

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

export const metadata: Metadata = {
  title: "Fact 5 - Daily Trivia Challenge",
  description: "Test your knowledge with daily trivia challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${bangers.variable} ${quicksand.variable} ${iceberg.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
