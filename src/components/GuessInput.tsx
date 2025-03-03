'use client';

import React, { useState, useEffect } from 'react';
import { UserGuess } from '../types';

interface GuessInputProps {
  timeRemaining: number;
  onSubmit: (guess: string) => void;
  previousGuesses: UserGuess[];
}

export default function GuessInput({ timeRemaining, onSubmit, previousGuesses }: GuessInputProps) {
  const [currentGuess, setCurrentGuess] = useState('');
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  
  // Hide the duplicate error message after 3 seconds
  useEffect(() => {
    if (showDuplicateError) {
      const timer = setTimeout(() => {
        setShowDuplicateError(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showDuplicateError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentGuess.trim()) return;
    
    // Check if this guess has been made before
    const isDuplicate = previousGuesses.some(
      guess => guess.guess.toLowerCase() === currentGuess.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      setShowDuplicateError(true);
      return;
    }
    
    onSubmit(currentGuess);
    setCurrentGuess('');
  };

  return (
    <div className="relative mb-6">
      <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter your guess..."
            className="w-full p-3 border border-gray-200 rounded-lg 
              bg-white text-gray-900
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
          />
          
          {showDuplicateError && (
            <div className="absolute -top-10 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 rounded-md text-sm border border-yellow-200 shadow-md">
              You've already tried that guess. Try something else!
            </div>
          )}
        </div>
        
        <div className="text-xl font-mono bg-gray-100 py-2 px-4 rounded-lg text-gray-700">
          {Math.floor(timeRemaining / 60)}:
          {(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      </form>
    </div>
  );
} 