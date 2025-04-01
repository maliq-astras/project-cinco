# GuessProgressBar Architecture

## Overview

The GuessProgressBar component displays a progress indicator for game guesses with smooth animations and interactive feedback. It follows the pattern established by the FactCard component with clean separation of concerns.

## Component Structure

### Main Component
`GuessProgressBar` is a purely presentational component that:
- Uses a comprehensive hook for all logic and state
- Contains no direct React hook calls
- Renders the progress bar with animated segments
- Displays spark animations when maximum guesses are reached

### Custom Hooks

#### `useGuessProgressBar`
Comprehensive hook that manages all logic for the GuessProgressBar:
- Centralizes all state and calculations
- Composes other specialized hooks
- Returns all data needed for rendering the component
- Manages styles, animations, and segments

#### `useGuessProgress`
Manages the core state and logic for progress tracking:
- Tracks wrong guess count
- Manages animation states (animatedCount, isShaking, showSparks)
- Triggers toast notifications for wrong guesses
- Coordinates animation timing

#### `useSparkAnimation`
Handles the spark animation configuration:
- Generates random spark particles with appropriate properties
- Provides memoized animation settings for spark container and effects
- Creates optimized animation sequences for visual feedback

#### `useSpark`
Focused on individual spark particle animations:
- Creates memoized styles for each spark
- Handles individual spark animation properties
- Ensures smooth animations with optimized render cycles

### Helpers

#### `guessProgressBarHelpers.ts`
Pure utility functions that:
- Generate gradient background styles
- Create shadow styles
- Handle toast notifications

### Styles

#### `guessProgressBarStyles.ts`
Contains:
- Extracted Tailwind CSS classes
- Animation settings
- Transition timing configurations

## Component Flow

1. User makes a guess → Game store updates
2. useGuessProgressBar receives state from store
3. useGuessProgress tracks wrong guesses and manages animations
4. Progress bar animates new segment with staggered timing
5. On final guess, spark animation is triggered via useSparkAnimation
6. Animations complete with smooth transitions

## Optimization Techniques

- Memoized styles and animations prevent unnecessary re-renders
- Animation logic isolated in hooks for reusability
- Pure CSS classes extracted to style constants
- Helper functions separated from component logic
- Zero direct hook calls in the component 