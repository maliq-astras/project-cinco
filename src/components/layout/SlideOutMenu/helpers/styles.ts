export const getBackdropStyle = () => ({
  backdropFilter: 'blur(12px)',
});

export const getMenuTitleStyle = (primaryColor: string) => ({
  color: `var(--color-${primaryColor})`
});

export const getCloseButtonStyle = (primaryColor: string) => ({
  color: `var(--color-${primaryColor})`
});