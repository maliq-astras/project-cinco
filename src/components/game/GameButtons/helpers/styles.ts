/**
 * Generate CSS custom properties for GameButtons theming
 */
export const getButtonContainerStyle = (primaryColor: string): React.CSSProperties => ({
  '--button-color': `var(--color-${primaryColor})`,
  '--button-active-bg': `var(--color-${primaryColor}20)`,
  '--divider-color': `var(--color-${primaryColor}40)`,
  '--tooltip-color': `var(--color-${primaryColor})`
} as React.CSSProperties);