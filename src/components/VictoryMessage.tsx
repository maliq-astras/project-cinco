import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../context/ThemeContext';

const VictoryMessage: React.FC = () => {
  const guesses = useGameStore(state => state.gameState.guesses);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const { colors } = useTheme();
  
  const correctGuess = guesses.find(g => g.isCorrect);
  if (!correctGuess) return null;
  
  // Number of tries is the index of the correct guess plus 1
  const numberOfTries = guesses.indexOf(correctGuess) + 1;
  
  // Confetti pieces configuration
  const confettiPieces = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    color: i % 2 === 0 ? `var(--color-${colors.primary})` : `var(--color-${colors.accent})`,
    angle: (i * 18) % 360,
    delay: i * 0.05
  }));

  return (
    <div className="w-full flex justify-center items-center relative" style={{ minHeight: '160px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative px-4"
      >
        {/* Confetti animation */}
        {confettiPieces.map(piece => (
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
        
        {/* Victory text */}
        <motion.div
          className="text-xl sm:text-2xl font-display text-center flex flex-col items-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            You guessed <span className={`font-bold text-${colors.primary}`}>{correctGuess.guess}</span> in {numberOfTries} {numberOfTries === 1 ? 'try' : 'tries'}!
          </div>
          <div className="flex items-center gap-3 text-base">
            <span className={`text-${colors.primary}`}>
              {Math.floor((300 - timeRemaining) / 60)}m {(300 - timeRemaining) % 60}s
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-${colors.primary} cursor-pointer hover:opacity-80 transition-opacity`}
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VictoryMessage; 