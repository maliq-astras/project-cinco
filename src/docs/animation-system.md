# Animation System Documentation

## Overview

The animation system is designed to provide smooth, reusable, and performant animations throughout the application. It separates animation logic from component rendering, making components cleaner and more focused on their core responsibilities.

## Animation Hooks

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

Orchestrates the complete card flip animation sequence including:
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

## Benefits

1. **Performance Optimization**: Using `useMemo` prevents unnecessary recalculations
2. **Code Reusability**: Animation hooks can be used across different components
3. **Clean Components**: Separating animation logic makes components easier to read and maintain
4. **Consistency**: Ensures animations behave consistently throughout the application

## Principles

When creating or modifying animations:

1. **Memoize Values**: Always memoize animation settings to prevent unnecessary re-renders
2. **Separate Concerns**: Keep animation logic in hooks, separate from component rendering
3. **Use Responsive Values**: Scale animations based on viewport/container size for consistency
4. **Performance First**: Optimize animations for smooth performance on all devices 