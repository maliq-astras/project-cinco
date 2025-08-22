import { StateCreator } from 'zustand';
import { UserGuess, GameOutcome } from '../../types/index';
import { verifyGuess as verifyGuessAPI } from '../../helpers/gameLogic';

export interface FinalFiveSlice {
  // Final Five specific state
  finalFiveTimeRemaining: number;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  finalFiveTransitionReason: 'time' | 'guesses' | null;
  finalFiveError: string | null;
  isFetchingFinalFiveOptions: boolean;
  
  // Actions
  decrementFinalFiveTimer: () => void;
  triggerFinalFive: () => Promise<void>;
  prefetchFinalFiveOptions: () => Promise<void>;
  selectFinalFiveOption: (option: string) => Promise<void>;
  closeFinalFive: () => void;
  startFinalFive: () => void;
  resetFinalFiveError: () => void;
  filterFinalFiveOptions: () => void;
}

export const createFinalFiveSlice: StateCreator<
  any,
  [],
  [],
  FinalFiveSlice
> = (set, get, api) => ({
  // Initial state
  finalFiveTimeRemaining: 55, // Will be set to 5 in hard mode when game starts
  isFinalFiveActive: false,
  showFinalFiveTransition: false,
  finalFiveTransitionReason: null,
  finalFiveError: null,
  isFetchingFinalFiveOptions: false,
  
  // Actions
  decrementFinalFiveTimer: () => {
    const { 
      finalFiveTimeRemaining, 
      isFinalFiveActive, 
      hardMode, 
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
  
  // Helper function to prefetch final five options
  prefetchFinalFiveOptions: async () => {
    const { gameState, isFetchingFinalFiveOptions } = get();
    
    // Don't fetch if we already have options or a fetch is in progress
    if (!gameState.challenge || gameState.finalFiveOptions || isFetchingFinalFiveOptions) {
      return;
    }
    
    // Set flag to indicate fetch is in progress
    set({ isFetchingFinalFiveOptions: true });
    
    // Try with an extended timeout
    try {
      // Get previous guesses (excluding skipped ones) to filter options
      const previousGuesses = gameState.guesses
        .filter((g: UserGuess) => !g.isCorrect && g.guess !== "___SKIPPED___")
        .map((g: UserGuess) => g.guess);
      
      // Get the current language from localStorage
      const language = localStorage.getItem('language') || 'en';
      
      // Use a custom controller with a longer timeout (30 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      let response: Response | undefined;
      try {
        // Try up to 3 times with increasing delays
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            if (attempt > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
            
            response = await fetch('/api/final-five', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                challengeId: gameState.challenge.challengeId,
                previousGuesses,
                language
              }),
              signal: controller.signal
            });
            
            if (response.ok) break;
          } catch (e) {
            if (attempt === 2) throw e; // Rethrow on final attempt
          }
        }
        
        // If we don't have a response after all retries, throw an error
        if (!response) {
          throw new Error('Failed to fetch options after multiple attempts');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch options');
        }
        
        clearTimeout(timeoutId);
        
        // Store the options in the state and reset the flag
        set((state: any) => ({
          gameState: {
            ...state.gameState,
            finalFiveOptions: data.options
          },
          isFetchingFinalFiveOptions: false
        }));
        
        return data.options;
      } catch (fetchError) {
        // Clear timeout if it's still active
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error prefetching Final Five options:', error);
      
      // Reset the flag
      set({ isFetchingFinalFiveOptions: false });
      
      // Rethrow for the caller to handle
      throw error;
    }
  },
  
  triggerFinalFive: async () => {
    const { gameState, hardMode, isFetchingFinalFiveOptions } = get();
    
    // Reset any previous error
    set({ 
      showFinalFiveTransition: true,
      isFinalFiveActive: false,
      isPendingFinalFiveTransition: false,
      finalFiveTimeRemaining: hardMode ? 5 : 55,
      finalFiveError: null // Reset error state
    });
    
    try {
      // Always ensure we're using the most current guesses
      // First clear any prefetched options
      set((state: any) => ({
        gameState: {
          ...state.gameState,
          finalFiveOptions: null
        },
        isFetchingFinalFiveOptions: false
      }));
      
      // Try to fetch options using the prefetch function with current guesses
      if (gameState.challenge) {
        // Get the current language
        const language = localStorage.getItem('language') || 'en';
        
        // Get all non-skipped guesses
        const previousGuesses = gameState.guesses
          .filter((g: UserGuess) => !g.isCorrect && g.guess !== "___SKIPPED___")
          .map((g: UserGuess) => g.guess);
          
        // Intentionally not logging guesses in production
        
        // Use a controller with a long timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
          // Make a direct request to ensure all current guesses are excluded
          const response = await fetch('/api/final-five', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              challengeId: gameState.challenge.challengeId,
              previousGuesses,
              language
            }),
            signal: controller.signal
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          clearTimeout(timeoutId);
          const data = await response.json();
          
          // Update the options in state
          set((state: any) => ({
            gameState: {
              ...state.gameState,
              finalFiveOptions: data.options
            },
            isFetchingFinalFiveOptions: false
          }));
          
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Error fetching Final Five:', error);
          throw error;
        }
      }
      
      // After the transition, load the options (with minimal delay)
      setTimeout(() => {
        set({ 
          showFinalFiveTransition: false,
          isFinalFiveActive: true 
        });
      }, 50);
    } catch (error) {
      console.error('Error fetching Final Five options:', error);
      // Set error state with user-friendly message
      set({ 
        showFinalFiveTransition: false,
        isFinalFiveActive: true, // Ensure modal stays up on error
        finalFiveError: 'Could not load Final Five challenge. Please try again.',
        isFetchingFinalFiveOptions: false // Ensure the flag is reset on error
      });
    }
  },
  
  selectFinalFiveOption: async (option: string) => {
    const { gameState, finalFiveTimeRemaining } = get();
    
    if (!gameState.challenge) return;
    
    // Set processing state to true when submitting
    set({ isProcessingGuess: true });
    
    // Create a promise that resolves after 1.5 seconds
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
    
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
            get().saveTodayGameData('loss-final-five-wrong', correctAnswer, numberOfTries, timeSpent, currentState.gameState.challenge);
            
            // Add both guesses to the state and set game over
            set((state: any) => ({
              gameState: {
                ...state.gameState,
                guesses: [...state.gameState.guesses, newGuess, correctGuess],
                isGameOver: true
              },
              isProcessingGuess: false,
              gameOutcome: 'loss-final-five-wrong' // Set the correct outcome for Final Five wrong guess
            }));
            
            return;
          } catch (error) {
            console.error('Error fetching correct answer:', error);
            // Track failed attempt - wrong answers break streak
            get().trackFailedAttempt();
            
            // Save today's game data for full endgame experience on refresh
            const currentState = get();
            const numberOfTries = currentState.gameState.guesses.length + 1; // +1 for the current guess
            const initialTime = currentState.hardMode ? 55 : 300;
            const timeSpent = initialTime - currentState.timeRemaining;
            get().saveTodayGameData('loss-final-five-wrong', option, numberOfTries, timeSpent, currentState.gameState.challenge);
            
            // If we can't get the correct answer, just add the incorrect guess
            set((state: any) => ({
              gameState: {
                ...state.gameState,
                guesses: [...state.gameState.guesses, newGuess],
                isGameOver: true
              },
              isProcessingGuess: false,
              gameOutcome: 'loss-final-five-wrong' // Set the correct outcome for Final Five wrong guess
            }));
            
            return;
          }
        }
      }
      
      // If we have a correct guess, just add it to the state
      set((state: any) => ({
        gameState: {
          ...state.gameState,
          guesses: [...state.gameState.guesses, newGuess],
          isGameOver: false // Don't set game over immediately - let bubble animation complete first
        },
        isProcessingGuess: false
      }));
      
      // If the guess was correct, show the victory animation
      if (data.isCorrect) {
        // Update streak on successful completion
        get().updateStreak();
        
        // Save today's game data for full endgame experience on refresh
        const numberOfTries = get().gameState.guesses.length;
        const { hardMode, gameState, timeRemaining } = get();
        const initialTime = hardMode ? 55 : 300;
        const timeSpent = initialTime - timeRemaining;
        get().saveTodayGameData('final-five-win', option, numberOfTries, timeSpent, gameState.challenge);
        
        set({
          isVictoryAnimationActive: true,
          victoryAnimationStep: 'bubbles',
          gameOutcome: 'final-five-win'
        });
        
        setTimeout(() => {
          set({ 
            victoryAnimationStep: 'summary',
            gameState: {
              ...get().gameState,
              isGameOver: true
            }
          });
        }, 2000); // Increased from 1500ms to 2000ms to allow bubble animation to complete
      }
    } catch (error) {
      console.error('Error verifying Final Five guess:', error);
      // Wait for the minimum loading time before resetting processing state
      await minimumLoadingTime;
      set({ isProcessingGuess: false });
    }
  },
  
  closeFinalFive: () => {
    set((state: any) => ({
      isFinalFiveActive: false,
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
      set((state: any) => ({
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
