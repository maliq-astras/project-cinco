import React from 'react';
import { Question } from "phosphor-react";
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <div className="w-full px-4 relative" style={{ height: '110px' }}>
      <header className="relative max-w-5xl mx-auto h-full flex items-center justify-center">
        {/* Large logo using the SVG file from public/icons */}
        <Logo width={800} height={100} className="text-blue-600" />
        
        {/* Icons container with absolute positioning */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button 
            className="p-2 rounded-full transition-colors hover:bg-gray-100" 
            aria-label="Help"
          >
            <Question size={24} weight="bold" />
          </button>
          {/* Space for additional icons (2-3 max) */}
        </div>
      </header>
    </div>
  );
};

export default Header; 