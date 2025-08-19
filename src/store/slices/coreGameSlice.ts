import { StateCreator } from 'zustand';
import { UserGuess, GameOutcome } from '../../types/index';
import { 
  initialGameState, 
  GameState,
  fetchChallenge as fetchChallengeAPI,
  verifyGuess as verifyGuessAPI,
  shouldShowFinalFive
} from '../../helpers/gameLogic';

export interface CoreGameSlice {
  // Core game state
  gameState: GameState;
  hasSeenClue: boolean;
  canRevealNewClue: boolean;
  canMakeGuess: boolean;
  lastRevealedFactIndex: number | null;
  isPendingFinalFiveTransition: boolean;
  isProcessingGuess: boolean;
  hasMadeGuess: boolean;
  
  // Today's game data for persistence
  todayGameData: {
    outcome: GameOutcome;
    correctAnswer: string;
    numberOfTries: number;
    timeSpent: number;
    completionDate: string; // ISO date string
  } | null;
  todayChallenge: any | null; // Store the challenge data for AnswerDetailsModal
  
  // Victory animation states
  isVictoryAnimationActive: boolean;
  victoryAnimationStep: 'bubbles' | 'summary' | 'cards' | null;
  gameOutcome: GameOutcome | null;
  showGameMessage: boolean;
  
  // Actions
  fetchChallenge: (language: string) => Promise<void>;
  revealFact: (factIndex: number, sourcePosition: { x: number, y: number } | null) => void;
  handleCardClick: (factIndex: number, sourcePosition: { x: number, y: number }) => void;
  closeFactCard: () => void;
  completeCardAnimation: () => void;
  submitGuess: (guess: string) => Promise<void>;
  resetGameState: () => void;
  saveTodayGameData: (outcome: GameOutcome, correctAnswer: string, numberOfTries: number, timeSpent: number, challenge: any) => void;
  clearTodayGameData: () => void;
}

export const createCoreGameSlice: StateCreator<
  any,
  [],
  [],
  CoreGameSlice
> = (set, get, api) => ({
  // Initial state
  gameState: initialGameState,
  hasSeenClue: false,
  canRevealNewClue: true,
  canMakeGuess: false,
  lastRevealedFactIndex: null,
  isPendingFinalFiveTransition: false,
  isProcessingGuess: false,
  hasMadeGuess: false,
  
  // Today's game data for persistence
  todayGameData: null,
  todayChallenge: null,
  
  // Victory animation states
  isVictoryAnimationActive: false,
  victoryAnimationStep: null,
  gameOutcome: null,
  showGameMessage: false,
  
  // Actions
  fetchChallenge: async (language: string = 'en') => {
    try {
      const challenge = await fetchChallengeAPI(language);
      
      // Update missed days and clear stale data before checking if user has played today
      get().updateMissedDays();
      
      // Check if user has already played today
      const hasPlayedToday = get().hasPlayedToday();
      
      if (hasPlayedToday) {
        const { todayGameData, todayChallenge } = get();
        
        // Use saved game data if available for full endgame experience
        if (todayGameData && todayChallenge) {
          set((state: any) => ({
            gameState: {
              ...state.gameState,
              loading: false,
              challenge: todayChallenge,
              isGameOver: true,
              guesses: [] // Empty guesses since they already played
            },
            gameOutcome: todayGameData.outcome,
            isVictoryAnimationActive: false, // Skip animations for replay attempts
            victoryAnimationStep: todayGameData.outcome.includes('win') ? 'summary' : null
          }));
          return;
        }
        
        // Fallback to basic status if no saved data (shouldn't happen with new system)
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        // Determine the game outcome based on today's status
        const gameOutcome = 'standard-win'; // Default fallback
        
        set((state: any) => ({
          gameState: {
            ...state.gameState,
            loading: false,
            challenge,
            isGameOver: true,
            guesses: [] // Empty guesses since they already played
          },
          gameOutcome,
          isVictoryAnimationActive: false, // Skip animations for replay attempts
          victoryAnimationStep: null
        }));
        return;
      }
      
      // Save the category to localStorage for use across different routes
      if (challenge && challenge.category && typeof window !== 'undefined') {
        localStorage.setItem('lastActiveCategory', JSON.stringify(challenge.category));
      }
      
      set((state: any) => ({
        gameState: {
          ...state.gameState,
          loading: false,
          challenge
        }
      }));
    } catch (error) {
      set((state: any) => ({
        gameState: {
          ...state.gameState,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }
      }));
    }
  },
  
  revealFact: (factIndex: number, sourcePosition: { x: number, y: number } | null) => {
    const { gameState, canRevealNewClue, lastRevealedFactIndex, isPendingFinalFiveTransition } = get();
    
    // Prevent revealing facts if there's a pending transition to Final Five
    if (isPendingFinalFiveTransition) {
      return;
    }
    
    // Check if we can reveal a new clue
    if (!canRevealNewClue && !gameState.revealedFacts.includes(factIndex)) {
      return; // Don't allow revealing a new fact if we haven't guessed yet
    }
    
    // Don't allow revealing the same fact that was just revealed (to force revealing different facts)
    if (factIndex === lastRevealedFactIndex && !gameState.revealedFacts.includes(factIndex)) {
      return;
    }
    
    if (gameState.revealedFacts.includes(factIndex)) {
      // If revealing from the stack, use the rovided source position
      set({
        cardSourcePosition: sourcePosition,
        viewingFact: factIndex,
        isDrawingFromStack: false,
        isReturningToStack: false
      });
    } else {
      // Only reveal if not already revealed
      if (!gameState.revealedFacts.includes(factIndex)) {
        // Use the provided source position
        set({
          cardSourcePosition: sourcePosition,
          viewingFact: factIndex,
          isDrawingFromStack: false,
          isReturningToStack: false,
          // Disable revealing new clues until they make a guess
          canRevealNewClue: false,
          lastRevealedFactIndex: factIndex,
          // Enable making a guess after revealing a new fact
          canMakeGuess: true
        });
        
        // Then update the revealed facts list after a delay
        setTimeout(() => {
          set((state: any) => {
            // Limit to maximum 5 cards
            let newRevealedFacts;
            if (state.gameState.revealedFacts.length >= 5) {
              // Remove the oldest card and add the new one
              newRevealedFacts = [...state.gameState.revealedFacts.slice(1), factIndex];
            } else {
              // Add the new fact to the revealed facts
              newRevealedFacts = [...state.gameState.revealedFacts, factIndex];
            }
            
            return {
              gameState: {
                ...state.gameState,
                revealedFacts: newRevealedFacts
              }
            };
          });
        }, 1000); // Delay to allow the flip animation to complete
      }
    }
  },
  
  handleCardClick: (factIndex: number, sourcePosition: { x: number, y: number }) => {
    const { viewingFact, canRevealNewClue, gameState, isPendingFinalFiveTransition } = get();
    
    // Prevent revealing facts if there's a pending transition to Final Five
    if (isPendingFinalFiveTransition) {
      return;
    }
    
    // Check if we can reveal a new clue
    if (!canRevealNewClue && !gameState.revealedFacts.includes(factIndex)) return;
    
    // Only set the source position if the fact isn't already being viewed
    if (viewingFact !== factIndex) {
      set({
        cardSourcePosition: sourcePosition,
        isDrawingFromStack: true,
        viewingFact: factIndex
      });
    }
  },
  
  closeFactCard: () => {
    const { 
      isTimerActive,
      hasSeenClue, 
      resetTimer,
      startTimer
    } = get();
    
    set({
      isCardAnimatingOut: true,
      isReturningToStack: true,
      hasSeenClue: true,
      // Signal that we should focus the input after animation completes
      shouldFocusInput: true
    });
    
    // Start timer and lock in hard mode when first fact card is closed
    if (!isTimerActive && !hasSeenClue) {
      resetTimer();
      startTimer();
    }
  },
  
  completeCardAnimation: () => {
    const { viewingFact, gameState } = get();
    const currentViewingFact = viewingFact;
    
    // Wait a short delay before updating the state to prevent the card from appearing twice
    setTimeout(() => {
      // First clear the viewing state
      set({
        viewingFact: null,
        cardSourcePosition: null,
        isDrawingFromStack: false
      });
      
      // If we were viewing a fact from the stack, move it to the end of the revealed facts array
      if (currentViewingFact !== null && gameState.revealedFacts.includes(currentViewingFact)) {
        // Create a new array without the current fact, then add it to the end
        const newRevealedFacts = gameState.revealedFacts.filter((index: number) => index !== currentViewingFact);
        
        // Update the state with the reordered facts
        set((state: any) => ({
          gameState: {
            ...state.gameState,
            revealedFacts: [...newRevealedFacts, currentViewingFact]
          }
        }));
      }
      
      // Reset the animation flags after a short delay
      setTimeout(() => {
        set({ isCardAnimatingOut: false });
        
        // Reset the returning to stack flag after the animation completes
        setTimeout(() => {
          set({ isReturningToStack: false });
          // The shouldFocusInput flag stays true until handled by the component
        }, 600); // Increased to match the longer animation duration
      }, 150);
    }, 300); // Increased delay to match the longer animation duration
  },
  
  submitGuess: async (guess: string) => {
    const { gameState, hasSeenClue, canMakeGuess, isFinalFiveActive, showFinalFiveTransition } = get();
    
    if (!gameState.challenge) return;
    if (!hasSeenClue) return;
    if (!canMakeGuess) return;
    
    // Special case for skipped guesses - handle immediately without API call or minimum loading time
    if (guess === "___SKIPPED___") {
      const newGuess: UserGuess = {
        guess,
        isCorrect: false,
        timestamp: new Date()
      };
      
      set((state: any) => {
        const newGuesses = [...state.gameState.guesses, newGuess];
        const newState = {
          gameState: {
            ...state.gameState,
            guesses: newGuesses,
            isGameOver: false
          },
          canRevealNewClue: true,
          canMakeGuess: false,
          isProcessingGuess: false // Reset processing state immediately for skips
        };

        if (shouldShowFinalFive(newGuesses) && !isFinalFiveActive && !showFinalFiveTransition) {
          // Immediately set pending state to prevent further interactions
          set({
            ...newState,
            isPendingFinalFiveTransition: true
          });
          
          // Then show the transition after delay
          setTimeout(() => {
            set({
              showFinalFiveTransition: true,
              finalFiveTransitionReason: 'guesses'
            });

            // Prefetch final five options as soon as transition starts
            get().prefetchFinalFiveOptions();
          }, 1500);
          
          return newState;
        }

        return newState;
      });
      
      return; // Exit early for skipped guesses
    }
    
    // Create a promise that resolves after 1.5 seconds
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Get the current language from localStorage
      const language = localStorage.getItem('language') || 'en';
      
      // Start both the API call and the minimum loading time
      const [data] = await Promise.all([
        verifyGuessAPI(gameState.challenge.challengeId, guess, language),
        minimumLoadingTime
      ]);
      
      const newGuess: UserGuess = {
        guess,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      set((state: any) => {
        const newGuesses = [...state.gameState.guesses, newGuess];
        const newState = {
          gameState: {
            ...state.gameState,
            guesses: newGuesses,
            isGameOver: data.isCorrect
          },
          canRevealNewClue: true,
          canMakeGuess: false,
          isProcessingGuess: false // Reset processing state after minimum time
        };

        if (data.isCorrect) {
          // Update streak on successful completion
          get().updateStreak();
          
          // Save today's game data for full endgame experience on refresh
          const numberOfTries = newGuesses.length;
          const { hardMode, gameState, timeRemaining } = get();
          const initialTime = hardMode ? 55 : 300;
          const timeSpent = initialTime - timeRemaining;
          get().saveTodayGameData('standard-win', guess, numberOfTries, timeSpent, gameState.challenge);
          
          return {
            ...newState,
            isVictoryAnimationActive: true,
            victoryAnimationStep: 'bubbles',
            gameOutcome: 'standard-win'
          };
        }

        if (shouldShowFinalFive(newGuesses) && !isFinalFiveActive && !showFinalFiveTransition) {
          // Immediately set pending state to prevent further interactions
          set({
            ...newState,
            isPendingFinalFiveTransition: true
          });
          
          // Then show the transition after delay
          setTimeout(() => {
            set({
              showFinalFiveTransition: true,
              finalFiveTransitionReason: 'guesses'
            });

            // Prefetch final five options as soon as transition starts
            get().prefetchFinalFiveOptions();
          }, 1500);
          
          return newState;
        }

        return newState;
      });

      if (data.isCorrect) {
        setTimeout(() => {
          set({ victoryAnimationStep: 'summary' });
        }, 1500);
      }
    } catch (error) {
      console.error('Error verifying guess:', error);
      // Wait for the minimum loading time before resetting processing state
      await minimumLoadingTime;
      set({ isProcessingGuess: false });
    }
  },
  
  resetGameState: () => {
    const { isHardModeEnabled, resetTimer } = get();
    const finalFiveTimeRemaining = isHardModeEnabled ? 5 : 55;

    // Reset the main timer and lock-in hard mode according to current setting
    resetTimer();

    // Then reset game state flags and ensure timers are idle and Final Five timer is correct
    set({
      // Reset core game state
      gameState: initialGameState,
      hasSeenClue: false,
      canRevealNewClue: true,
      canMakeGuess: false,
      lastRevealedFactIndex: null,
      isPendingFinalFiveTransition: false,
      isProcessingGuess: false,
      hasMadeGuess: false,

      // Ensure timers are not running after reset
      isTimerActive: false,
      shouldPauseTimer: false,

      // Reset Final Five timer baseline (do not start Final Five)
      finalFiveTimeRemaining,

      // Reset game outcome states
      gameOutcome: null,
      isVictoryAnimationActive: false,
      victoryAnimationStep: null,
      showGameMessage: false
    });
  },
  
  // Today's game data methods
  saveTodayGameData: (outcome: GameOutcome, correctAnswer: string, numberOfTries: number, timeSpent: number, challenge: any) => {
    const today = new Date().toISOString().split('T')[0];
    
    set({
      todayGameData: {
        outcome,
        correctAnswer,
        numberOfTries,
        timeSpent,
        completionDate: today
      },
      todayChallenge: challenge
    });
  },
  
  clearTodayGameData: () => {
    set({
      todayGameData: null,
      todayChallenge: null
    });
  }
});
