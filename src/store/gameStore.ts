import { create } from 'zustand';
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

interface GameStore {
  // Core game state
  gameState: GameState;
  timeRemaining: number;
  isTimerActive: boolean;
  hasSeenClue: boolean;
  canRevealNewClue: boolean;
  canMakeGuess: boolean;
  lastRevealedFactIndex: number | null;
  
  // UI and animation states
  hoveredFact: number | null;
  viewingFact: number | null;
  cardSourcePosition: { x: number, y: number } | null;
  isDrawingFromStack: boolean;
  isReturningToStack: boolean;
  isCardAnimatingOut: boolean;
  windowWidth: number;
  
  // Computed values should not be in the store interface
  
  // Actions
  setWindowWidth: (width: number) => void;
  decrementTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;
  setHoveredFact: (factIndex: number | null) => void;
  
  // Game logic actions
  fetchChallenge: () => Promise<void>;
  revealFact: (factIndex: number) => void;
  handleCardClick: (factIndex: number, sourcePosition: { x: number, y: number }) => void;
  closeFactCard: () => void;
  completeCardAnimation: () => void;
  submitGuess: (guess: string) => Promise<void>;
  triggerFinalFive: () => Promise<void>;
  selectFinalFiveOption: (option: string) => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: initialGameState,
  timeRemaining: 300, // 5 minutes
  isTimerActive: false,
  hasSeenClue: false,
  canRevealNewClue: true,
  canMakeGuess: false,
  lastRevealedFactIndex: null,
  
  // UI and animation states
  hoveredFact: null,
  viewingFact: null,
  cardSourcePosition: null,
  isDrawingFromStack: false,
  isReturningToStack: false,
  isCardAnimatingOut: false,
  windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
  
  // Basic setters
  setWindowWidth: (width: number) => set({ windowWidth: width }),
  decrementTimer: () => {
    const { timeRemaining, triggerFinalFive, isTimerActive } = get();
    
    // Only decrement if timer is active
    if (isTimerActive) {
      if (timeRemaining <= 1) {
        set({ timeRemaining: 0 });
        triggerFinalFive();
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }
  },
  startTimer: () => set({ isTimerActive: true }),
  resetTimer: () => set({ timeRemaining: 300, isTimerActive: false }),
  setHoveredFact: (factIndex: number | null) => set({ hoveredFact: factIndex }),
  
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
    const { isTimerActive, hasSeenClue } = get();
    
    set({
      isCardAnimatingOut: true,
      isReturningToStack: true,
      hasSeenClue: true
    });
    
    // Start the timer on first clue close if not already started
    if (!isTimerActive && !hasSeenClue) {
      set({ isTimerActive: true });
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
        }, 600); // Increased to match the longer animation duration
      }, 150);
    }, 300); // Increased delay to match the longer animation duration
  },
  
  submitGuess: async (guess: string) => {
    const { gameState, triggerFinalFive, hasSeenClue, canMakeGuess } = get();
    
    if (!gameState.challenge) return;
    if (!hasSeenClue) return; // Can't guess without seeing a clue
    if (!canMakeGuess) return; // Can't guess twice without revealing a new fact
    
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
          // After guessing, allow revealing a new clue
          canRevealNewClue: true,
          // Disable making another guess until they reveal a new fact
          canMakeGuess: false
        };
        
        // If not correct, check if we've reached the maximum number of wrong guesses
        if (!data.isCorrect && shouldShowFinalFive(newGuesses)) {
          // Trigger final five in the next tick to allow state to update first
          setTimeout(() => triggerFinalFive(), 0);
        }
        
        return newState;
      });
    } catch (error) {
      console.error('Error verifying guess:', error);
    }
  },
  
  triggerFinalFive: async () => {
    const { gameState } = get();
    
    if (!gameState.challenge) return;
    
    try {
      const options = await fetchFinalFiveOptionsAPI(gameState.challenge.challengeId);
      set(state => ({
        gameState: {
          ...state.gameState,
          finalFiveOptions: options
        }
      }));
    } catch (error) {
      console.error('Error fetching final five options:', error);
    }
  },
  
  selectFinalFiveOption: async (option: string) => {
    const { gameState } = get();
    
    if (!gameState.challenge) return;
    
    try {
      const data = await verifyGuessAPI(gameState.challenge.challengeId, option);
      
      const newGuess: UserGuess = {
        guess: option,
        isCorrect: data.isCorrect,
        timestamp: new Date()
      };
      
      set(state => ({
        gameState: {
          ...state.gameState,
          guesses: [...state.gameState.guesses, newGuess],
          isGameOver: true,
          finalFiveOptions: null
        }
      }));
    } catch (error) {
      console.error('Error verifying final guess:', error);
    }
  }
})); 