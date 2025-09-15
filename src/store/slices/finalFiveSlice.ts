import { StateCreator } from 'zustand';
import { UserGuess } from '../../types/index';
import type { GameStore } from '../../types';
import { verifyGuess as verifyGuessAPI } from '../../helpers/gameLogic';
import { TIMEOUTS } from '@/constants/timeouts';
import { logger } from '@/utils/logger';

// Prevent multiple simultaneous Final Five requests
let finalFiveRequestInProgress = false;

export interface FinalFiveSlice {
  // Final Five specific state
  finalFiveTimeRemaining: number;
  isFinalFiveActive: boolean;
  isFinalFiveCompleted: boolean;
  showFinalFiveTransition: boolean;
  finalFiveTransitionReason: 'time' | 'guesses' | null;
  isFetchingFinalFiveOptions: boolean;
  finalFiveError: string | null;
  
  // Actions
  decrementFinalFiveTimer: () => void;
  triggerFinalFive: () => Promise<void>;
  selectFinalFiveOption: (option: string) => Promise<void>;
  closeFinalFive: () => void;
  startFinalFive: () => void;
  resetFinalFiveError: () => void;
  filterFinalFiveOptions: () => void;
}

export const createFinalFiveSlice: StateCreator<
  GameStore,
  [],
  [],
  FinalFiveSlice
> = (set, get, _api) => ({
  // Initial state
  finalFiveTimeRemaining: 55, // Will be set to 5 in hard mode when game starts
  isFinalFiveActive: false,
  isFinalFiveCompleted: false,
  showFinalFiveTransition: false,
  finalFiveTransitionReason: null,
  isFetchingFinalFiveOptions: false,
  finalFiveError: null,
  
  // Actions
  decrementFinalFiveTimer: () => {
    const { 
      finalFiveTimeRemaining, 
      shouldPauseTimer,
      isProcessingGuess
    } = get();
    
    // Don't decrement if timer should be paused (e.g., during tutorial or guess verification)
    if (shouldPauseTimer || isProcessingGuess) return;
    
    if (finalFiveTimeRemaining <= 0) {
      return;
    }
    
    set({ finalFiveTimeRemaining: finalFiveTimeRemaining - 1 });
  },
  
  triggerFinalFive: async () => {
    // Check for duplicate requests
    if (finalFiveRequestInProgress) {
      logger.info('Final Five request already in progress, skipping', { 
        component: 'finalFiveSlice'
      });
      return;
    }

    const { gameState, hardMode } = get();
    
    if (!gameState.challenge) {
      logger.error('No challenge available for Final Five', { 
        component: 'finalFiveSlice',
        operation: 'triggerFinalFive'
      });
      return;
    }

    finalFiveRequestInProgress = true;
    
    // Reset state and show transition
    set({ 
      showFinalFiveTransition: true,
      finalFiveError: null,
      finalFiveTimeRemaining: hardMode ? 5 : 55
    });
    
    try {
      const language = localStorage.getItem('language') || 'en';
      const previousGuesses = gameState.guesses
        .filter((g: UserGuess) => !g.isCorrect && g.guess !== "___SKIPPED___")
        .map((g: UserGuess) => g.guess);
        
      // Single, simple API call with 8-second timeout
      const response = await fetch('/api/final-five', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: gameState.challenge.challengeId,
          previousGuesses,
          language
        }),
        signal: AbortSignal.timeout(TIMEOUTS.API_FAST)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.options || !Array.isArray(data.options) || data.options.length < 5) {
        throw new Error('Invalid Final Five options received');
      }
      
      // Success: Update state with options and show Final Five
      set((state: GameStore) => ({
        gameState: { 
          ...state.gameState, 
          finalFiveOptions: data.options 
        },
        showFinalFiveTransition: false,
        isFinalFiveActive: true
      }));
      
    } catch (error) {
      logger.error('Final Five fetch failed', { 
      component: 'finalFiveSlice',
      operation: 'triggerFinalFive',
      error
    });
      set({ 
        finalFiveError: 'Could not load Final Five. Please refresh and try again.',
        showFinalFiveTransition: false,
        isFinalFiveActive: true
      });
    } finally {
      finalFiveRequestInProgress = false;
    }
  },
  
  selectFinalFiveOption: async (option: string) => {
    const { gameState } = get();
    
    if (!gameState.challenge) return;
    
    // Set processing state to true when submitting
    set({ isProcessingGuess: true });
    
    // Create a promise that resolves after 1.5 seconds
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, TIMEOUTS.LOADING_MIN_DURATION));
    
    try {
      // Get the current language from localStorage
      const language = localStorage.getItem('language') || 'en';
      
      // Start both the API call and the minimum loading time
      const [data] = await Promise.all([
        verifyGuessAPI(gameState.challenge.challengeId, option, language),
        minimumLoadingTime
      ]);
      
      const newGuess: UserGuess = {
        guess: option,
        isCorrect: data.isCorrect,
        timestamp: new Date(),
        isFinalFiveGuess: true
      };
      
      // If this guess was incorrect, get the correct answer directly from the API
      let correctAnswer = '';
      if (!data.isCorrect && gameState.finalFiveOptions) {
        // First check if we already have a correct guess in our history
        const existingCorrectGuess = gameState.guesses.find((g: UserGuess) => g.isCorrect);
        if (existingCorrectGuess) {
          correctAnswer = existingCorrectGuess.guess;
        } else {
          // Use our new API endpoint to get the correct answer directly
          try {
            const response = await fetch('/api/final-five-answer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                challengeId: gameState.challenge.challengeId,
                language
              })
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch correct answer: ${response.status}`);
            }
            
            const answerData = await response.json();
            correctAnswer = answerData.answer;
            
            // Add this as a "hidden" guess so it's in our guesses array
            const correctGuess: UserGuess = {
              guess: correctAnswer,
              isCorrect: true,
              timestamp: new Date(),
              isFinalFiveGuess: true,
              isHidden: true
            };
            
            // Track failed attempt - wrong answers break streak
            get().trackFailedAttempt();
            
            // Save today's game data for full endgame experience on refresh
            const currentState = get();
            const numberOfTries = currentState.gameState.guesses.length + 1; // +1 for the current guess
            const initialTime = currentState.hardMode ? 55 : 300;
            const timeSpent = initialTime - currentState.timeRemaining;
            if (currentState.gameState.challenge) {
              get().saveTodayGameData('loss-final-five-wrong', correctAnswer, numberOfTries, timeSpent, currentState.gameState.challenge);
            }
            
            // Add both guesses to the state and set Final Five completed
            set((state: GameStore) => ({
              gameState: {
                ...state.gameState,
                guesses: [...state.gameState.guesses, newGuess, correctGuess],
                isGameOver: true // For wrong answers, set main game over immediately
              },
              isFinalFiveCompleted: true, // Mark Final Five completed for proper message timing
              isProcessingGuess: false,
              gameOutcome: 'loss-final-five-wrong' // Set the correct outcome for Final Five wrong guess
            }));
            
            return;
          } catch (error) {
            logger.error('Error fetching correct answer', { 
              component: 'finalFiveSlice',
              operation: 'selectFinalFiveOption',
              error
            });
            // Track failed attempt - wrong answers break streak
            get().trackFailedAttempt();
            
            // Save today's game data for full endgame experience on refresh
            const currentState = get();
            const numberOfTries = currentState.gameState.guesses.length + 1; // +1 for the current guess
            const initialTime = currentState.hardMode ? 55 : 300;
            const timeSpent = initialTime - currentState.timeRemaining;
            if (currentState.gameState.challenge) {
              get().saveTodayGameData('loss-final-five-wrong', option, numberOfTries, timeSpent, currentState.gameState.challenge);
            }
            
            // If we can't get the correct answer, just add the incorrect guess
            set((state: GameStore) => ({
              gameState: {
                ...state.gameState,
                guesses: [...state.gameState.guesses, newGuess],
                isGameOver: true
              },
              isFinalFiveCompleted: true, // Mark Final Five completed for proper message timing
              isProcessingGuess: false,
              gameOutcome: 'loss-final-five-wrong' // Set the correct outcome for Final Five wrong guess
            }));
            
            return;
          }
        }
      }
      
      // If we have a correct guess, just add it to the state and mark Final Five as completed
      set((state: GameStore) => ({
        gameState: {
          ...state.gameState,
          guesses: [...state.gameState.guesses, newGuess],
          isGameOver: false // Don't set main game over - Final Five has its own completion state
        },
        isFinalFiveCompleted: true, // Set Final Five completed immediately for proper message timing
        isProcessingGuess: false
      }));
      
      // If the guess was correct, show the victory animation
      if (data.isCorrect) {
        // IMMEDIATELY stop ALL timers to prevent any race conditions
        get().setShouldPauseTimer(true);
        set({ 
          isTimerActive: false,
          finalFiveTimeRemaining: 0  // Stop Final Five timer too
        });
        
        // Update streak on successful completion
        get().updateStreak();
        
        // Save today's game data for full endgame experience on refresh
        const numberOfTries = get().gameState.guesses.length;
        const { hardMode, timeRemaining } = get();
        const initialTime = hardMode ? 55 : 300;
        const timeSpent = initialTime - timeRemaining;
        if (gameState.challenge) {
          get().saveTodayGameData('final-five-win', option, numberOfTries, timeSpent, gameState.challenge);
        }
        
        set({
          isVictoryAnimationActive: true,
          victoryAnimationStep: 'bubbles',
          gameOutcome: 'final-five-win'
        });
        
        setTimeout(() => {
          set({ 
            victoryAnimationStep: 'summary'
          });
        }, 2000); // Increased from 1500ms to 2000ms to allow bubble animation to complete
      }
    } catch (error) {
      logger.error('Error verifying Final Five guess', { 
      component: 'finalFiveSlice',
      operation: 'selectFinalFiveOption',
      error
    });
      // Wait for the minimum loading time before resetting processing state
      await minimumLoadingTime;
      set({ isProcessingGuess: false });
    }
  },
  
  closeFinalFive: () => {
    set((state: GameStore) => ({
      isFinalFiveActive: false,
      isFinalFiveCompleted: false, // Reset completion state when closing
      victoryAnimationStep: state.gameOutcome !== null ? 'summary' : null,
      isVictoryAnimationActive: state.gameOutcome === 'final-five-win'
    }));
  },
  
  startFinalFive: () => {
    const { hardMode } = get();
    
    const finalFiveTime = hardMode ? 5 : 55;
    
    set({
      finalFiveTimeRemaining: finalFiveTime,
      isFinalFiveActive: true,
      isPendingFinalFiveTransition: false // Reset the pending state
    });
  },
  
  // Add a reset error method
  resetFinalFiveError: () => {
    set({ finalFiveError: null });
  },
  
  // Helper function to filter out previous guesses from Final Five options
  filterFinalFiveOptions: () => {
    const { gameState } = get();
    
    // If no options or no challenge, nothing to do
    if (!gameState.finalFiveOptions || !gameState.challenge) return;
    
    // Get previous guesses (excluding skipped ones)
    const previousGuesses = gameState.guesses
      .filter((g: UserGuess) => !g.isCorrect && g.guess !== "___SKIPPED___")
      .map((g: UserGuess) => g.guess.toLowerCase().trim());
    
    // Only proceed if we have guesses to filter out
    if (previousGuesses.length === 0) return;
    
    // Intentionally no verbose logging
    
    // Normalize options and guesses for comparison (lowercase, trim whitespace)
    // We'll need to keep the original options for the final result
    const normalizedOptionMap = new Map();
    gameState.finalFiveOptions.forEach((option: string) => {
      normalizedOptionMap.set(option.toLowerCase().trim(), option);
    });
    
    // Remove any options that match previous guesses
    previousGuesses.forEach((guess: string) => {
      normalizedOptionMap.delete(guess);
    });
    
    // Convert back to array
    const filteredOptions = Array.from(normalizedOptionMap.values());
    
    // If we have at least 5 options after filtering, update the options
    if (filteredOptions.length >= 5) {
      // keep silent
      set((state: GameStore) => ({
        gameState: {
          ...state.gameState,
          finalFiveOptions: filteredOptions
        }
      }));
    } else {
      // keep silent
    }
  }
});
