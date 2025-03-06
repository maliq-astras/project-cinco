import React from 'react';
import { Righteous } from 'next/font/google';
import Logo from './Logo';
import { useGameStore } from '../store/gameStore';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const Header: React.FC = () => {
  const challenge = useGameStore(state => state.gameState.challenge);
  
  return (
    <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
      <header className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-[90px] sm:h-[120px] md:h-[150px] lg:h-[170px]">
            <Logo height="100%" className="text-blue-600" />
          </div>
          
          {challenge?.category && (
            <h1 
              className={`text-blue-600 m-0 ${righteous.className}`}
              style={{ 
                fontSize: "clamp(28px, 5vw, 46px)",
                lineHeight: 1
              }}
            >
              {challenge.category.toUpperCase()}
            </h1>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header; 