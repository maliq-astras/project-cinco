# Component Architecture - HARD RULES

This document establishes the **SINGLE SOURCE OF TRUTH** for component architecture in this codebase. These are **HARD RULES** - not suggestions.

## Rule #1: MAIN FILE - RENDERING LOGIC ONLY

The main component file (e.g., `ComponentName.tsx`) contains **ONLY**:
- JSX rendering logic
- Component props interface
- Minimal imports
- Zero business logic
- Zero hooks (except the main `useComponentName` hook)

```typescript
// ✅ CORRECT - ComponentName.tsx
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  const { state, actions, computed } = useComponentName({ prop1, prop2 });
  
  return (
    <div className={styles.container}>
      {/* Pure rendering logic only */}
    </div>
  );
}

// ❌ WRONG - NO business logic in main file
export default function ComponentName({ prop1 }: ComponentProps) {
  const [state, setState] = useState(); // ❌ NO direct hooks
  const computed = useMemo(() => /* logic */, []); // ❌ NO business logic
  // ...
}
```

## Rule #2: HOOK STRUCTURE - ALWAYS UNIFORM

**EVERY component gets a `hooks/` folder structure - NO EXCEPTIONS.**

```
ComponentName/
├── ComponentName.tsx          # Main component (rendering only)
├── ComponentName.module.css   # CSS Module
├── hooks/
│   ├── index.ts              # Main useComponentName (orchestrator)
│   ├── useComponentState.ts  # State management
│   ├── useComponentEvents.ts # Event handlers
│   └── useComponentLogic.ts  # Business logic
└── helpers/
    ├── index.ts              # Main helper exports (orchestrator)
    ├── calculations.ts       # Math/computation helpers
    ├── formatting.ts         # Data formatting helpers
    └── validation.ts         # Input validation helpers
```

### 2A: The Orchestrator Pattern

Every `hooks/index.ts` exports the main hook that composes all sub-hooks:

```typescript
// hooks/index.ts - ALWAYS follows this pattern
export const useComponentName = (props?: ComponentProps) => {
  const state = useComponentState(props);
  const events = useComponentEvents(state);
  const logic = useComponentLogic(state, events);
  
  return { 
    ...state, 
    ...events, 
    ...logic 
  };
};
```

### 2B: Hook Separation Rules

- **`useComponentState.ts`**: useState, useRef, state management
- **`useComponentEvents.ts`**: Event handlers, callbacks, user interactions  
- **`useComponentLogic.ts`**: Business logic, computed values, side effects
- **Additional hooks**: Create as needed (`useComponentAPI.ts`, `useComponentAnimation.ts`, etc.)

## Rule #3: HELPERS STRUCTURE - ALWAYS UNIFORM

**EVERY component gets a `helpers/` folder structure - NO EXCEPTIONS.**

```
helpers/
├── index.ts              # Main helper exports (orchestrator)
├── calculations.ts       # Math/computation helpers
├── formatting.ts         # Data formatting helpers  
├── validation.ts         # Input validation helpers
├── styles.ts             # Style calculations, CSS logic
└── dom.ts                # DOM manipulation, measurements
```

### 3A: The Helper Orchestrator Pattern

Every `helpers/index.ts` exports all helper functions from sub-files:

```typescript
// helpers/index.ts - ALWAYS follows this pattern
export * from './calculations';
export * from './formatting';
export * from './validation';
export * from './styles';
export * from './dom';
```

### 3B: Helper Separation Rules

- **`calculations.ts`**: Math, algorithms, computations, business calculations
- **`formatting.ts`**: Data transformations, string formatting, display logic
- **`validation.ts`**: Input validation, type guards, data verification  
- **`styles.ts`**: Style calculations, CSS computations, responsive logic
- **`dom.ts`**: DOM measurements, element positioning, browser APIs
- **Additional helpers**: Create as needed (`api.ts`, `utils.ts`, etc.)

### 3C: Shared vs Component-Specific Rules

- **Component-specific utilities**: `ComponentName/helpers/`
- **Shared utilities** (used by 2+ components): `/src/utils/utilityName.ts`
- **NO monolithic utility files** with single-use functions

## Rule #4: CSS MODULE - ALL STATIC STYLES

The CSS module handles **ALL** static styling:

```css
/* ComponentName.module.css - ALL static styles here */
.container {
  display: flex;
  padding: 1rem;
  /* All static CSS properties */
}

.button {
  background: var(--color-primary);
  /* Use CSS variables for dynamic theming */
}
```

### 4A: Dynamic Styles Rules

- **Static styles**: CSS Module only
- **Dynamic styles**: Inline styles with CSS variables
- **Theme colors**: Use CSS variables (`var(--color-primary)`)

```typescript
// ✅ CORRECT - Dynamic styles with CSS variables
<div 
  className={styles.container}
  style={{ '--dynamic-color': `var(--color-${color})` }}
/>

// ❌ WRONG - Static styles inline
<div style={{ display: 'flex', padding: '1rem' }} />
```

## Rule #5: SHARED VS COMPONENT-SPECIFIC LOGIC

### Shared Logic (in `/src/utils/`)
- Utilities used by **2+ components**
- Theme utilities (`getColorVar`)
- Layout utilities (`shouldShowGameControls`)

### Component-Specific Logic (in `helpers.ts`)
- Utilities used by **only 1 component**
- Component-specific calculations
- Component-specific formatting

## Rule #6: TYPING & INTERFACES

### Component-Specific Types
```typescript
// ✅ CORRECT - In main component file
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}
```

### Shared Types
```typescript
// ✅ CORRECT - In /src/types/
export interface MenuItem {
  label: string;
  onClick: () => void;
}
```

## Rule #7: CONSTANTS & CONFIGURATION

All constants live in `/src/constants/` with specific files:

- **`/src/constants/animations.ts`**: Animation configurations, transitions, easing
- **`/src/constants/breakpoints.ts`**: Responsive breakpoints, layout thresholds  
- **`/src/constants/colors.ts`**: Color definitions, theme mappings
- **`/src/constants/timeouts.ts`**: Debounce delays, timer values, intervals
- **`/src/constants/sizes.ts`**: Fixed sizing values, dimensions, spacing
- **`/src/constants/zIndex.ts`**: Z-index layering system, modal stacking

```typescript
// ✅ CORRECT - Shared constants
import { ANIMATIONS } from '@/constants/animations';
import { BREAKPOINTS } from '@/constants/breakpoints';

// ❌ WRONG - Component-specific constants in shared files
// Keep component-specific constants in helpers.ts
```

## Rule #8: NAMING CONVENTIONS

### File Structure
- **Component folder**: `ComponentName/` (PascalCase)
- **Main file**: `ComponentName.tsx` 
- **Hook main file**: `hooks/index.ts`
- **Hook sub-files**: `useComponentConcern.ts`
- **Helpers**: `helpers.ts` (not `componentNameHelpers.ts`)
- **Styles**: `ComponentName.module.css`

### Import Grouping
```typescript
// ✅ CORRECT - Import order
import React from 'react';                    // React/Next
import { motion } from 'framer-motion';       // External libraries
import { getColorVar } from '@/utils/theme';  // Internal utilities  
import { useComponentName } from './hooks';   // Component-specific
```

## Rule #9: IMPORTS & DEPENDENCIES

- **Remove unused imports immediately** - zero tolerance
- **Group imports** by type (React → External → Internal → Component)
- **Use absolute imports** for shared utilities (`@/utils/`)
- **Use relative imports** for component-specific files (`./hooks`)

## Rule #10: PERFORMANCE RULES

### Required Optimizations
- **`React.memo`** for all components that receive props
- **`useMemo`** for expensive computations (>10 lines of logic)
- **`useCallback`** for event handlers passed to child components
- **No inline object/array creation** in render methods

```typescript
// ✅ CORRECT - Optimized component
export default React.memo(function ComponentName({ prop1 }: Props) {
  const { optimizedData } = useComponentName({ prop1 });
  return <div>{optimizedData}</div>;
});

// ❌ WRONG - Unoptimized
export default function ComponentName({ prop1 }: Props) {
  return <div onClick={() => console.log('inline')}>{prop1}</div>;
}
```

---

## Architecture Summary

```
ComponentName/
├── ComponentName.tsx          # Rule 1: Rendering only
├── ComponentName.module.css   # Rule 4: All static CSS
├── hooks/                     # Rule 2: Always uniform structure
│   ├── index.ts              # Main orchestrator
│   ├── useComponentState.ts  # State management
│   ├── useComponentEvents.ts # Event handlers
│   └── useComponentLogic.ts  # Business logic
└── helpers/                   # Rule 3: Always uniform structure
    ├── index.ts              # Main orchestrator
    ├── calculations.ts       # Math/computation helpers
    ├── formatting.ts         # Data formatting helpers
    ├── validation.ts         # Input validation helpers
    ├── styles.ts             # Style calculations
    └── dom.ts                # DOM manipulation
```

**These rules are MANDATORY. No exceptions. No shortcuts. This ensures:**
- ✅ Consistent codebase structure
- ✅ Easy onboarding for new developers  
- ✅ Predictable file locations
- ✅ Separation of concerns
- ✅ Maintainable, scalable architecture