export const getModalStyle = (primaryColor: string) => ({
  borderColor: `var(--color-${primaryColor})`,
  boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 4px var(--color-${primaryColor})`
});

export const getXMarkCircleStyle = (primaryColor: string, accentColor: string) => ({
  backgroundColor: `var(--color-${primaryColor})`,
  borderColor: `var(--color-${accentColor})`,
  boxShadow: `0 4px 12px rgba(var(--color-${primaryColor}-rgb), 0.4)`
});

export const getGlowingRingStyle = (primaryColor: string) => ({
  backgroundColor: `var(--color-${primaryColor})`
});

export const getTitleStyle = (primaryColor: string) => ({
  color: `var(--color-${primaryColor})`
});

export const getProgressDotStyle = (primaryColor: string, isActive: boolean) => ({
  backgroundColor: isActive ? `var(--color-${primaryColor})` : 'transparent',
  borderColor: `var(--color-${primaryColor})`
});