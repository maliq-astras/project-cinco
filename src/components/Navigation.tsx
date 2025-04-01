import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Inter } from 'next/font/google';
import GameTutorial from './GameTutorial';
import SettingsPanel from './SettingsPanel';
import { useGameStore } from '../store/gameStore';

const inter = Inter({ subsets: ['latin'] });

export default function Navigation() {
  const { colors, darkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get relevant game states to determine when to show "How to Play"
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const hardMode = useGameStore(state => state.hardMode);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  
  // Only show How to Play during active gameplay (not during Final Five or game over)
  const shouldShowHowToPlay = !isGameOver && !isFinalFiveActive && !showFinalFiveTransition;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define all menu items, we'll filter based on game state later
  const allMenuItems = [
    { 
      label: 'How to Play?', 
      onClick: () => {
        setIsTutorialOpen(true);
        setIsDropdownOpen(false);
      },
      showArrow: false // This doesn't navigate away
    },
    { 
      label: 'F.A.Q.', 
      onClick: () => console.log('FAQ clicked'),
      showArrow: true  // This would navigate to another page
    },
    { 
      label: 'Report a Bug', 
      onClick: () => console.log('Report Bug clicked'),
      showArrow: true  // This would navigate to another page
    },
    { 
      label: 'Feedback', 
      onClick: () => console.log('Feedback clicked'),
      showArrow: true  // This would navigate to another page
    },
  ];
  
  // Filter menu items based on game state
  const menuItems = allMenuItems.filter(item => {
    // Only include How to Play if we should show it
    if (item.label === 'How to Play?') {
      return shouldShowHowToPlay;
    }
    // Include all other menu items always
    return true;
  });

  return (
    <>
      <div className="w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 sm:h-12 lg:h-14">
            {/* Hard Mode Badge */}
            <div className="flex items-center">
              {(hardMode || isHardModeEnabled) && (
                <div 
                  className="py-1 px-2.5 rounded-md text-xs sm:text-sm font-medium text-white"
                  style={{ backgroundColor: `var(--color-${colors.primary})` }}
                >
                  HARD MODE
                </div>
              )}
            </div>
            
            <nav className="flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button 
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isDropdownOpen ? 'bg-gray-100 dark:bg-gray-900' : ''}`} 
                  style={{ color: `var(--color-${colors.primary})` }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 sm:right-0 -left-24 sm:left-auto mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-black border-2 z-50"
                    style={{ borderColor: `var(--color-${colors.primary})` }}
                  >
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setIsDropdownOpen(false);
                        }}
                        className={`${inter.className} w-full text-left flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`}
                        style={{ color: `var(--color-${colors.primary})` }}
                      >
                        <span>{item.label}</span>
                        {item.showArrow && (
                          <svg 
                            className="w-3 h-3 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M7 17L17 7M17 7H8M17 7V16" 
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900" style={{ color: `var(--color-${colors.primary})` }}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button 
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900" 
                style={{ color: `var(--color-${colors.primary})` }}
                onClick={() => setIsSettingsOpen(true)}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Game Tutorial Modal */}
      <GameTutorial 
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* Settings Panel Modal */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
} 