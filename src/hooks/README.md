# Hooks Directory Structure

This directory is organized to scale with the growing complexity of the application by categorizing hooks based on their purpose and relationship to components.

## Directory Structure

```
hooks/
├── animation/    # Animation-specific hooks
├── card/         # Card-related hooks
├── components/   # Component-specific hooks
│   ├── factCard/
│   ├── guessProgressBar/
│   └── iconContainer/
├── shared/       # Hooks shared across multiple features
├── ui/           # General UI hooks
└── index.ts      # Main barrel file
```

## Import Patterns

### Recommended Import Pattern

When importing hooks, use the barrel files to keep imports clean:

```typescript
// Import from component-specific hooks
import { useFactCard } from '../hooks/components/factCard';
import { useGuessProgressBar } from '../hooks/components/guessProgressBar';

// Import from animation hooks
import { useCardAnimations, useSpark } from '../hooks/animation';

// Import from card hooks
import { useCardFlip, useResponsiveCard } from '../hooks/card';
```

### Using the Main Barrel File

For broader imports, you can use the main barrel file:

```typescript
import { 
  // Component hooks
  useFactCard,
  useGuessProgressBar,
  
  // Animation hooks
  useCardAnimations,
  
  // Card hooks
  useResponsiveCard
} from '../hooks';
```

## Hook Categories

### Component Hooks

Each component should have a main hook that encapsulates all its logic:

- `useFactCard`: Main hook for the FactCard component
- `useGuessProgressBar`: Main hook for the GuessProgressBar component

### Animation Hooks

Reusable hooks for handling animations:

- `useCardAnimations`: Animation settings for card elements
- `useSparkAnimation`: Spark particle animations
- `useMemoizedFlipTransition`: 3D flip animations

### Card Hooks

Hooks specific to card functionality:

- `useCardFlip`: Card flip animation sequence
- `useCardStack`: Card stack management
- `useResponsiveCard`: Responsive card sizing

## Adding New Hooks

When adding new hooks:

1. Determine the appropriate category
2. Place the hook in the corresponding directory
3. Export it from the directory's barrel file (index.ts)
4. If it's a component's main hook, create a new directory if needed

This structure keeps the codebase organized as it grows and makes imports cleaner. 