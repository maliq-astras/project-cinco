# Project Cinco

A React-based game application built with Next.js, TypeScript, and Zustand.

## Engineering Principles

### Core Values

1. **Human Readability Over Everything**
   - Write code that is easy to understand at first glance
   - Prefer explicit, descriptive names over brevity or cleverness
   - Comments should explain "why", the code should explain "what"

2. **Simplicity First**
   - Simple solutions are easier to maintain, debug, and extend
   - Avoid premature optimization and over-engineering
   - If a feature can be implemented in a simpler way, choose that approach

3. **Separation of Concerns**
   - Components should only handle rendering
   - Business logic belongs in stores, hooks, or helper functions
   - Data fetching and manipulation should happen outside components

## Component Structure

### Component Responsibilities

Components should follow these guidelines:

1. **Render-Only Components**
   - Components should focus solely on rendering UI
   - No business logic, calculations, or data manipulation
   - No direct API calls or complex state management

2. **Props-Based API**
   - All data and handlers should be passed as props
   - Components should not access stores directly when possible
   - Props should have explicit TypeScript interfaces

3. **Container Pattern**
   - Use container components to connect UI components with data sources
   - Container components access stores and provide data to UI components
   - Example: `FactCardContainer.tsx` handles store logic, `FactCard.tsx` only renders

## State Management

### Zustand Store Organization

1. **Separate Stores by Domain**
   - `gameStateStore.ts` - Core game state
   - `uiStateStore.ts` - UI-related state
   - `timerStore.ts` - Timer functionality

2. **Store Structure**
   - State interface at the top
   - Initial state object
   - Action functions with explicit parameter types
   - Selectors for derived values

3. **Store Example**
   ```typescript
   // gameStateStore.ts
   interface GameState {
     challenge: Challenge | null;
     revealedFacts: number[];
     // other state properties...
   }

   const useGameStateStore = create<GameState & GameActions>((set, get) => ({
     // Initial state
     challenge: null,
     revealedFacts: [],

     // Actions
     revealFact: (factIndex: number) => {
       // Implementation
     },
     // other actions...
   }));
   ```

## Helper Functions

### Organization

1. **Group by Purpose**
   - Place related functions in the same file
   - Name files according to the domain they serve

2. **Pure Functions**
   - Helper functions should be pure when possible
   - Input parameters → output result with no side effects
   - Avoid modifying objects passed as parameters

3. **Naming**
   - Use verb-noun format: `calculateCardPosition`, not `cardPosition`
   - Be specific about what the function does
   - Avoid abbreviations unless universally understood

## TypeScript Practices

1. **Strong Typing**
   - Avoid `any` type - use specific types or generics
   - Define interfaces for all component props
   - Use union types for values with multiple possibilities

2. **Type Guards**
   - Use type guards to narrow types when necessary
   - Example: `function isCategoryType(value: string): value is CategoryType`

3. **Exported Types**
   - Keep all shared types in the `types` directory
   - Export types used across multiple files

## CSS and Styling

1. **CSS Variables**
   - Use CSS variables for theming and repeated values
   - Define all colors, spacing, and animations as variables

2. **Component-Specific CSS**
   - Keep styles close to the components they affect
   - Use class naming conventions to avoid conflicts

## Directory Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # UI components (rendering only)
│   ├── ui/              # Reusable UI components
│   └── game/            # Game-specific components
├── containers/          # Container components connecting UI to state
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── helpers/             # Utility functions
│   ├── animation/       # Animation utilities
│   ├── format/          # Formatting utilities
│   └── game/            # Game logic utilities
├── types/               # TypeScript type definitions
└── lib/                 # External library integrations
```

## Development Workflow

1. **Component Development Process**
   - Define the component's interface (props)
   - Create a minimal UI implementation
   - Connect to container/data sources
   - Refine and optimize

2. **Code Review Checklist**
   - Is the component focused only on rendering?
   - Are business logic and UI concerns separated?
   - Is the code easily readable and understandable?
   - Are types properly defined and used?
   - Is the solution as simple as it could be?

3. **Testing Strategy**
   - Test business logic and helper functions with unit tests
   - Test components with React Testing Library
   - Focus on behavior, not implementation details

## Examples

### Good Component Example

```tsx
// Bad approach - mixing concerns
function BadFactCard() {
  const { facts, revealedFacts } = useGameStore();
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Business logic in component
  const handleReveal = (factIndex) => {
    if (revealedFacts.length < 5) {
      revealFact(factIndex);
      setIsFlipped(true);
    }
  };
  
  return (/* JSX */);
}

// Good approach - separation of concerns
interface FactCardProps {
  fact: Fact;
  isFlipped: boolean;
  onClose: () => void;
}

function FactCard({ fact, isFlipped, onClose }: FactCardProps) {
  return (/* JSX focused on rendering */);
}

// Container handles data and logic
function FactCardContainer({ factIndex }) {
  const fact = useGameStore(state => state.challenge?.facts[factIndex]);
  const isFlipped = useUIStore(state => state.flippedCards[factIndex] || false);
  const closeCard = useUIStore(state => state.closeCard);
  
  if (!fact) return null;
  
  return <FactCard fact={fact} isFlipped={isFlipped} onClose={() => closeCard(factIndex)} />;
}
```

## Conclusion

When writing code for this project, always ask:

1. "Is this code as simple and readable as it could be?"
2. "Does this component only handle rendering?"
3. "Is business logic separated from UI concerns?"

Following these principles will create a codebase that is maintainable, scalable, and pleasant to work with.
