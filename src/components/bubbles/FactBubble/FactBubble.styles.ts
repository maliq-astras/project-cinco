import { CSSProperties } from 'react';

/**
 * Remaining styles for the FactBubble component
 * TODO: These will be migrated to CSS modules in future iterations
 */
export const factBubbleStyles = {
  // Icon styles - keeping as function for now since it works well
  icon: (isClickable: boolean): CSSProperties => ({
    filter: 'var(--icon-filter)',
    opacity: isClickable ? 0.7 : 0.4,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const
  })
} as const;

// getBubbleClassNames function removed - now handled by CSS modules 