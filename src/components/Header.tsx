import React from 'react';
import { Righteous } from 'next/font/google';
import Logo from './Logo';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const Header: React.FC = () => {
  const { colors } = useTheme();
  const challenge = useGameStore(state => state.gameState.challenge);

  return (
    <div className="w-full py-3 sm:py-4">
      <header className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-[99px] sm:h-[132px] md:h-[165px] lg:h-[187px]">
            <Logo height="100%" className={`text-${colors.primary}`} />
          </div>
          
          {challenge?.category && (
            <h1 
              className={`text-${colors.primary} m-0 ${righteous.className}`}
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