# Animation System Documentation

## Overview

The animation system is designed to provide smooth, reusable, and performant animations throughout the application. It separates animation logic from component rendering, making components cleaner and more focused on their core responsibilities.

## Component Structure

All components follow a consistent pattern where:

1. Components focus solely on rendering UI
2. All logic, state, and calculations are handled by custom hooks
3. Styles are extracted to dedicated style files
4. Components receive data through props or custom hooks

## Animation Hooks

### `useFactCard`

Comprehensive hook that orchestrates all logic for the FactCard component:

```typescript
const { 
  cardRef,
  isFlipped,
  isDrawn,
  cardStyles,
  // ...and more
} = useFactCard({ fact, visibleStackCount });
```

- **Inputs**: Fact data and stack information
- **Outputs**: All state, references, styles, and handlers needed for the card

### `useGuessProgressBar`

Comprehensive hook that manages all logic for the GuessProgressBar component:

```typescript
const {
  animatedCount,
  showSparks,
  sparks,
  gradientStyle,
  segments,
  // ...and more
} = useGuessProgressBar();
```

- **Inputs**: Optional maxGuesses count
- **Outputs**: Animation states, styles, and segment data for rendering

### `useResponsiveCard`

Handles responsive sizing of card elements based on the container size:

```typescript
const { iconSize } = useResponsiveCard(cardRef);
```

- **Inputs**: React ref to the card container
- **Outputs**: Calculated sizes for various card elements

### `useCardAnimations`

Provides reusable animation settings for card UI elements:

```typescript
const { 
  closeButtonAnimations,
  closeButtonIconAnimations, 
  colorStyle, 
  strokeStyle 
} = useCardAnimations({ primaryColor: colors.primary });
```

- **Inputs**: Primary color for animations
- **Outputs**: Memoized animation objects and styles that can be spread directly into motion components

### `useMemoizedFlipTransition`

Creates optimized settings for 3D card flip animations:

```typescript
const flipTransition = useMemoizedFlipTransition({
  stiffness: 70,
  damping: 15,
  duration: 0.9
});
```

- **Inputs**: Custom stiffness, damping, and duration values (all optional)
- **Outputs**: Memoized transition settings for flip animations

### `useCardTransition`

Handles transition animations for card movement:

```typescript
const cardTransition = useCardTransition({
  isDrawingFromSource: !!sourcePosition,
  isReturning: isClosing
});
```

- **Inputs**: Animation state flags, optional custom duration and easing
- **Outputs**: Memoized transition settings for card animations

### `useCardFlip`

Orchestrates the card flip animation sequence including:
- Drawing cards from a source
- 3D flipping
- Returning cards to their origin
- Handling interaction events

```typescript
const {
  isFlipped,
  isDrawn,
  isClosing,
  canClose,
  handleClose,
  handleAnimationComplete,
  initialAnimation,
  cardAnimation,
  cardTransition,
  flipTransition
} = useCardFlip({ sourcePosition, visibleStackCount });
```

### `useGuessProgress`

Tracks and manages the progress of user guesses:
- Counts incorrect guesses
- Manages animation states for progressbar
- Handles shake animations and toast notifications

### `useSparkAnimation`

Generates and animates spark particles for visual feedback:
- Creates randomized spark configurations
- Manages animation settings for container and sparks
- Provides consistent spark animations

### `useFactCardBack` and `useFactCardBackIcon`

Dedicated hooks for managing the card back components, handling all logic and styles.

## Benefits

1. **Performance Optimization**: Using `useMemo` prevents unnecessary recalculations
2. **Code Reusability**: Animation hooks can be used across different components
3. **Clean Components**: Separating animation logic makes components easier to read and maintain
4. **Consistency**: Ensures animations behave consistently throughout the application
5. **Zero Direct Hook Calls**: Components contain no direct calls to React hooks

## Principles

When creating or modifying animations:

1. **Memoize Values**: Always memoize animation settings to prevent unnecessary re-renders
2. **Separate Concerns**: Keep animation logic in hooks, separate from component rendering
3. **Use Responsive Values**: Scale animations based on viewport/container size for consistency
4. **Performance First**: Optimize animations for smooth performance on all devices
5. **Consistent Pattern**: Follow the established pattern of moving all logic to custom hooks 