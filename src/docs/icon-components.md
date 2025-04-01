# Icon Component Architecture

## Overview

The icon system in the application provides a consistent way to display and style icons throughout the UI. The architecture follows the same clean patterns established in the FactCard and GuessProgressBar components.

## Components

### IconContainer

The `IconContainer` is a versatile component used for displaying fact type icons with consistent styling and behavior:

- Renders circular icon containers with appropriate sizing
- Handles light/dark mode variations
- Supports revealed/hidden states
- Applies category-specific filtering

### FactCardBackIcon

A specialized icon component specifically for the back of fact cards:

- Displays white icons on colored card backgrounds
- Uses larger icon sizes for better visibility
- Applies specific styling for card back context

### FactCardBack

A container component that represents the back of a fact card:

- Provides colored background with consistent styling
- Handles variations for standard cards vs final five cards
- Shows appropriate styling for cards in the stack

## Hooks

### useIconSize

Handles size calculations for icons:
- Determines container size classes
- Calculates appropriate icon dimensions
- Handles responsive sizing

### useIconStyles

Manages styling for icons based on state:
- Applies theme-specific styles
- Handles revealed/hidden state differences
- Manages filters and transformations

### useIconFilter

From iconHelpers.ts, provides color filters for icons based on category.

### useFactCardBackIcon

Manages logic for the specialized card back icons:
- Handles category detection and normalization
- Calculates appropriate icon sizes
- Creates memoized styles for consistent white icons

### useFactCardBack

Manages styling and classes for fact card backs:
- Builds conditional class names based on card state
- Creates background styles based on theme colors
- Optimizes re-renders with memoization

## Styles

### iconStyles.ts

Contains reusable style constants:
- Container classes
- Animation settings
- Helper functions for style generation

### factCardBackStyles.ts

Contains styles specific to card backs:
- Container classes
- State-specific classes
- Background style helpers

## Helpers

### iconHelpers.ts

Contains utilities for working with icons:
- Icon mapping between fact types and icon files
- Filter generation for colored icons
- Icon information retrieval

## Flow of Data

1. Component receives properties (factType, size, etc.)
2. Hooks calculate appropriate sizes and styles
3. Helper functions map factType to the correct icon
4. Styles are applied with appropriate variations
5. Icon is rendered with correct visual properties

## Benefits

1. **Consistency**: Icons look and behave the same across the application
2. **Reusability**: Icon components can be used in various contexts
3. **Maintainability**: Changes to icon styling can be made in one place
4. **Performance**: Memoization prevents unnecessary re-rendering 