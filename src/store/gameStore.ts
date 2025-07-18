import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserGuess, GameOutcome } from '../types/index';
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
  isPendingFinalFiveTransition: boolean;
  isProcessingGuess: boolean;
  hasMadeGuess: boolean;
  
  // Hard mode settings
  hardMode: boolean;
  isHardModeEnabled: boolean;
  setHardModeEnabled: (enabled: boolean) => void;
  
  // Streak tracking
  currentStreak: number;
  weeklyCompletions: ('completed' | 'failed' | 'missed' | null)[]; // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  lastCompletionDate: string | null; // ISO date string
  updateStreak: () => void;
  trackFailedAttempt: () => void;
  resetWeeklyStreak: () => void;
  updateMissedDays: () => void;
  hasPlayedToday: () => boolean;
  
  // Today's game data for persistence
  todayGameData: {
    outcome: GameOutcome;
    correctAnswer: string;
    numberOfTries: number;
    timeSpent: number;
    completionDate: string; // ISO date string
  } | null;
  todayChallenge: any | null; // Store the challenge data for AnswerDetailsModal
  saveTodayGameData: (outcome: GameOutcome, correctAnswer: string, numberOfTries: number, timeSpent: number, challenge: any) => void;
  clearTodayGameData: () => void;
  
  // Final Five specific state
  finalFiveTimeRemaining: number;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  finalFiveTransitionReason: 'time' | 'guesses' | null;
  finalFiveError: string | null;
  isFetchingFinalFiveOptions: boolean;
  
  // UI and animation states
  hoveredFact: number | null;
  viewingFact: number | null;
  cardSourcePosition: { x: number, y: number } | null;
  isDrawingFromStack: boolean;
  isReturningToStack: boolean;
  isCardAnimatingOut: boolean;
  shouldFocusInput: boolean;
  windowWidth: number;
  isSettingsPanelOpen: boolean;
  isTutorialOpen: boolean;
  shouldPauseTimer: boolean;
  scaleFactor: number;
  
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
  setScaleFactor: (factor: number) => void;
  
  // Game logic actions
  fetchChallenge: (language: string) => Promise<void>;
  revealFact: (factIndex: number) => void;
  handleCardClick: (factIndex: number, sourcePosition: { x: number, y: number }) => void;
  closeFactCard: () => void;
  completeCardAnimation: () => void;
  submitGuess: (guess: string) => Promise<void>;
  triggerFinalFive: () => Promise<void>;
  prefetchFinalFiveOptions: () => Promise<void>;
  selectFinalFiveOption: (option: string) => Promise<void>;
  closeFinalFive: () => void;
  startFinalFive: () => void;
  resetFinalFiveError: () => void;
  
  // Settings controls
  setSettingsPanelOpen: (isOpen: boolean) => void;
  setTutorialOpen: (isOpen: boolean) => void;
  
  // Helper function to filter out previous guesses from Final Five options
  filterFinalFiveOptions: () => void;
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
  isPendingFinalFiveTransition: false,
  isProcessingGuess: false,
  hasMadeGuess: false,
  
  // Hard mode settings
  hardMode: false, // Current game's hard mode state (can't be changed after start)
  isHardModeEnabled: false, // Setting that can be toggled before game starts
  
  // Streak tracking
  currentStreak: 0,
  weeklyCompletions: [null, null, null, null, null, null, null], // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  lastCompletionDate: null,
  
  // Today's game data for persistence
  todayGameData: null,
  todayChallenge: null,
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
  finalFiveError: null,
  isFetchingFinalFiveOptions: false,
  
  // UI and animation states
  hoveredFact: null,
  viewingFact: null,
  cardSourcePosition: null,
  isDrawingFromStack: false,
  isReturningToStack: false,
  isCardAnimatingOut: false,
  shouldFocusInput: false,
  windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
  isSettingsPanelOpen: false,
  isTutorialOpen: false,
  shouldPauseTimer: false,
  scaleFactor: 1, // Default scale factor (1 = 100%)
  
  // Victory animation states
  isVictoryAnimationActive: false,
  victoryAnimationStep: null,
  gameOutcome: null,
  
  // Basic setters
  setWindowWidth: (width: number) => set({ windowWidth: width }),
  setScaleFactor: (factor: number) => set({ scaleFactor: factor }),
  decrementTimer: () => {
    const { 
      timeRemaining, 
      isTimerActive, 
      gameState, 
      isFinalFiveActive, 
      showFinalFiveTransition, 
      viewingFact,
      isSettingsPanelOpen,
      shouldPauseTimer,
      isProcessingGuess
    } = get();
    
    // Don't decrement if timer should be paused (e.g., during tutorial or guess verification)
    if (shouldPauseTimer || isProcessingGuess) return;
    
    if (isTimerActive) {
      if (timeRemaining <= 1 && !isFinalFiveActive && !showFinalFiveTransition && !gameState.isGameOver) {
        // First close any open fact card if there is one
        if (viewingFact !== null) {
          // Force close the card without animation
          set({
            viewingFact: null,
            cardSourcePosition: null,
            isDrawingFromStack: false,
            isReturningToStack: false,
            isCardAnimatingOut: false
          });
        }
        
        // Close settings panel if it's open
        if (isSettingsPanelOpen) {
          set({ isSettingsPanelOpen: false });
        }
        
        // Then start the Final Five transition
        set({ 
          timeRemaining: 0,
          showFinalFiveTransition: true,
          finalFiveTransitionReason: 'time',
          isTimerActive: false, // Stop the main timer
          isPendingFinalFiveTransition: true // Prevent further interactions
        });

        // Prefetch final five options as soon as transition starts
        // This is a good time to prefetch because we know no more guesses will be made
        console.log('Time ran out - prefetching Final Five options');
        get().prefetchFinalFiveOptions();
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }
  },
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
  fetchChallenge: async (language: string = 'en') => {
    try {
      const challenge = await fetchChallengeAPI(language);
      
      // Update missed days and clear stale data before checking if user has played today
      get().updateMissedDays();
      
      // Check if user has already played today
      const hasPlayedToday = get().hasPlayedToday();
      
      console.log('fetchChallenge - hasPlayedToday result:', hasPlayedToday);
      
      if (hasPlayedToday) {
        console.log('User has already played, showing end game screen');
        const { todayGameData, todayChallenge } = get();
        
        // Use saved game data if available for full endgame experience
        if (todayGameData && todayChallenge) {
          console.log('Using saved game data for full endgame experience');
          set(state => ({
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
        console.log('No saved game data found, using basic status');
        const today = new Date();
        const dayOfWeek = today.getDay();
        const { weeklyCompletions } = get();
        const todayStatus = weeklyCompletions[dayOfWeek];
        
        // Determine the game outcome based on today's status
        const gameOutcome = todayStatus === 'completed' ? 'standard-win' : 'loss-final-five-wrong';
        
        set(state => ({
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
    
    // Special case for skipped guesses - handle immediately without API call or minimum loading time
    if (guess === "___SKIPPED___") {
      const newGuess: UserGuess = {
        guess,
        isCorrect: false,
        timestamp: new Date()
      };
      
      set(state => {
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
            console.log('Reached 5 guesses - prefetching Final Five options');
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
      
      set(state => {
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
            console.log('Reached 5 guesses - prefetching Final Five options');
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
        .filter(g => !g.isCorrect && g.guess !== "___SKIPPED___")
        .map(g => g.guess);
      
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
              console.log(`Retry ${attempt + 1}/3 for Final Five options...`);
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
        set(state => ({
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
      set(state => ({
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
          .filter(g => !g.isCorrect && g.guess !== "___SKIPPED___")
          .map(g => g.guess);
          
        console.log('Sending guesses to Final Five API:', previousGuesses);
        
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
          set(state => ({
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
        const existingCorrectGuess = gameState.guesses.find(g => g.isCorrect);
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
            set(state => ({
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
            set(state => ({
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
      set(state => ({
        gameState: {
          ...state.gameState,
          guesses: [...state.gameState.guesses, newGuess],
          isGameOver: data.isCorrect
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
          set({ victoryAnimationStep: 'summary' });
        }, 1500);
      }
    } catch (error) {
      console.error('Error verifying Final Five guess:', error);
      // Wait for the minimum loading time before resetting processing state
      await minimumLoadingTime;
      set({ isProcessingGuess: false });
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
      isFinalFiveActive: true,
      isPendingFinalFiveTransition: false // Reset the pending state
    });
  },
  
  // Add methods to control the settings panel and tutorial
  setSettingsPanelOpen: (isOpen: boolean) => set({ isSettingsPanelOpen: isOpen }),
  setTutorialOpen: (isOpen: boolean) => {
    // Always set both states to the same value
    set({ 
      isTutorialOpen: isOpen,
      shouldPauseTimer: isOpen
    });
  },
  
  // Add a reset error method
  resetFinalFiveError: () => {
    set({ finalFiveError: null });
  },
  
  // Streak tracking methods
  updateStreak: () => {
    console.log('updateStreak called!');
    
    // First, mark any missed days before processing current day
    get().updateMissedDays();
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    const { lastCompletionDate, weeklyCompletions, currentStreak } = get();
    
    console.log('updateStreak debug:', {
      today,
      dayOfWeek,
      lastCompletionDate,
      weeklyCompletions,
      currentStreak
    });
    
    // Check if already completed today
    if (lastCompletionDate === today) {
      console.log('Already completed today, skipping updateStreak');
      return; // Already completed today
    }
    
    // Check if it's a new week (Sunday) - reset if so
    if (dayOfWeek === 0) {
      const newWeeklyCompletions: ('completed' | 'failed' | 'missed' | null)[] = [null, null, null, null, null, null, null];
      newWeeklyCompletions[0] = 'completed'; // Mark Sunday as completed
      
      set({
        weeklyCompletions: newWeeklyCompletions,
        lastCompletionDate: today,
        currentStreak: 1
      });
      return;
    }
    
    // Check if this is consecutive from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const newWeeklyCompletions = [...weeklyCompletions];
    newWeeklyCompletions[dayOfWeek] = 'completed';
    
    let newStreak = currentStreak;
    
    // If last completion was yesterday, increment streak
    if (lastCompletionDate === yesterdayStr) {
      newStreak = currentStreak + 1;
    } else {
      // Check if there's a gap in this week
      let hasGap = false;
      for (let i = 0; i < dayOfWeek; i++) {
        if (newWeeklyCompletions[i] !== 'completed') {
          hasGap = true;
          break;
        }
      }
      
      if (hasGap) {
        // Start fresh streak when there's a gap
        newStreak = 1;
      } else {
        // Continue streak if no gap
        newStreak = currentStreak + 1;
      }
    }
    

    
    console.log('updateStreak setting:', {
      weeklyCompletions: newWeeklyCompletions,
      lastCompletionDate: today,
      currentStreak: newStreak
    });
    
    set({
      weeklyCompletions: newWeeklyCompletions,
      lastCompletionDate: today,
      currentStreak: newStreak
    });
  },
  
  resetWeeklyStreak: () => {
    set({
      weeklyCompletions: [null, null, null, null, null, null, null],
      currentStreak: 0
    });
  },
  
  trackFailedAttempt: () => {
    // First, mark any missed days before processing current day
    get().updateMissedDays();
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay();
    
    const { lastCompletionDate, weeklyCompletions } = get();
    
    // Check if already completed or failed today
    if (lastCompletionDate === today) {
      return; // Already processed today
    }
    
    const newWeeklyCompletions = [...weeklyCompletions];
    newWeeklyCompletions[dayOfWeek] = 'failed';
    
    set({
      weeklyCompletions: newWeeklyCompletions,
      lastCompletionDate: today,
      currentStreak: 0 // Failed attempts break the streak
    });
  },
  
  updateMissedDays: () => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const today = now.toISOString().split('T')[0];
    
    const { weeklyCompletions, currentStreak, todayGameData } = get();
    const newWeeklyCompletions = [...weeklyCompletions];
    let hasChanges = false;
    
    // Clear today's game data if it's from a previous day
    if (todayGameData && todayGameData.completionDate !== today) {
      console.log('Clearing stale game data from previous day');
      get().clearTodayGameData();
    }
    
    // Mark all days from Sunday to yesterday as missed if they're null
    for (let i = 0; i < currentDayOfWeek; i++) {
      if (newWeeklyCompletions[i] === null) {
        newWeeklyCompletions[i] = 'missed';
        hasChanges = true;
      }
    }
    
    // Only update the weeklyCompletions if there were changes
    // Don't reset streak if today is already completed
    if (hasChanges) {
      const todayCompleted = newWeeklyCompletions[currentDayOfWeek] === 'completed';
      
      set({
        weeklyCompletions: newWeeklyCompletions,
        // Only reset streak if today is not completed
        currentStreak: todayCompleted ? Math.max(currentStreak, 1) : 0
      });
    }
  },
  
  hasPlayedToday: () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay();
    
    const { lastCompletionDate, weeklyCompletions } = get();
    
    console.log('Debug hasPlayedToday:', {
      today,
      dayOfWeek,
      lastCompletionDate,
      weeklyCompletions,
      todayStatus: weeklyCompletions[dayOfWeek]
    });
    
    // Check if last completion was today
    if (lastCompletionDate === today) {
      console.log('Already played today - lastCompletionDate matches');
      return true;
    }
    
    // Check if today's slot in weeklyCompletions is marked as completed or failed
    // BUT only if we actually played TODAY (not just this day of week)
    const todayStatus = weeklyCompletions[dayOfWeek];
    const playedThisDayOfWeek = todayStatus === 'completed' || todayStatus === 'failed';
    const actuallyPlayedToday = playedThisDayOfWeek && lastCompletionDate === today;
    
    console.log('hasPlayedToday result:', actuallyPlayedToday);
    return actuallyPlayedToday;
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
  },

  // Helper function to filter out previous guesses from Final Five options
  filterFinalFiveOptions: () => {
    const { gameState } = get();
    
    // If no options or no challenge, nothing to do
    if (!gameState.finalFiveOptions || !gameState.challenge) return;
    
    // Get previous guesses (excluding skipped ones)
    const previousGuesses = gameState.guesses
      .filter(g => !g.isCorrect && g.guess !== "___SKIPPED___")
      .map(g => g.guess.toLowerCase().trim());
    
    // Only proceed if we have guesses to filter out
    if (previousGuesses.length === 0) return;
    
    console.log('Filtering out previous guesses:', previousGuesses);
    
    // Normalize options and guesses for comparison (lowercase, trim whitespace)
    // We'll need to keep the original options for the final result
    const normalizedOptionMap = new Map();
    gameState.finalFiveOptions.forEach(option => {
      normalizedOptionMap.set(option.toLowerCase().trim(), option);
    });
    
    // Remove any options that match previous guesses
    previousGuesses.forEach(guess => {
      normalizedOptionMap.delete(guess);
    });
    
    // Convert back to array
    const filteredOptions = Array.from(normalizedOptionMap.values());
    
    // If we have at least 5 options after filtering, update the options
    if (filteredOptions.length >= 5) {
      console.log(`Filtered Final Five options: ${filteredOptions.length} options remain`);
      set(state => ({
        gameState: {
          ...state.gameState,
          finalFiveOptions: filteredOptions
        }
      }));
    } else {
      console.log(`Too few options after filtering (${filteredOptions.length}), keeping original set`);
    }
  }
}),
    {
      name: 'cinco-game-storage', // Unique name for localStorage key
      version: 1, // Version for handling data migrations
      partialize: (state) => ({ 
        // Only persist the hard mode setting and streak data
        isHardModeEnabled: state.isHardModeEnabled,
        currentStreak: state.currentStreak,
        weeklyCompletions: state.weeklyCompletions,
        lastCompletionDate: state.lastCompletionDate,
        // Persist today's game data for full endgame experience on refresh
        todayGameData: state.todayGameData,
        todayChallenge: state.todayChallenge
      }),
      migrate: (persistedState: any, version: number) => {
        // Migration from version 0 to 1: convert boolean[] to new format
        if (version === 0) {
          const oldCompletions = persistedState.weeklyCompletions;
          if (Array.isArray(oldCompletions) && oldCompletions.length === 7) {
            // Convert boolean array to new format
            const newCompletions = oldCompletions.map((completed: boolean) => 
              completed ? 'completed' : null
            );
            return {
              ...persistedState,
              weeklyCompletions: newCompletions
            };
          }
        }
        return persistedState;
      },
    }
  )
); 