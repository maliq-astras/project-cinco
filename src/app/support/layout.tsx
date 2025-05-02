'use client';

import React, { useEffect } from "react";

export default function SupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Add default CSS variables for the theme to prevent flash
    document.documentElement.style.setProperty('--color-green-500', '#10B981');
    document.documentElement.style.setProperty('--color-green-50', 'rgba(16, 185, 129, 0.1)');
    document.documentElement.style.setProperty('--color-green-200', 'rgba(16, 185, 129, 0.4)');
    
    document.documentElement.style.setProperty('--color-blue-500', '#3B82F6');
    document.documentElement.style.setProperty('--color-blue-50', 'rgba(59, 130, 246, 0.1)');
    document.documentElement.style.setProperty('--color-blue-200', 'rgba(59, 130, 246, 0.4)');
    
    document.documentElement.style.setProperty('--color-red-500', '#EF4444');
    document.documentElement.style.setProperty('--color-red-50', 'rgba(239, 68, 68, 0.1)');
    document.documentElement.style.setProperty('--color-red-200', 'rgba(239, 68, 68, 0.4)');
    
    document.documentElement.style.setProperty('--color-purple-500', '#8B5CF6');
    document.documentElement.style.setProperty('--color-purple-50', 'rgba(139, 92, 246, 0.1)');
    document.documentElement.style.setProperty('--color-purple-200', 'rgba(139, 92, 246, 0.4)');
    
    document.documentElement.style.setProperty('--color-pink-500', '#EC4899');
    document.documentElement.style.setProperty('--color-pink-50', 'rgba(236, 72, 153, 0.1)');
    document.documentElement.style.setProperty('--color-pink-200', 'rgba(236, 72, 153, 0.4)');
    
    document.documentElement.style.setProperty('--color-yellow-500', '#F59E0B');
    document.documentElement.style.setProperty('--color-yellow-50', 'rgba(245, 158, 11, 0.1)');
    document.documentElement.style.setProperty('--color-yellow-200', 'rgba(245, 158, 11, 0.4)');
    
    document.documentElement.style.setProperty('--color-gray-50', '#F9FAFB');
    document.documentElement.style.setProperty('--color-gray-100', '#F3F4F6');
    document.documentElement.style.setProperty('--color-gray-200', '#E5E7EB');
    document.documentElement.style.setProperty('--color-gray-300', '#D1D5DB');
    document.documentElement.style.setProperty('--color-gray-400', '#9CA3AF');
    document.documentElement.style.setProperty('--color-gray-500', '#6B7280');
    document.documentElement.style.setProperty('--color-gray-600', '#4B5563');
    document.documentElement.style.setProperty('--color-gray-700', '#374151');
    document.documentElement.style.setProperty('--color-gray-800', '#1F2937');
    document.documentElement.style.setProperty('--color-gray-900', '#111827');
  }, []);
  
  return (
    <div className="min-h-screen h-screen">
      {children}
    </div>
  );
} 