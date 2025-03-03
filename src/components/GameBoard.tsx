'use client';

import React, { useState, useEffect } from 'react';
import { Challenge, UserGuess } from '../types';
import FactCard from './FactCard';
import FactBubble from './FactBubble';
import FactCardStack from './FactCardStack';
import GuessInput from './GuessInput';
import GuessProgressBar from './GuessProgressBar';
import FinalFiveOptions from './FinalFiveOptions';

interface GameState {
  loading: boolean;
  error: string | null;
  challenge: Challenge | null;
  revealedFacts: number[];
  guesses: UserGuess[];
  isGameOver: boolean;
  finalFiveOptions: string[] | null;
}

// Constants
const MAX_WRONG_GUESSES = 5;

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    loading: true,
    error: null,
    challenge: null,
    revealedFacts: [],
    guesses: [],
    isGameOver: false,
    finalFiveOptions: null
  });
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [hoveredFact, setHoveredFact] = useState<number | null>(null);
  const [viewingFact, setViewingFact] = useState<number | null>(null);

  // Fetch challenge on component mount
  useEffect(() => {
    fetchChallenge();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.loading || gameState.isGameOver) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalFive();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.loading, gameState.isGameOver]);

  const fetchChallenge = async () => {
    try {
      const response = await fetch('/api/daily-challenge');
      if (!response.ok) {
        throw new Error('Failed to fetch challenge');
      }
      const data = await response.json();
      setGameState(prev => ({
        ...prev,
        loading: false,
        challenge: data
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  const handleFactReveal = (factIndex: number) => {
    if (gameState.revealedFacts.includes(factIndex)) {
      setViewingFact(factIndex);
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      revealedFacts: [...prev.revealedFacts, factIndex]
    }));
    
    setViewingFact(factIndex);
  };

  const handleCloseFactCard = () => {
    setViewingFact(null);
  };

  const handleGuessSubmit = async (guess: string) => {
    if (!gameState.challenge) return;
    
    try {
      const response = await fetch('/api/verify-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: gameState.challenge.challengeId,
          guess
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify guess');
      }
      
      const data = await response.json();
      
      const newGuess: UserGuess = {
        guess,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      setGameState(prev => {
        const newState = {
          ...prev,
          guesses: [...prev.guesses, newGuess]
        };
        
        // Check if the guess is correct
        if (data.isCorrect) {
          newState.isGameOver = true;
        } 
        // Check if we've reached the maximum number of wrong guesses
        else {
          const wrongGuesses = [...prev.guesses, newGuess].filter(g => !g.isCorrect);
          if (wrongGuesses.length >= MAX_WRONG_GUESSES) {
            handleFinalFive();
          }
        }
        
        return newState;
      });
    } catch (error) {
      console.error('Error verifying guess:', error);
    }
  };

  const handleFinalFive = async () => {
    if (!gameState.challenge) return;
    
    try {
      const response = await fetch(`/api/final-five?id=${gameState.challenge.challengeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch final five options');
      }
      
      const data = await response.json();
      setGameState(prev => ({
        ...prev,
        finalFiveOptions: data.options
      }));
    } catch (error) {
      console.error('Error fetching final five options:', error);
    }
  };

  const handleFinalFiveSelect = async (option: string) => {
    if (!gameState.challenge) return;
    
    try {
      const response = await fetch('/api/verify-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: gameState.challenge.challengeId,
          guess: option
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify guess');
      }
      
      const data = await response.json();
      
      const newGuess: UserGuess = {
        guess: option,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      setGameState(prev => ({
        ...prev,
        guesses: [...prev.guesses, newGuess],
        isGameOver: true,
        finalFiveOptions: null
      }));
    } catch (error) {
      console.error('Error verifying final guess:', error);
    }
  };

  if (gameState.loading) {
    return <div className="text-center py-12">Loading challenge...</div>;
  }

  if (gameState.error) {
    return <div className="text-center py-12 text-red-500">Error: {gameState.error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-blue-600">FACT 5</h1>
        <div className="flex gap-4">
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors" aria-label="Calendar">📅</button>
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors" aria-label="Help">❓</button>
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors" aria-label="Settings">⚙️</button>
        </div>
      </header>

      {/* Category Display */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 bg-blue-50 py-3 px-6 rounded-lg inline-flex">
          <h2 className="text-xl font-semibold text-blue-800">TODAY'S CATEGORY: {gameState.challenge?.category.toUpperCase()}</h2>
          <button className="text-blue-600 hover:text-blue-800" aria-label="Information">ⓘ</button>
        </div>
      </div>

      {/* Facts Display Area */}
      <div className="min-h-[200px] border border-gray-200 rounded-lg p-6 mb-8 bg-white shadow-sm">
        {gameState.challenge && (
          <FactCardStack 
            revealedFacts={gameState.revealedFacts} 
            facts={gameState.challenge.facts}
            onCardClick={setViewingFact}
          />
        )}
      </div>

      {/* Instructions */}
      <p className="text-center mb-6 text-gray-700 font-medium">
        {gameState.isGameOver 
          ? 'Game Over!'
          : gameState.finalFiveOptions 
            ? 'Final Five! Choose the correct answer:'
            : 'Select a fact bubble below to reveal clues about today\'s mystery item!'}
      </p>

      {/* Context Area */}
      <div className="min-h-[100px] border border-gray-200 rounded-lg p-4 mb-8 bg-white shadow-sm text-center">
        {hoveredFact !== null && !gameState.revealedFacts.includes(hoveredFact)
          ? <span className="text-blue-600 font-medium">{`Reveal ${gameState.challenge?.facts[hoveredFact].factType} fact?`}</span>
          : <span className="text-gray-500">Hover over a fact bubble to see its type</span>}
      </div>

      {/* Final Five Options or Fact Bubbles */}
      {gameState.finalFiveOptions ? (
        <FinalFiveOptions 
          options={gameState.finalFiveOptions} 
          onSelect={handleFinalFiveSelect} 
        />
      ) : (
        <div className="grid grid-cols-4 gap-8 mb-8 justify-items-center">
          {gameState.challenge?.facts.map((fact, index) => (
            <div key={index} className="text-center">
              <FactBubble 
                factType={fact.factType}
                isRevealed={gameState.revealedFacts.includes(index)}
                onClick={() => handleFactReveal(index)}
                onMouseEnter={() => setHoveredFact(index)}
                onMouseLeave={() => setHoveredFact(null)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Guess Input and Progress Bar */}
      {!gameState.isGameOver && !gameState.finalFiveOptions && (
        <>
          <GuessProgressBar 
            guesses={gameState.guesses} 
            maxGuesses={MAX_WRONG_GUESSES} 
          />
          <GuessInput 
            timeRemaining={timeRemaining} 
            onSubmit={handleGuessSubmit}
            previousGuesses={gameState.guesses}
          />
        </>
      )}

      {/* Fact Card Modal */}
      {viewingFact !== null && gameState.challenge && (
        <FactCard 
          fact={gameState.challenge.facts[viewingFact]} 
          onClose={handleCloseFactCard} 
        />
      )}
    </div>
  );
} 