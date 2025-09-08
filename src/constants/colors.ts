export const COLORS = {
  // Theme color mappings
  THEME_COLORS: {
    primary: 'primary',
    secondary: 'secondary',
    accent: 'accent'
  } as const,

  // CSS variable helpers
  getVar: (color: string, opacity?: string): string => {
    return `var(--color-${color}${opacity ? opacity : ''})`;
  },

  // Common color utilities
  withOpacity: (color: string, opacity: string): string => {
    return `var(--color-${color}${opacity})`;
  }
} as const;