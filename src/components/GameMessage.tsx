import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

// Game outcome type to handle all possible scenarios
export type GameOutcome = 'standard-win' | 'final-five-win' | 'loss';

interface GameMessageProps {
  outcome: GameOutcome;
  correctAnswer: string;
  numberOfTries?: number;
  timeSpent: number; // in seconds
}

const GameMessage: React.FC<GameMessageProps> = ({ 
  outcome, 
  correctAnswer, 
  numberOfTries = 0,
  timeSpent
}) => {
  const { colors } = useTheme();
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const finalFiveTimeRemaining = useGameStore(state => state.finalFiveTimeRemaining);
  const gameState = useGameStore(state => state.gameState);
  const [showTomorrowMessage, setShowTomorrowMessage] = useState(false);
  
  // Get the most recent guess to determine if user ran out of time or picked wrong
  const latestGuess = gameState.guesses.length > 0 
    ? gameState.guesses[gameState.guesses.length - 1] 
    : null;
  const pickedWrongAnswer = latestGuess && !latestGuess.isCorrect && latestGuess.isFinalFiveGuess;
  
  // Find correct answer from guesses if possible
  const [actualCorrectAnswer, setActualCorrectAnswer] = useState(correctAnswer);
  
  useEffect(() => {
    if (outcome === 'loss' && (!correctAnswer || correctAnswer.trim() === '')) {
      // Try to find correct answer from guesses
      const correctGuess = gameState.guesses.find(g => g.isCorrect);
      if (correctGuess) {
        setActualCorrectAnswer(correctGuess.guess);
      } else if (gameState.finalFiveOptions && gameState.finalFiveOptions.length > 0) {
        // If no correct guess found, we can try to set the first option as a fallback
        // This is just a temporary measure - the real solution is to ensure the correct answer is passed
        setActualCorrectAnswer(gameState.finalFiveOptions[0]);
      }
    }
  }, [outcome, correctAnswer, gameState.guesses, gameState.finalFiveOptions]);
  
  // Confetti pieces configuration - only for win scenarios
  const showConfetti = outcome === 'standard-win' || outcome === 'final-five-win';
  const confettiPieces = showConfetti ? Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    color: i % 2 === 0 ? `var(--color-${colors.primary})` : `var(--color-${colors.accent})`,
    angle: (i * 18) % 360,
    delay: i * 0.05
  })) : [];

  // Format time spent
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;
  
  // Determine if we should show time (only for standard wins)
  const shouldShowTime = outcome === 'standard-win';
  
  // Effect to show "Come back tomorrow" message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTomorrowMessage(true);
    }, 2000); // 2 seconds after the main message appears
    
    return () => clearTimeout(timer);
  }, []);

  // Get message text based on outcome
  const getMessage = () => {
    const displayAnswer = actualCorrectAnswer || correctAnswer;
    
    switch(outcome) {
      case 'standard-win':
        return (
          <div>
            You guessed <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }}>{displayAnswer}</span> in {numberOfTries} {numberOfTries === 1 ? 'try' : 'tries'}!
          </div>
        );
      case 'final-five-win':
        return (
          <div>
            Solved <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }}>{displayAnswer}</span> in the{' '}
            <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }} className={righteous.className}>FINAL 5</span>!
          </div>
        );
      case 'loss':
        // Handle Final Five losses differently
        if (isFinalFiveActive) {
          // If final five active and picked wrong answer
          if (pickedWrongAnswer) {
            return (
              <div>
                Incorrect guess! The answer was <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }}>{displayAnswer}</span>.
              </div>
            );
          } 
          // If ran out of time during Final Five
          else if (finalFiveTimeRemaining === 0) {
            return (
              <div>
                Out of time! The answer was <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }}>{displayAnswer}</span>.
              </div>
            );
          }
        }
        
        // Default loss message (ran out of time in main game)
        return (
          <div>
            Out of time! The answer was <span style={{ fontWeight: 'bold', color: `var(--color-${colors.primary})` }}>{displayAnswer}</span>.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-center items-center relative" style={{ minHeight: '160px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative px-4"
      >
        {/* Confetti animation - only for win scenarios */}
        {showConfetti && confettiPieces.map(piece => (
          <motion.div
            key={piece.id}
            className="absolute left-1/2 top-1/2"
            initial={{ 
              x: 0, 
              y: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{ 
              x: [0, Math.cos(piece.angle) * 80],
              y: [0, Math.sin(piece.angle) * 80],
              scale: [0, 1, 0.5],
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: piece.delay,
              ease: "easeOut"
            }}
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: '50%',
              position: 'absolute',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        
        {/* Message text */}
        <motion.div
          className="text-xl sm:text-2xl font-display text-center flex flex-col items-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {getMessage()}
          
          {/* Time display - only for standard wins */}
          {shouldShowTime && (
            <div className="flex items-center gap-3 text-base">
              <span style={{ color: `var(--color-${colors.primary})` }}>
                {timeFormatted}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: `var(--color-${colors.primary})` }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                />
              </svg>
            </div>
          )}
          
          {/* "Come back tomorrow" message (animated in after a delay) */}
          <AnimatePresence>
            {showTomorrowMessage && (
              <motion.div 
                className="text-base font-medium mt-4"
                style={{ color: `var(--color-${colors.primary})` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Come back tomorrow for a new challenge!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameMessage; 