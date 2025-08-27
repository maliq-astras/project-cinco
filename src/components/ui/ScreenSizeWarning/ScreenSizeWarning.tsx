'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface ScreenSizeWarningProps {
  isMobile: boolean;
}

/**
 * Warning component shown when screen is too small to use the app
 * Different from landscape warning - this is for genuinely tiny screens
 */
const ScreenSizeWarning: React.FC<ScreenSizeWarningProps> = ({ isMobile }) => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing conditional icon after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center p-6 z-50">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {!mounted ? (
            // Use Monitor icon during SSR to prevent hydration mismatch
            <Monitor className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          ) : isMobile ? (
            <Smartphone className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          ) : (
            <Monitor className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Screen Too Small
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {isMobile 
            ? "Please increase your screen size or rotate your device to play the game."
            : "Please increase your browser window height to continue."
          }
        </p>

        {/* Minimum requirements */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p className="font-medium mb-2">Minimum requirements:</p>
          {isMobile ? (
            <p>665px height × 320px width</p>
          ) : (
            <p>600px height</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;