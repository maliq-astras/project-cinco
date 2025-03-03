import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Swanky_and_Moo_Moo } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })
const swankyAndMooMoo = Swanky_and_Moo_Moo({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-swanky'
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${swankyAndMooMoo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
