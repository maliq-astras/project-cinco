import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Challenge, UserGuess } from '../types';
import { 
  initialGameState, 
  GameState,
  fetchChallenge as fetchChallengeAPI,
  verifyGuess as verifyGuessAPI,
  fetchFinalFiveOptions as fetchFinalFiveOptionsAPI,
  shouldShowFinalFive
} from '../helpers/gameLogic';
import { getFactBubblePosition } from '../helpers/uiHelpers';
import { GameOutcome } from '../components/GameMessage';

interface GameStore {
  // Core game state
  gameState: GameState;
  timeRemaining: number;
  isTimerActive: boolean;
  hasSeenClue: boolean;
  canRevealNewClue: boolean;
  canMakeGuess: boolean;
  lastRevealedFactIndex: number | null;
  
  // Hard mode settings
  hardMode: boolean;
  isHardModeEnabled: boolean; // Can be toggled before game starts
  setHardModeEnabled: (enabled: boolean) => void;
  
  // Final Five specific state
  finalFiveTimeRemaining: number;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  finalFiveTransitionReason: 'time' | 'guesses' | null;
  
  // UI and animation states
  hoveredFact: number | null;
  viewingFact: number | null;
  cardSourcePosition: { x: number, y: number } | null;
  isDrawingFromStack: boolean;
  isReturningToStack: boolean;
  isCardAnimatingOut: boolean;
  shouldFocusInput: boolean;
  windowWidth: number;
  
  // Victory animation states
  isVictoryAnimationActive: boolean;
  victoryAnimationStep: 'bubbles' | 'summary' | 'cards' | null;
  gameOutcome: GameOutcome | null;
  
  // Computed values should not be in the store interface
  
  // Actions
  setWindowWidth: (width: number) => void;
  decrementTimer: () => void;
  decrementFinalFiveTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;
  setHoveredFact: (factIndex: number | null) => void;
  setShouldFocusInput: (shouldFocus: boolean) => void;
  
  // Game logic actions
  fetchChallenge: () => Promise<void>;
  revealFact: (factIndex: number) => void;
  handleCardClick: (factIndex: number, sourcePosition: { x: number, y: number }) => void;
  closeFactCard: () => void;
  completeCardAnimation: () => void;
  submitGuess: (guess: string) => Promise<void>;
  triggerFinalFive: () => Promise<void>;
  selectFinalFiveOption: (option: string) => Promise<void>;
  closeFinalFive: () => void;
  startFinalFive: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
  // Initial state
  gameState: initialGameState,
  timeRemaining: 300, // 5 minutes in normal mode
  isTimerActive: false,
  hasSeenClue: false,
  canRevealNewClue: true,
  canMakeGuess: false,
  lastRevealedFactIndex: null,
  
  // Hard mode settings
  hardMode: false, // Current game's hard mode state (can't be changed after start)
  isHardModeEnabled: false, // Setting that can be toggled before game starts
  setHardModeEnabled: (enabled: boolean) => {
    // Only allow changing if no game is in progress
    const { hasSeenClue } = get();
    if (!hasSeenClue) {
      set({ isHardModeEnabled: enabled });
      
      // Reset the timer immediately to show the correct time based on hard mode
      const timeRemaining = enabled ? 55 : 300;
      set({ 
        timeRemaining,
        finalFiveTimeRemaining: enabled ? 5 : 55 // Also update Final Five timer when toggling hard mode
      });
    }
  },
  
  // Final Five specific state
  finalFiveTimeRemaining: 55, // Will be set to 5 in hard mode when game starts
  isFinalFiveActive: false,
  showFinalFiveTransition: false,
  finalFiveTransitionReason: null,
  
  // UI and animation states
  hoveredFact: null,
  viewingFact: null,
  cardSourcePosition: null,
  isDrawingFromStack: false,
  isReturningToStack: false,
  isCardAnimatingOut: false,
  shouldFocusInput: false,
  windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
  
  // Victory animation states
  isVictoryAnimationActive: false,
  victoryAnimationStep: null,
  gameOutcome: null,
  
  // Basic setters
  setWindowWidth: (width: number) => set({ windowWidth: width }),
  decrementTimer: () => {
    const { timeRemaining, isTimerActive, gameState, isFinalFiveActive, showFinalFiveTransition } = get();
    
    if (isTimerActive) {
      if (timeRemaining <= 1 && !isFinalFiveActive && !showFinalFiveTransition && !gameState.isGameOver) {
        set({ 
          timeRemaining: 0,
          showFinalFiveTransition: true,
          finalFiveTransitionReason: 'time',
          isTimerActive: false // Stop the main timer
        });
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }
  },
  decrementFinalFiveTimer: () => {
    const { finalFiveTimeRemaining, isFinalFiveActive, hardMode } = get();
    
    if (finalFiveTimeRemaining <= 0) {
      return;
    }
    
    set({ finalFiveTimeRemaining: finalFiveTimeRemaining - 1 });
  },
  startTimer: () => {
    // Ensure we're setting the timer active state properly
    set({ isTimerActive: true });
  },
  resetTimer: () => {
    const { isHardModeEnabled } = get();
    
    // Set timer based on hard mode
    const timeRemaining = isHardModeEnabled ? 55 : 300;
    
    // Lock in the hard mode setting once the game starts
    set({
      timeRemaining,
      hardMode: isHardModeEnabled,
    });
  },
  setHoveredFact: (factIndex: number | null) => set({ hoveredFact: factIndex }),
  setShouldFocusInput: (shouldFocus: boolean) => set({ shouldFocusInput: shouldFocus }),
  
  // Game logic actions
  fetchChallenge: async () => {
    try {
      const challenge = await fetchChallengeAPI();
      set(state => ({
        gameState: {
          ...state.gameState,
          loading: false,
          challenge
        }
      }));
    } catch (error) {
      set(state => ({
        gameState: {
          ...state.gameState,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }
      }));
    }
  },
  
  revealFact: (factIndex: number) => {
    const { gameState, canRevealNewClue, lastRevealedFactIndex } = get();
    
    // Check if we can reveal a new clue
    if (!canRevealNewClue && !gameState.revealedFacts.includes(factIndex)) {
      return; // Don't allow revealing a new fact if we haven't guessed yet
    }
    
    // Don't allow revealing the same fact that was just revealed (to force revealing different facts)
    if (factIndex === lastRevealedFactIndex && !gameState.revealedFacts.includes(factIndex)) {
      return;
    }
    
    if (gameState.revealedFacts.includes(factIndex)) {
      // If revealing from the stack, get the position of the fact bubble
      const position = getFactBubblePosition(factIndex);
      
      set({
        cardSourcePosition: position,
        viewingFact: factIndex,
        isDrawingFromStack: false,
        isReturningToStack: false
      });
    } else {
      // Only reveal if not already revealed
      if (!gameState.revealedFacts.includes(factIndex)) {
        // Get the position of the fact bubble
        const position = getFactBubblePosition(factIndex);
        
        // First set the viewing fact to show the animation
        set({
          cardSourcePosition: position,
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
          set(state => {
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
    const { viewingFact, canRevealNewClue, gameState } = get();
    
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
        const newRevealedFacts = gameState.revealedFacts.filter(index => index !== currentViewingFact);
        
        // Update the state with the reordered facts
        set(state => ({
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
    
    try {
      const data = await verifyGuessAPI(gameState.challenge.challengeId, guess);
      
      const newGuess: UserGuess = {
        guess,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      set(state => {
        const newGuesses = [...state.gameState.guesses, newGuess];
        const newState = {
          gameState: {
            ...state.gameState,
            guesses: newGuesses,
            isGameOver: data.isCorrect
          },
          canRevealNewClue: true,
          canMakeGuess: false
        };

        if (data.isCorrect) {
          return {
            ...newState,
            isVictoryAnimationActive: true,
            victoryAnimationStep: 'bubbles',
            gameOutcome: 'standard-win'
          };
        }

        if (shouldShowFinalFive(newGuesses) && !isFinalFiveActive && !showFinalFiveTransition) {
          // First return state without showing the transition
          // to allow the sparks animation to complete
          setTimeout(() => {
            set({
              showFinalFiveTransition: true,
              finalFiveTransitionReason: 'guesses'
            });
          }, 1500); // 1.5 seconds delay to show the sparks animation
          
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
    }
  },
  
  triggerFinalFive: async () => {
    const { gameState, hardMode } = get();
    
    set({ 
      showFinalFiveTransition: true,
      isFinalFiveActive: false,
      finalFiveTimeRemaining: hardMode ? 5 : 55 // Set correct timer when Final Five is triggered
    });
    
    try {
      // First fetch the final five options
      if (gameState.challenge && !gameState.finalFiveOptions) {
        const options = await fetchFinalFiveOptionsAPI(gameState.challenge.challengeId);
        
        // Store the options in the state
        set(state => ({
          gameState: {
            ...state.gameState,
            finalFiveOptions: options
          }
        }));
      }
      
      // After the transition, load the options
      setTimeout(() => {
        set({ 
          showFinalFiveTransition: false,
          isFinalFiveActive: true 
        });
      }, 4000);
    } catch (error) {
      console.error('Error fetching Final Five options:', error);
      // Still continue with the transition even if there's an error
      setTimeout(() => {
        set({ 
          showFinalFiveTransition: false,
          isFinalFiveActive: true 
        });
      }, 4000);
    }
  },
  
  selectFinalFiveOption: async (option: string) => {
    const { gameState, finalFiveTimeRemaining } = get();
    
    if (!gameState.challenge) return;
    
    try {
      const data = await verifyGuessAPI(gameState.challenge.challengeId, option);
      
      const newGuess: UserGuess = {
        guess: option,
        isCorrect: data.isCorrect,
        timestamp: new Date(),
        isFinalFiveGuess: true
      };
      
      // If this guess was incorrect, try to find the correct answer
      let correctAnswer = '';
      if (!data.isCorrect && gameState.finalFiveOptions) {
        // First check if we already have a correct guess in our history
        const existingCorrectGuess = gameState.guesses.find(g => g.isCorrect);
        if (existingCorrectGuess) {
          correctAnswer = existingCorrectGuess.guess;
        } else {
          // We need to check all other options to find the correct one
          for (const potentialAnswer of gameState.finalFiveOptions) {
            if (potentialAnswer === option) continue; // Skip the one we just verified
            
            try {
              const result = await verifyGuessAPI(gameState.challenge.challengeId, potentialAnswer);
              if (result.isCorrect) {
                correctAnswer = potentialAnswer;
                // Add this as a "hidden" guess so it's in our guesses array
                const correctGuess: UserGuess = {
                  guess: potentialAnswer,
                  isCorrect: true,
                  timestamp: new Date(),
                  isFinalFiveGuess: true,
                  isHidden: true // Mark as hidden so it doesn't show in history
                };
                
                set(state => ({
                  gameState: {
                    ...state.gameState,
                    guesses: [...state.gameState.guesses, correctGuess]
                  }
                }));
                
                break;
              }
            } catch (error) {
              console.error(`Error verifying option ${potentialAnswer}:`, error);
            }
          }
        }
      }
      
      // Set the game state to game over and update gameOutcome
      set(state => ({
        gameState: {
          ...state.gameState,
          guesses: [...state.gameState.guesses, newGuess],
          isGameOver: true
        },
        gameOutcome: data.isCorrect ? 'final-five-win' : 'loss',
        victoryAnimationStep: data.isCorrect ? 'summary' : null, // Only set summary step if it's a win
        isVictoryAnimationActive: data.isCorrect
      }));
      
      // After a short delay, always set victoryAnimationStep to 'summary'
      // This ensures the message flows properly for both win and loss
      if (!data.isCorrect) {
        setTimeout(() => {
          set({
            victoryAnimationStep: 'summary'
          });
        }, 1500); // Delay to allow animations to complete
      }
    } catch (error) {
      console.error('Error verifying final guess:', error);
    }
  },
  
  closeFinalFive: () => {
    set(state => ({
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
      isFinalFiveActive: true
    });
  }
}),
    {
      name: 'cinco-game-storage', // Unique name for localStorage key
      partialize: (state) => ({ 
        // Only persist the hard mode setting
        isHardModeEnabled: state.isHardModeEnabled 
      }),
    }
  )
); 