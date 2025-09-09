'use client';

import React from 'react';
import { useScreenSizeWarning } from './hooks';

interface ScreenSizeWarningProps {
  isMobile: boolean;
}

/**
 * Warning component shown when screen is too small to use the app
 * Different from landscape warning - this is for genuinely tiny screens
 */
const ScreenSizeWarning: React.FC<ScreenSizeWarningProps> = ({ isMobile }) => {
  const { Icon, message, requirements } = useScreenSizeWarning({ isMobile });

  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center p-6 z-50">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Screen Too Small
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Minimum requirements */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p className="font-medium mb-2">Minimum requirements:</p>
          <p>{requirements}</p>
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;